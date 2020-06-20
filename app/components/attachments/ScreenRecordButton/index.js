import { connect } from 'react-redux';
import { initScreenRecording, endScreenRecording } from 'actions/screenRecording';
import { withRouter } from 'react-router';
import ScreenRecordButton from './ScreenRecordButton';

const mapStateToProps = (state) => {
  const {
    screenRecording: { activeId, isSharingDesktop },
    display: { dockVisible }
  } = state;

  return { activeId, isSharingDesktop, dockVisible };
};

const mapDispatchToProps = {
  initScreenRecording,
  endScreenRecording
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ScreenRecordButton));
