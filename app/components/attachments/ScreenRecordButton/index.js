import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FaRegDotCircle } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
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

  stopStream = stream => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  stopAllMedia = () => {
    const { mediaRecorder, localStream, desktopStream, voiceStream } = this.props;

    if (mediaRecorder) {
      mediaRecorder.stop();
    }

    this.stopStream(localStream);
    this.stopStream(desktopStream);
    this.stopStream(voiceStream);
  }

  mergeAudioStreams = (desktopStream, voiceStream) => {
    const context = new AudioContext();
    const destination = context.createMediaStreamDestination();

    if (desktopStream && desktopStream.getAudioTracks().length > 0) {
      // If you don't want to share Audio from the desktop it should still work with just the voice.
      const source1 = context.createMediaStreamSource(desktopStream);
      const desktopGain = context.createGain();
      desktopGain.gain.value = 0.7;
      source1.connect(desktopGain).connect(destination);
    }
    
    if (voiceStream && voiceStream.getAudioTracks().length > 0) {
      const source2 = context.createMediaStreamSource(voiceStream);
      const voiceGain = context.createGain();
      voiceGain.gain.value = 0.7;
      source2.connect(voiceGain).connect(destination);
    }

    return destination.stream.getAudioTracks();
  };

  startRecording = async () => {
    const { addScreenRecordingChunk, startScreenRecording } = this.props;

    let desktopStream, voiceStream;

    try {
      voiceStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
    } catch (e) {
      console.log(e);
    }

    try {
      desktopStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 }
        }
      });      
    } catch (e) {
      return;
    }

    const tracks = [
      ...desktopStream.getVideoTracks(), 
      ...(voiceStream ? this.mergeAudioStreams(desktopStream, voiceStream) : [])
    ];

    const stream = new MediaStream(tracks);
    desktopStream.oninactive = () => {
      const { localStream, voiceStream } = this.props;
      this.stopStream(localStream);
      this.stopStream(voiceStream);
      this.endRecording();
    };

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: `video/webm${voiceStream ? '; codecs=vp8,opus' : ''}`
    });
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        addScreenRecordingChunk(event.data);
      }
    };
    mediaRecorder.start(10);

    startScreenRecording(stream, desktopStream, voiceStream, mediaRecorder);
  }

  render() {
    const { isSharingDesktop, abbrText, showText, className } = this.props;

    let onClick, text, Icon;
    if (!isSharingDesktop) {
      onClick = this.startRecording;
      text = abbrText ? 'Record' : 'Screen Record';
      Icon = FaRegDotCircle;
    } else {
      onClick = this.stopAllMedia;
      text = abbrText ? 'End' : 'End Recording';
      Icon = IoIosSquare;
    }

    return (
      <React.Fragment>
        <Button
          onClick={() => onClick()}
          className={s(`attachment-button screen-record-button ${className}`)}
          text={showText ? text : ''}
          underline
          underlineColor="red-200"
          icon={<Icon className={s(`${showText ? 'ml-sm' : ''} text-red-500`)} />}
          iconLeft={false}
          disabled={!navigator.mediaDevices}
          data-tip
          data-for="screen-record-button" 
        />
        { !navigator.mediaDevices &&
          <ReactTooltip id="screen-record-button" type="error" effect="float">
            <span className={s('font-normal text-xs')}> Screen recordings are not allowed on insecure websites. </span>
          </ReactTooltip>
        }
      </React.Fragment>
    );
  }
}

ScreenRecordButton.propTypes = {
  onSuccess: PropTypes.func.isRequired,
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