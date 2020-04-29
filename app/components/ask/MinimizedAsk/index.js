import { connect } from 'react-redux';
import { requestGetUserOnboardingStats } from 'actions/profile';
import { toggleDockHeight } from 'actions/display';
import {
  toggleAskFeedbackInput, updateAskFeedback, requestSubmitFeedback,
  togglePerformanceScore, updateAskSearchText,
} from 'actions/ask';
import { requestSearchCards } from 'actions/search';
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
      onboardingStats,
    },
    display: {
      dockVisible,
      dockExpanded
    }
  } = state;

  return {
    showFeedback,
    feedback,
    isSubmittingFeedback,
    feedbackSuccess,
    feedbackError,
    showPerformanceScore,
    searchText,
    onboardingStats,
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
  requestSearchCards,
  toggleDockHeight,
  requestGetUserOnboardingStats,
}

export default connect(mapStateToProps, mapDispatchToProps)(MinimizedAsk);
