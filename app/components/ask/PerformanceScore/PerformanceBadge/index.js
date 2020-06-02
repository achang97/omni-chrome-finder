import { connect } from 'react-redux';
import { togglePerformanceScore } from 'actions/ask';
import PerformanceBadge from './PerformanceBadge';

const mapStateToProps = (state) => {
  const {
    profile: { badge, percentage, isGettingOnboardingStats }
  } = state;

  return {
    badge,
    percentage,
    isGettingOnboardingStats
  };
};

const mapDispatchToProps = {
  togglePerformanceScore
};

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceBadge);
