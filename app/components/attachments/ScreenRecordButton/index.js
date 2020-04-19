import { connect } from 'react-redux';
import * as screenRecordingActions from 'actions/screenRecording';
import ScreenRecordButton from './ScreenRecordButton';

const mapStateToProps = (state, ownProps) => {
  const {
    screenRecording
  } = state;

  return { ...screenRecording, onSuccess: ownProps.onSuccess };
};

const mapDispatchToProps = {
  ...screenRecordingActions
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenRecordButton);