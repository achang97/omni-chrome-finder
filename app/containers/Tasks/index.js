import { connect } from 'react-redux';
import { updateTasksOpenSection, requestGetTasks, updateTasksTab, removeTask } from 'actions/tasks';
import Tasks from './Tasks';

const mapStateToProps = (state) => {
  const {
    tasks: { tabIndex, tasks, openSection, isGettingTasks }
  } = state;

  return { tabIndex, tasks, openSection, isGettingTasks };
};

const mapDispatchToProps = {
  updateTasksOpenSection,
  requestGetTasks,
  updateTasksTab,
  removeTask
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
