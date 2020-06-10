import { URL, WEB_APP_ROUTES, CHROME } from 'appConstants';
import { getStorage, setStorage, addStorageListener, removeStorageListener } from 'utils/storage';
import { logout, syncAuthInfo } from 'actions/auth';
import { injectExtension, loadScript } from './inject';
import initSocket from './socket';

let justInstalled = false;

chrome.runtime.onUpdateAvailable.addListener(() => {
  // Automatically update
  chrome.runtime.reload();
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    justInstalled = true;
    window.open(`${URL.WEB_APP}${WEB_APP_ROUTES.SIGNUP}`);
  }
});

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (sender.origin === URL.WEB_APP) {
    // Send back basic response
    sendResponse(`Successfully received message from ${URL.WEB_APP}.`);
  }
});

chrome.runtime.onConnectExternal.addListener((port) => {
  const sendMessage = (auth) => {
    if (auth && auth.token) {
      const { user, token, refreshToken } = auth;
      port.postMessage(syncAuthInfo(user, token, refreshToken));
    } else {
      port.postMessage(logout());
    }
  };

  getStorage(CHROME.STORAGE.AUTH)
    .then((auth) => {
      if (!justInstalled || (auth && auth.token)) {
        sendMessage(auth);
      } else {
        port.postMessage({ type: CHROME.EXTERNAL_MESSAGE.INSTALL });
      }

      justInstalled = false;
    })
    .catch(() => {
      if (justInstalled) {
        port.postMessage({ type: CHROME.EXTERNAL_MESSAGE.INSTALL });
        justInstalled = false;
      }
    });

  const listener = addStorageListener(CHROME.STORAGE.AUTH, ({ newValue, oldValue }) => {
    const newToken = newValue && newValue.token;
    const oldToken = oldValue && oldValue.token;

    if (newToken !== oldToken) {
      sendMessage(newValue);
    }
  });

  port.onMessage.addListener((message) => {
    const { type, payload } = message;
    switch (type) {
      case CHROME.EXTERNAL_MESSAGE.LOGIN_SUCCESS:
      case CHROME.EXTERNAL_MESSAGE.SIGNUP_SUCCESS: {
        const { user, token, refreshToken } = payload;
        setStorage(CHROME.STORAGE.AUTH, { user, token, refreshToken });
        break;
      }
      case CHROME.EXTERNAL_MESSAGE.LOGOUT: {
        setStorage(CHROME.STORAGE.AUTH, { user: {} });
        break;
      }
      default:
        break;
    }
  });

  port.onDisconnect.addListener(() => removeStorageListener(listener));
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  try {
    switch (changeInfo.status) {
      case 'loading': {
        initSocket();

        const isInjected = await injectExtension(tabId);
        if (!chrome.runtime.lastError && !isInjected) {
          loadScript('inject', tabId);
        }

        break;
      }
      case 'complete': {
        const isInjected = await injectExtension(tabId);
        if (isInjected) {
          chrome.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.TAB_UPDATE });
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    // Do nothing
  }
});

chrome.browserAction.onClicked.addListener(async (tab) => {
  try {
    const tabId = tab.id;
    const isInjected = await injectExtension(tabId);
    if (!chrome.runtime.lastError) {
      if (!isInjected) {
        loadScript('inject', tabId, () => {
          chrome.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.TOGGLE });
        });

        initSocket();
      } else {
        chrome.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.TOGGLE });
      }
    }
  } catch (error) {
    window.open(URL.EXTENSION);
  }
});
