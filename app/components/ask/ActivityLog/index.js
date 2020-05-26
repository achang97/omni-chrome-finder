import { connect } from 'react-redux';
import { requestGetRecentCards, requestGetActivityLog, updateActivityIndex } from 'actions/ask';
import ActivityLog from './ActivityLog';

const mapStateToProps = (state) => {
  const {
    ask: {
      showPerformanceScore,
      recentCards,
      isGettingRecentCards,
      activityIndex,
      activityLog,
      isGettingActivityLog
    },
    profile: {
      user: { _id: ownUserId }
    }
  } = state;

  return {
    showPerformanceScore,
    recentCards,
    isGettingRecentCards,
    activityIndex,
    activityLog,
    isGettingActivityLog,
    ownUserId
  };
};

const mapDispatchToProps = {
  requestGetRecentCards,
  requestGetActivityLog,
  updateActivityIndex
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLog);
