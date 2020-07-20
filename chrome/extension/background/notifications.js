import _ from 'lodash';
import queryString from 'query-string';
import { CHROME, URL } from 'appConstants';
import { getStorage, setStorage } from 'utils/storage';
import { getActiveTab, injectExtension, loadScript } from './inject';

export default function createNotification({ message, notification }) {
  const { notifier, resolver, card, status, resolved, _id } = notification;

  // Create chrome notification only if resolver !== notifier
  if (resolver && resolver._id !== notifier._id) {
    const notificationId =
      _id && !resolved
        ? `${CHROME.NOTIFICATION_TYPE.TASK}-${status}-${_id}`
        : `${CHROME.NOTIFICATION_TYPE.CARD}-${status}-${card._id}`;

    const notifierName = notifier ? `${notifier.firstname} ${notifier.lastname}` : 'Omni';
    chrome.notifications.create(notificationId, {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('/img/icon-128.png'),
      title: message,
      message: `Card: "${card.question}"`,
      contextMessage: `Sent by ${resolved ? resolver.name : notifierName}`
    });
  }

  if (_id) {
    getStorage(CHROME.STORAGE.TASKS).then((tasks) => {
      if (tasks) {
        let newTasks;
        if (resolved) {
          newTasks = tasks.filter((task) => task._id !== _id);
        } else {
          newTasks = _.unionBy([notification], tasks, '_id');
        }

        setStorage(CHROME.STORAGE.TASKS, newTasks);
      }
    });
  }
}

function openNotification(windowId, tabId, payload) {
  chrome.windows.update(windowId, { focused: true });
  chrome.tabs.sendMessage(tabId, {
    type: CHROME.MESSAGE.NOTIFICATION_OPENED,
    payload
  });
}

function openNotificationNewTab(type, id) {
  let queryParams = {};
  switch (type) {
    case CHROME.NOTIFICATION_TYPE.TASK: {
      queryParams = { taskId: id };
      break;
    }
    case CHROME.NOTIFICATION_TYPE.CARD: {
      queryParams = { cardId: id };
      break;
    }
    default:
      break;
  }

  const link = `${URL.EXTENSION}?${queryString.stringify(queryParams)}`;
  const newWindow = window.open(link, '_blank');
  newWindow.focus();
}

chrome.notifications.onClicked.addListener(async (notificationId) => {
  chrome.notifications.clear(notificationId);

  const match = notificationId.match(/(\S+)-(\S+)-(\S+)/);
  const type = match[1];
  const id = match[3];

  getActiveTab().then(async (activeTab) => {
    try {
      if (activeTab) {
        const { windowId, id: activeTabId } = activeTab;
        const isInjected = await injectExtension(activeTabId);
        if (!chrome.runtime.lastError) {
          if (!isInjected) {
            loadScript('inject', activeTabId, () => {
              openNotification(windowId, activeTabId, { type, id });
            });
          } else {
            openNotification(windowId, activeTabId, { type, id });
          }
        }
      } else {
        openNotificationNewTab(type, id);
      }
    } catch (error) {
      openNotificationNewTab(type, id);
    }
  });
});
