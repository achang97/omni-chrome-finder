import { addStorageListener } from '../../../app/utils/storage';
import { colors } from '../../../app/styles/colors';

chrome.browserAction.setBadgeBackgroundColor({ color: colors.purple.reg });

addStorageListener('tasks', ({ newValue: tasks }) => {
  if (tasks) {        
    const numTasks = tasks.filter(task => !task.resolved).length;
    const numTasksString = numTasks === 0 ? "" : numTasks.toString();
    chrome.browserAction.setBadgeText({ text: numTasksString });
  }
});
