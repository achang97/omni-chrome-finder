import { URL, WEB_APP_ROUTES, CHROME } from 'appConstants';
import { injectExtension, loadScript } from './inject';
import initSocket from './socket';

chrome.runtime.onUpdateAvailable.addListener(() => {
  // Automatically update
  chrome.runtime.reload();
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    window.open(`${URL.WEB_APP}${WEB_APP_ROUTES.SIGNUP}`);
  }
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
