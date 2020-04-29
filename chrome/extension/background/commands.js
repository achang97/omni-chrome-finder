import { CHROME, URL } from 'appConstants';
import { getActiveTab, loadScript, injectExtension } from './inject';

function handleCommand(tabId, command) {
  switch (command) {
    case CHROME.COMMAND.OPEN_EXTENSION: {
      chrome.tabs.sendMessage(tabId, { type: CHROME.COMMAND.OPEN_EXTENSION });
    }
  }
}

chrome.commands.onCommand.addListener(async (command) => {
  getActiveTab().then(async (activeTab) => {
    try {
      if (activeTab) {
        const tabId = activeTab.id;

        const isInjected = (await injectExtension(tabId))[0];
        if (!isInjected) {
          loadScript('inject', tabId, () => {
            handleCommand(tabId, command);
          });
        } else {
          handleCommand(tabId, command);
        }
      } else {
        window.open(URL.EXTENSION);
      }
    } catch (error) {
      window.open(URL.EXTENSION);
    }
  });
})