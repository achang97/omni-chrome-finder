import { CHROME_MESSAGE, CARD_URL_BASE } from '../../../app/utils/constants';
import { isNewTab } from '../../../app/utils/chrome';

const IDS = {
  PARENT: 'PARENT_MENU_ID',
  SEARCH: 'SEARCH_MENU_ID',
  ASK: 'ASK_MENU_ID',
  CREATE: 'CREATE_MENU_ID',
};

const BASE_CONTEXT_MENU_PROPS = {
  contexts: ["all"],
  documentUrlPatterns: [
    'https://*/*', 'http://*/*',
  ]
};

const ACTION_MENU_ITEMS = [
  {
    title: 'Ask Question',
    id: IDS.ASK,
  }, {
    title: 'Create Card',
    id: IDS.CREATE,
  }, {
    title: 'Search Omni',
    id: IDS.SEARCH,
  },
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


chrome.contextMenus.onClicked.addListener(({ menuItemId, selectionText = '' }, tab) => {
  if (isNewTab(tab.url)) {
    // TODO: add correct routing to actual tab
    window.open(CARD_URL_BASE);
  } else {
    const tabId = tab.id;

    switch (menuItemId) {
      case IDS.SEARCH:
        chrome.tabs.sendMessage(tabId, { type: CHROME_MESSAGE.SEARCH, payload: { selectionText } });
        break;
      case IDS.ASK:
        chrome.tabs.sendMessage(tabId, { type: CHROME_MESSAGE.ASK, payload: { selectionText } });
        break;
      case IDS.CREATE: {
        chrome.tabs.sendMessage(tabId, { type: CHROME_MESSAGE.CREATE, payload: { selectionText } });
        break;
      }
      default: {
        break;
      }
    }    
  }
});

