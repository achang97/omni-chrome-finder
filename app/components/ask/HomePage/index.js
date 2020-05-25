import { connect } from 'react-redux';
import { requestGetUserOnboardingStats } from 'actions/profile';
import {
  togglePerformanceScore,
  toggleAskTeammate,
  updateAskSearchText,
  requestGetRecentCards
} from 'actions/ask';
import HomePage from './HomePage';

const mapStateToProps = (state) => {
  const {
    ask: { showPerformanceScore, showAskTeammate, searchText, recentCards, isGettingRecentCards },
    profile: { badge, percentage, performance, isGettingOnboardingStats },
    display: { dockVisible }
  } = state;

  let remainingAccomplishments = [];
  if (performance.length !== 0) {
    remainingAccomplishments = performance[0].accomplishments.filter(
      ({ isComplete }) => !isComplete
    );
  }

  return {
    showPerformanceScore,
    showAskTeammate,
    searchText,
    recentCards,
    isGettingRecentCards,
    isGettingOnboardingStats,
    badge,
    percentage,
    performance,
    remainingAccomplishments,
    dockVisible
  };
};

const mapDispatchToProps = {
  togglePerformanceScore,
  toggleAskTeammate,
  updateAskSearchText,
  requestGetUserOnboardingStats,
  requestGetRecentCards
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
