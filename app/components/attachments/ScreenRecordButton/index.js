import { connect } from 'react-redux';
import * as screenRecordingActions from 'actions/screenRecording';
import { toggleDock } from 'actions/display';
import ScreenRecordButton from './ScreenRecordButton';

const mapStateToProps = (state, ownProps) => {
  const {
    screenRecording,
    display: {
      dockVisible
    }
  } = state;

  return { ...screenRecording, onSuccess: ownProps.onSuccess, dockVisible };
};

const mapDispatchToProps = {
  ...screenRecordingActions,
  toggleDock
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenRecordButton);