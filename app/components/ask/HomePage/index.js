import { connect } from 'react-redux';
import { requestGetUserOnboardingStats } from 'actions/profile';
import { toggleAskTeammate, updateAskSearchText, requestGetRecentCards } from 'actions/ask';
import HomePage from './HomePage';

const mapStateToProps = (state) => {
  const {
    ask: { showPerformanceScore, showAskTeammate, searchText, recentCards, isGettingRecentCards },
    display: { dockVisible }
  } = state;

  return {
    dockVisible,
    searchText,
    showPerformanceScore,
    showAskTeammate,
    recentCards,
    isGettingRecentCards
  };
};

const mapDispatchToProps = {
  updateAskSearchText,
  toggleAskTeammate,
  requestGetUserOnboardingStats,
  requestGetRecentCards
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
