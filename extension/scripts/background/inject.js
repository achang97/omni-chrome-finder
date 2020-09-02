import browser from 'webextension-polyfill';
import { NODE_ENV } from 'appConstants';

export async function injectExtension(tabId) {
  const res = await browser.tabs.executeScript(tabId, {
    code: `var injected = window.reactExampleInjected;
      window.reactExampleInjected = true;
      injected;`,
    runAt: 'document_start'
  });
  return res[0];
}

export function getActiveTab() {
  return new Promise((resolve) => {
    browser.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
      if (tabs.length !== 0) {
        resolve(tabs[0]);
      } else {
        resolve(null);
      }
    });
  });
}

export async function loadScript(name, tabId) {
  if (chrome && process.env.NODE_ENV === NODE_ENV.DEV) {
    // Load redux-devtools-extension inject bundle,
    // because inject script and page is in a different context
    const request = new XMLHttpRequest();
    request.open('GET', 'chrome://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js'); // sync
    request.send();
    try {
      request.onload = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          browser.tabs.executeScript(tabId, {
            code: request.responseText,
            runAt: 'document_start'
          });
        }
      };
    } catch (error) {
      // Don't actually throw an error
      console.log(error);
    }
  }

  return browser.tabs.executeScript(tabId, {
    file: `/js/${name}.bundle.js`,
    runAt: 'document_end'
  });
}
