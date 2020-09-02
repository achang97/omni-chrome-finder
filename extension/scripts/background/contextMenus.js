import browser from 'webextension-polyfill';
import { CHROME } from 'appConstants';
import { injectExtension, loadScript } from './inject';

const IDS = {
  PARENT: 'PARENT_MENU_ID',
  SEARCH: 'SEARCH_MENU_ID',
  CREATE: 'CREATE_MENU_ID'
};

const BASE_CONTEXT_MENU_PROPS = {
  contexts: ['all'],
  documentUrlPatterns: ['https://*/*', 'http://*/*']
};

const ACTION_MENU_ITEMS = [
  {
    title: 'Search Omni',
    id: IDS.SEARCH
  },
  {
    title: 'Create Card',
    id: IDS.CREATE
  }
];

// Remove all context menus
browser.contextMenus.removeAll();

// Create Main Menu
browser.contextMenus.create({
  id: IDS.PARENT,
  title: 'Omni',
  ...BASE_CONTEXT_MENU_PROPS
});

ACTION_MENU_ITEMS.forEach(({ title, id }) => {
  browser.contextMenus.create({
    parentId: IDS.PARENT,
    title,
    id,
    ...BASE_CONTEXT_MENU_PROPS
  });
});

function handleMenuAction(tabId, menuItemId, selectionText) {
  switch (menuItemId) {
    case IDS.SEARCH:
      browser.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.SEARCH, payload: { selectionText } });
      break;
    case IDS.CREATE: {
      browser.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.CREATE, payload: { selectionText } });
      break;
    }
    default: {
      break;
    }
  }
}

browser.contextMenus.onClicked.addListener(async ({ menuItemId, selectionText = '' }, tab) => {
  const tabId = tab.id;

  // Attempt to inject extension
  // TODO: should take this out once <all_urls> permission is enabled
  const isInjected = await injectExtension(tabId);
  if (!isInjected) {
    await loadScript('inject', tabId);
  }

  handleMenuAction(tabId, menuItemId, selectionText);
});
