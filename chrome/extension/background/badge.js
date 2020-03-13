import { getStorage } from '../../../app/utils/storage';
import { colors } from '../../../app/styles/colors';

chrome.browserAction.setBadgeBackgroundColor({ color: colors.purple.reg });

getStorage('tasks').then((tasks) => {
  if (tasks) {
    // TODO: remove check for resolved tag
    const numTasks = tasks.filter(task => !task.resolved).length;
    if (numTasks > 0) {
      chrome.browserAction.setBadgeText({ text: numTasks.toString() });
    }
  }
});
