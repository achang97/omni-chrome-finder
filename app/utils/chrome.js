import { TASKS, ROUTES } from 'appConstants';

const CHROME_URL_REGEX = /^chrome:\/\/.*/;

export function isChromeUrl(url) {
  return !url || url.match(CHROME_URL_REGEX);
}

export function handleNotificationClick(taskId, tasks, updateTasksTab, updateTasksOpenSection, history) {
  if (taskId) {
    const task = tasks.find(({ _id }) => _id === taskId);
    if (task) {
      if (task.status === TASKS.TYPE.NEEDS_APPROVAL) {
        // Go to Needs Approval Tab
        updateTasksTab(1);
      } else {
        updateTasksTab(0);
        const taskSectionType = TASKS.SECTIONS.find(({ taskTypes }) => (
          taskTypes.length === 1 && taskTypes[0] === task.status
        ));
        updateTasksOpenSection(taskSectionType ? taskSectionType.type : TASKS.SECTION_TYPE.ALL);
      }
      history.push(ROUTES.TASKS);
    }
  }
}

export default { isChromeUrl, handleNotificationClick };