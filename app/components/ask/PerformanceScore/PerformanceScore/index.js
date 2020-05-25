import { connect } from 'react-redux';
import { togglePerformanceScore } from 'actions/ask';
import PerformanceScore from './PerformanceScore';

const mapStateToProps = (state) => {
  const {
    ask: { showPerformanceScore },
    profile: { badge, performance }
  } = state;

  let remainingAccomplishments = [];
  if (performance.length !== 0) {
    remainingAccomplishments = performance[0].accomplishments.filter(
      ({ isComplete }) => !isComplete
    );
  }

  return {
    badge,
    performance,
    remainingAccomplishments,
    showPerformanceScore,
    togglePerformanceScore
  };
};

const mapDispatchToProps = {
  togglePerformanceScore
};

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceScore);
