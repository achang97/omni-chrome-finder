import { connect } from 'react-redux';
import { togglePerformanceScore } from 'actions/ask';
import trackEvent from 'actions/analytics';
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
  togglePerformanceScore,
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceBadge);
