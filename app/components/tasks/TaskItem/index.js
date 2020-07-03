import { connect } from 'react-redux';
import { requestMarkUpToDateFromTasks, requestDismissTask } from 'actions/tasks';
import { openCard } from 'actions/cards';
import TaskItem from './TaskItem';

const mapStateToProps = (state) => {
  const {
    profile: { user }
  } = state;

  return { ownUserId: user._id };
};

const mapDispatchToProps = {
  requestMarkUpToDateFromTasks,
  requestDismissTask,
  openCard
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem);
