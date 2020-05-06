import { connect } from 'react-redux';
import { requestGetUserOnboardingStats } from 'actions/profile';
import { toggleDockHeight } from 'actions/display';
import {
  toggleAskFeedbackInput, updateAskFeedback, requestSubmitFeedback,
  togglePerformanceScore, updateAskSearchText,
} from 'actions/ask';
import MinimizedAsk from './MinimizedAsk';

const mapStateToProps = state => {
  const { 
    ask: {
      showFeedback,
      feedback,
      isSubmittingFeedback,
      feedbackSuccess,
      feedbackError,
      showPerformanceScore,
      searchText,
    },
    profile: {
      badge,
      percentage,
      performance,
      isGettingOnboardingStats,
    },
    display: {
      dockVisible,
      dockExpanded
    }
  } = state;

  let remainingAccomplishments = [];
  if (performance.length !== 0) {
    remainingAccomplishments = performance[0].accomplishments.filter(({ isComplete }) => !isComplete);
  }

  return {
    showFeedback,
    feedback,
    isSubmittingFeedback,
    feedbackSuccess,
    feedbackError,
    showPerformanceScore,
    searchText,
    isGettingOnboardingStats,
    badge,
    percentage,
    performance,
    remainingAccomplishments,
    dockVisible,
    dockExpanded
  };
}

const mapDispatchToProps = {
  toggleAskFeedbackInput,
  updateAskFeedback,
  requestSubmitFeedback,
  togglePerformanceScore,
  updateAskSearchText,
  toggleDockHeight,
  requestGetUserOnboardingStats,
}

export default connect(mapStateToProps, mapDispatchToProps)(MinimizedAsk);
