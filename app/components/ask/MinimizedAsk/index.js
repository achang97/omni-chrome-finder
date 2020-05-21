import { connect } from 'react-redux';
import { requestGetUserOnboardingStats } from 'actions/profile';
import { toggleDockHeight } from 'actions/display';
import { togglePerformanceScore, updateAskSearchText, requestGetRecentCards } from 'actions/ask';
import MinimizedAsk from './MinimizedAsk';

const mapStateToProps = (state) => {
  const {
    ask: { showPerformanceScore, searchText, recentCards, isGettingRecentCards },
    profile: { badge, percentage, performance, isGettingOnboardingStats },
    display: { dockVisible, dockExpanded }
  } = state;

  let remainingAccomplishments = [];
  if (performance.length !== 0) {
    remainingAccomplishments = performance[0].accomplishments.filter(
      ({ isComplete }) => !isComplete
    );
  }

  return {
    showPerformanceScore,
    searchText,
    recentCards,
    isGettingRecentCards,
    isGettingOnboardingStats,
    badge,
    percentage,
    performance,
    remainingAccomplishments,
    dockVisible,
    dockExpanded
  };
};

const mapDispatchToProps = {
  togglePerformanceScore,
  updateAskSearchText,
  toggleDockHeight,
  requestGetUserOnboardingStats,
  requestGetRecentCards
};

export default connect(mapStateToProps, mapDispatchToProps)(MinimizedAsk);
