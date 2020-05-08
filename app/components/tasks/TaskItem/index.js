import { connect } from 'react-redux';
import {
  requestMarkUpToDateFromTasks,
  requestDismissTask,
  requestApproveCardFromTasks
} from 'actions/tasks';
import { openCard } from 'actions/cards';
import { USER_ROLE } from 'appConstants/profile';
import TaskItem from './TaskItem';

const mapStateToProps = (state) => {
  const {
    profile: { user }
  } = state;

  return { ownUserId: user._id, isAdmin: user.role === USER_ROLE.ADMIN };
};

const mapDispatchToProps = {
  requestMarkUpToDateFromTasks,
  requestDismissTask,
  requestApproveCardFromTasks,
  openCard
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem);
