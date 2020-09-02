import browser from 'webextension-polyfill';
import { URL, WEB_APP_ROUTES, CHROME } from 'appConstants';
import { getStorage, setStorage, addStorageListener, removeStorageListener } from 'utils/storage';
import { logout, syncAuthInfo } from 'actions/auth';
import { injectExtension, loadScript } from './inject';
import initSocket from './socket';

const STATUS = {
  UPDATE_AVAILABLE: 'update_available',
  NO_UPDATE: 'no_update',
  THROTTLED: 'throttled'
};

const INSTALL_REASON = {
  INSTALL: 'install',
  UPDATE: 'update'
};

let justInstalled = false;
let lastUpdateStatus;

if (browser.runtime.requestUpdateCheck) {
  browser.runtime.requestUpdateCheck().then((status) => {
    lastUpdateStatus = status;

    if (status === STATUS.UPDATE_AVAILABLE) {
      browser.runtime.reload();
    }
  });
}

browser.runtime.onUpdateAvailable.addListener(() => {
  // Automatically update
  browser.runtime.reload();
});

browser.runtime.onInstalled.addListener(({ reason }) => {
  switch (reason) {
    case INSTALL_REASON.INSTALL: {
      justInstalled = true;
      window.open(`${URL.WEB_APP}${WEB_APP_ROUTES.SIGNUP}`);
      break;
    }
    case INSTALL_REASON.UPDATE: {
      lastUpdateStatus = STATUS.NO_UPDATE;
      break;
    }
    default:
      break;
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type } = message;
  switch (type) {
    case CHROME.EXTENSION_MESSAGE.CATCH_ERROR: {
      if (browser.runtime.requestUpdateCheck) {
        browser.runtime.requestUpdateCheck().then((status) => {
          if (status !== STATUS.THROTTLED) {
            lastUpdateStatus = status;
          }

          sendResponse(lastUpdateStatus === STATUS.UPDATE_AVAILABLE);
        });
      }

      // Mark as asynchronous response
      return true;
    }
    case CHROME.EXTENSION_MESSAGE.RELOAD_EXTENSION: {
      browser.runtime.reload();
      sendResponse('Successfully reloaded extension!');
      break;
    }
    default:
      break;
  }

  return false;
});

browser.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (sender.origin === URL.WEB_APP) {
    // Send back basic response
    sendResponse(`Successfully received message from ${URL.WEB_APP}.`);
  }
});

browser.runtime.onConnectExternal.addListener((port) => {
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

browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  try {
    switch (changeInfo.status) {
      case 'loading': {
        initSocket();

        const isInjected = await injectExtension(tabId);
        if (!browser.runtime.lastError && !isInjected) {
          await loadScript('inject', tabId);
        }

        break;
      }
      case 'complete': {
        const isInjected = await injectExtension(tabId);
        if (isInjected) {
          browser.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.TAB_UPDATE });
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

browser.browserAction.onClicked.addListener(async (tab) => {
  try {
    const tabId = tab.id;
    const isInjected = await injectExtension(tabId);
    if (!browser.runtime.lastError) {
      if (!isInjected) {
        await loadScript('inject', tabId);
        initSocket();
      }

      await browser.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.TOGGLE });
    }
  } catch (error) {
    window.open(URL.EXTENSION);
  }
});
