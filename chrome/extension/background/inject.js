import _ from 'lodash';
import { URL, NODE_ENV, CHROME, REQUEST } from 'appConstants';
import { setStorage, getStorage, addStorageListener } from 'utils/storage';
import { initSocket, closeSocket } from './socket';

export async function injectExtension(tabId) {
  const res = await chrome.tabs.executeScriptAsync(tabId, {
    code: `var injected = window.reactExampleInjected;
      window.reactExampleInjected = true;
      injected;`,
    runAt: 'document_start'
  });
  return res[0];
}

export function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
      if (tabs.length !== 0) {
        resolve(tabs[0])
      } else {
        resolve(null);
      }
    });
  });
}

export function loadScript(name, tabId, cb) {
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

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
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