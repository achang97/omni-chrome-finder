import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FaRegDotCircle } from 'react-icons/fa';
import { IoIosSquare } from 'react-icons/io';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '../../common/Button';
import * as screenRecordingActions from '../../../actions/screenRecording';

import attachmentsStyle from '../styles/attachments.css';
import screenRecordButtonStyle from './screen-record-button.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(attachmentsStyle, screenRecordButtonStyle);

/*
 * This has to be a class and not a constant, due to some issues with the
 * callbacks related to MediaRecorder.
 */
class ScreenRecordButton extends Component {
  endRecording = () => {
    const { endScreenRecording, onSuccess, recordedChunks } = this.props;

    const now = moment().format('DD.MM.YYYY HH:mm:ss');
    const recording = new File(recordedChunks, `Screen Recording ${now}.webm`, { type: 'video/webm' });
    onSuccess(recording);  
    endScreenRecording();
  }

  stopStream = () => {
    const { mediaRecorder, localStream } = this.props;

    if (mediaRecorder) {
      mediaRecorder.stop();
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
  }

  handleStreamSuccess = (stream) => {
    const { addScreenRecordingChunk, startScreenRecording } = this.props;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        addScreenRecordingChunk(event.data);
      }
    };
    mediaRecorder.start(10);

    stream.oninactive = () => {
      this.endRecording();
    };

    startScreenRecording(stream, mediaRecorder);
  }

  startRecording = () => {
    const { handleScreenRecordingError, onError } = this.props;

    navigator.mediaDevices
      .getDisplayMedia({
        audio: false,
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 }
        }
      })
      .then(this.handleStreamSuccess)
      .catch((error) => {
        handleScreenRecordingError(error);
        onError(error);
      });
  }

  render() {
    const { isSharingDesktop, abbrText, showText, className } = this.props;

    let onClick, text, Icon;
    if (!isSharingDesktop) {
      onClick = this.startRecording;
      text = abbrText ? 'Record' : 'Screen Record';
      Icon = FaRegDotCircle;
    } else {
      onClick = this.stopStream;
      text = abbrText ? 'End' : 'End Recording';
      Icon = IoIosSquare;
    }

    return (
      <Button
        onClick={() => onClick()}
        className={s(`attachment-button screen-record-button ${className}`)}
        text={showText ? text : ''}
        underline
        underlineColor="red-200"
        icon={<Icon className={s(`${showText ? 'ml-sm' : ''} text-red-500`)} />}
        iconLeft={false}
        disabled={!navigator.mediaDevices}
      />
    );
  }
}

ScreenRecordButton.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  className: PropTypes.string,
  showText: PropTypes.bool,
  abbrText: PropTypes.bool,
}

ScreenRecordButton.defaultProps = {
  className: '',
  showText: true,
  abbrText: false,
}

export default connect(
  state => ({
    ...state.screenRecording
  }),
  dispatch => bindActionCreators({
    ...screenRecordingActions
  }, dispatch)
)(ScreenRecordButton);