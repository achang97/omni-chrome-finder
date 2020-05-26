import { connect } from 'react-redux';
import Ask from './Ask';

const mapStateToProps = (state) => {
  const {
    ask: { showAskTeammate }
  } = state;

  return { showAskTeammate };
};

export default connect(mapStateToProps)(Ask);
