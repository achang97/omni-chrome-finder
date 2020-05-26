import { connect } from 'react-redux';
import { togglePerformanceScore } from 'actions/ask';
import PerformanceBadge from './PerformanceBadge';

const mapStateToProps = (state) => {
  const {
    ask: { showPerformanceScore },
    profile: { badge, percentage, performance, isGettingOnboardingStats }
  } = state;

  return {
    badge,
    percentage,
    hasLoadedPerformance: performance.length !== 0,
    showPerformanceScore,
    isGettingOnboardingStats
  };
};

const mapDispatchToProps = {
  togglePerformanceScore
};

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceBadge);
