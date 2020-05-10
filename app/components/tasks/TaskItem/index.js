import { connect } from 'react-redux';
import {
  requestMarkUpToDateFromTasks,
  requestDismissTask,
  requestApproveCardFromTasks
} from 'actions/tasks';
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
  requestApproveCardFromTasks,
  openCard
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem);
