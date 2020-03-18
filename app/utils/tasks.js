import { TASKS_SECTIONS } from './constants';

export function createSectionedTasks(tasks) {
  const newTasks = {};
  TASKS_SECTIONS.forEach(({ type: taskType, taskTypes }) => {
    newTasks[taskType] = tasks.filter(task => (
      /*!task.resolved &&*/ taskTypes.includes(task.status)
    ));
  });  
  return newTasks;
}