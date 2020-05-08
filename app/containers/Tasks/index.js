import { connect } from 'react-redux';
import { updateTasksOpenSection, requestGetTasks, updateTasksTab, removeTask } from 'actions/tasks';
import Tasks from './Tasks';

const mapStateToProps = (state) => {
  const { tasks } = state;

  return { ...tasks };
};

const mapDispatchToProps = {
  updateTasksOpenSection,
  requestGetTasks,
  updateTasksTab,
  removeTask
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
