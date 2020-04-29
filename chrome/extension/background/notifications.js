import queryString from 'query-string';
import { CHROME, URL } from 'appConstants';
import { getActiveTab, injectExtension, loadScript } from './inject';
import { getStorage, setStorage } from 'utils/storage';

export function createNotification({ userId, message, notification }) {
  const { notifier, resolver, card, question, status, resolved, _id } = notification;

  // Create chrome notification
  const notificationId = (_id && !resolved) ?
    `${CHROME.NOTIFICATION_TYPE.TASK}-${status}-${_id}` :
    `${CHROME.NOTIFICATION_TYPE.CARD}-${status}-${card._id}`;

  const notifierName = notifier ? `${notifier.firstname} ${notifier.lastname}` : 'Omni';
  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('/img/icon-128.png'),
    title: message,
    message: `Card: "${question}"`,
    contextMessage: `Sent by ${resolved ? resolver.name : notifierName}`,
  });

  if (_id) {
    getStorage(CHROME.STORAGE.TASKS).then(tasks => {
      if (tasks) {
        let newTasks;
        if (resolved) {
          newTasks = tasks.filter(task => task._id !== _id);
        } else {
          newTasks = _.unionBy(tasks, [notification], '_id');
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
  }

  const link = `${URL.EXTENSION}?${queryString.stringify(queryParams)}`;
  const newWindow = window.open(link, '_blank');
  newWindow.focus();
}

chrome.notifications.onClicked.addListener(async (notificationId) => {
  chrome.notifications.clear(notificationId);
  const [match, type, status, id] = notificationId.match(/(\S+)-(\S+)-(\S+)/);
  
  getActiveTab().then(async activeTab => {
    try {
      if (activeTab) {
        const { windowId, id: activeTabId } = activeTab;
        const isInjected = (await injectExtension(activeTabId))[0];
        if (!chrome.runtime.lastError) {
          if (!isInjected) {
            loadScript('inject', tabId, () => {
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