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
chrome.contextMenus.removeAll();

// Create Main Menu
chrome.contextMenus.create({
  id: IDS.PARENT,
  title: 'Omni',
  ...BASE_CONTEXT_MENU_PROPS
});

ACTION_MENU_ITEMS.forEach(({ title, id }) => {
  chrome.contextMenus.create({
    parentId: IDS.PARENT,
    title,
    id,
    ...BASE_CONTEXT_MENU_PROPS
  });
});

function handleMenuAction(tabId, menuItemId, selectionText) {
  switch (menuItemId) {
    case IDS.SEARCH:
      chrome.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.SEARCH, payload: { selectionText } });
      break;
    case IDS.CREATE: {
      chrome.tabs.sendMessage(tabId, { type: CHROME.MESSAGE.CREATE, payload: { selectionText } });
      break;
    }
    default: {
      break;
    }
  }
}

chrome.contextMenus.onClicked.addListener(async ({ menuItemId, selectionText = '' }, tab) => {
  const tabId = tab.id;

  // Attempt to inject extension
  // TODO: should take this out once <all_urls> permission is enabled
  const isInjected = await injectExtension(tabId);
  if (!isInjected) {
    loadScript('inject', tabId, () => {
      handleMenuAction(tabId, menuItemId, selectionText);
    });
  } else {
    handleMenuAction(tabId, menuItemId, selectionText);
  }
});
