import browser from 'webextension-polyfill';
import { CHROME, URL } from 'appConstants';
import { getActiveTab, loadScript, injectExtension } from './inject';

async function handleCommand(tabId, command) {
  switch (command) {
    case CHROME.COMMAND.OPEN_EXTENSION: {
      await browser.tabs.sendMessage(tabId, { type: CHROME.COMMAND.OPEN_EXTENSION });
      break;
    }
    default:
      break;
  }
}

browser.commands.onCommand.addListener(async (command) => {
  getActiveTab().then(async (activeTab) => {
    try {
      if (activeTab) {
        const tabId = activeTab.id;

        const isInjected = await injectExtension(tabId);
        if (!isInjected) {
          await loadScript('inject', tabId);
        }

        await handleCommand(tabId, command);
      } else {
        window.open(URL.EXTENSION);
      }
    } catch (error) {
      window.open(URL.EXTENSION);
    }
  });
});
