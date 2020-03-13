import io from 'socket.io-client';
import { CHROME_MESSAGE } from '../../../app/utils/constants';

let socket;

function isInjected(tabId) {
  return chrome.tabs.executeScriptAsync(tabId, {
    code: `var injected = window.reactExampleInjected;
      window.reactExampleInjected = true;
      injected;`,
    runAt: 'document_start'
  });
}

function loadScript(name, tabId, cb) {
  if (process.env.NODE_ENV === 'production') {
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

function initSocket() {
  socket = io('http://localhost:8000');
  // socket.on('connect', () => {});
  // socket.on('event', (data) => {});
  // socket.on('disconnect', () => {});
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  switch (changeInfo.status) {
    case 'loading': {
      const result = await isInjected(tabId);
      if (!chrome.runtime.lastError && !result[0]) {
        loadScript('inject', tabId);
      }

      if (!socket) {
        initSocket();
      }

      break;      
    }
    case 'complete': {
      const result = await isInjected(tabId);
      if (result[0]) {
        chrome.tabs.sendMessage(tabId, { type: CHROME_MESSAGE.TAB_UPDATE });
      }
      break;
    }
  }
});

chrome.browserAction.onClicked.addListener(async (tab) => {
  const tabId = tab.id;
  const result = await isInjected(tabId);
  if (!chrome.runtime.lastError && result[0]) {
    chrome.tabs.sendMessage(tabId, { type: CHROME_MESSAGE.TOGGLE });
  }
});
