import _ from 'lodash';
import { WEB_APP_EXTENSION_URL, NODE_ENV, CHROME, REQUEST } from 'appConstants';
import { storage, chrome as chromeUtils } from 'utils';
import { getStorage, setStorage, addStorageListener } from 'utils/storage';

let socket;

function injectExtension(tabId) {
  return chrome.tabs.executeScriptAsync(tabId, {
    code: `var injected = window.reactExampleInjected;
      window.reactExampleInjected = true;
      injected;`,
    runAt: 'document_start'
  });
}

function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
      if (tabs.length !== 0) {
        resolve(tabs[0])
      } else {
        reject('No active tab.');
      }
    });
  });
}

function loadScript(name, tabId, cb) {
  if (process.env.NODE_ENV === NODE_ENV.PROD) {
    chrome.tabs.executeScript(tabId, { file: `/js/${name}.bundle.js`, runAt: 'document_end' }, cb);
  } else {
    // dev: async fetch bundle
    fetch(`http://localhost:3000/js/${name}.bundle.js`)
    .then(res => res.text())
    .then((fetchRes) => {
      // Load redux-devtools-extension inject bundle,
      // because inject script and page is in a different context
      const request = new XMLHttpRequest();
      request.open('GET', 'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js');  // sync
      request.send();
      request.onload = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          chrome.tabs.executeScript(tabId, { code: request.responseText, runAt: 'document_start' });
        }
      };
      chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb);
    });
  }
}

function createNotification({ userId, message, notification }) {
  const { notifier, resolver, card, question, status, resolved, _id: notificationId } = notification;
       
  // Create chrome notification
  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('/img/icon-128.png'),
    title: message,
    message: `Card: "${question}"`,
    contextMessage: `Sent by ${resolved ? resolver.name : notifier.name}`,
  });

  getStorage('tasks').then(tasks => {
    if (tasks) {
      let newTasks;
      if (resolved) {
        newTasks = tasks.filter(({ _id }) => _id !== notificationId);
      } else {
        newTasks = _.unionBy(tasks, [notification], '_id');
      }

      setStorage('tasks', newTasks);
    }
  });
}

function initSocket() {
  getStorage('auth').then((auth) => {
    const token = auth && auth.token;
    if (token && !socket) {
      const protocol = process.env.NODE_ENV === NODE_ENV.DEV ? 'ws://' : 'wss://';
      const wsToken = token.replace('Bearer ', '');
      socket = new WebSocket(`${protocol}${REQUEST.URL.BASE}/ws/generic?auth=${wsToken}`);

      socket.onopen = () => {
        console.log('Connected socket!');
      };

      socket.onclose = () => {
        console.log('Disconnected socket!');
        socket = null;
      };

      socket.onmessage = (event) => {
        console.log('Received data from socket: ', event);
        getStorage('auth').then((auth) => {
          const isLoggedIn = auth && auth.token;
          const isVerified = auth && auth.user && auth.user.isVerified;
          if (isLoggedIn && isVerified) {
            const { type, data: payload } = JSON.parse(event.data);
            createNotification(payload);
          }
        });
      };

      socket.onerror = (error) => {
        console.log('Socket error: ', error);
      };
    }
  });
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!chromeUtils.isChromeUrl(tab.url)) {
    switch (changeInfo.status) {
      case 'loading': {
        const isInjected = (await injectExtension(tabId))[0];
        if (!chrome.runtime.lastError && !isInjected) {
          loadScript('inject', tabId);
        }

        if (!socket) {
          initSocket();
        }

        break;      
      }
      case 'complete': {
        const isInjected = (await injectExtension(tabId))[0];
        if (isInjected) {
          chrome.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.TAB_UPDATE });
        }
        break;
      }
    }
  }
});

chrome.browserAction.onClicked.addListener(async (tab) => {
  if (chromeUtils.isChromeUrl(tab.url)) {
    window.open(WEB_APP_EXTENSION_URL);
  } else {
    const tabId = tab.id;
    const isInjected = (await injectExtension(tabId))[0];
    if (!chrome.runtime.lastError) {
      if (!isInjected) {
        loadScript('inject', tabId, () => {
          chrome.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.TOGGLE });
        });

        if (!socket) {
          initSocket();
        }
      } else {
        chrome.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.TOGGLE });
      }
    }    
  }
});

chrome.notifications.onClicked.addListener(async (notificationId) => {
  chrome.notifications.clear(notificationId);

  getActiveTab().then(activeTab => {
    if (activeTab) {
      const { windowId, id } = activeTab;
      chrome.windows.update(windowId, { focused: true });
      chrome.tabs.sendMessage(id, {
        type: CHROME.MESSAGE.NOTIFICATION_OPENED,
        payload: { notificationId }
      });        
    } else {
      const newWindow = window.open(`${WEB_APP_EXTENSION_URL}?taskId=${notificationId}`, '_blank');
      newWindow.focus();
    }
  })
});

addStorageListener(CHROME.STORAGE.AUTH, ({ newValue }) => {
  if (!newValue.token && socket) {
    console.log('Logged out, closing socket.');
    socket.close();
    socket = null;
  } else if (newValue.token && !socket) {
    initSocket();
  }
});
