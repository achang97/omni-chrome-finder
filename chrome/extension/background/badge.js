import { addStorageListener } from 'utils/storage';
import { colors } from 'styles/colors';
import { CHROME } from 'appConstants';

chrome.browserAction.setBadgeBackgroundColor({ color: colors.gold.light });

addStorageListener(CHROME.STORAGE.TASKS, ({ newValue: tasks }) => {
  if (tasks) {        
    const numTasks = tasks.filter(task => !task.resolved).length;
    const numTasksString = numTasks === 0 ? '' : numTasks.toString();
    chrome.browserAction.setBadgeText({ text: numTasksString });
  }
});
