import { connect } from 'react-redux';
import * as screenRecordingActions from 'actions/screenRecording';
import ScreenRecordButton from './ScreenRecordButton';

const mapStateToProps = state => {
  const {
    screenRecording
  } = state;

  return { ...screenRecording };
};

const mapDispatchToProps = {
  ...screenRecordingActions
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenRecordButton);