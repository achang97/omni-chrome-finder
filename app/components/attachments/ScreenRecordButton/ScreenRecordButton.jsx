import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaRegDotCircle } from 'react-icons/fa';
import { IoIosSquare } from 'react-icons/io';

import { Tooltip, Button } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import attachmentsStyle from '../attachments.css';
import screenRecordButtonStyle from './screen-record-button.css';

const s = getStyleApplicationFn(attachmentsStyle, screenRecordButtonStyle);

/*
 * This has to be a class and not a constant, due to some issues with the
 * callbacks related to MediaRecorder.
 */
class ScreenRecordButton extends Component {
  stopStream = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  stopAllMedia = () => {
    const { mediaRecorder, localStream, desktopStream, voiceStream } = this.props;

    if (mediaRecorder) {
      mediaRecorder.stop();
    }

    this.stopStream(localStream);
    this.stopStream(desktopStream);
    this.stopStream(voiceStream);
  };

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

  endStream = () => {
    const { localStream, voiceStream, endScreenRecording } = this.props;
    this.stopStream(localStream);
    this.stopStream(voiceStream);
    endScreenRecording();
  };

  startRecording = async () => {
    const {
      addScreenRecordingChunk,
      startScreenRecording,
      id,
      onSuccess,
      dockVisible,
      toggleDock,
      clearScreenRecording
    } = this.props;

    if (dockVisible) {
      toggleDock();
    }

    let desktopStream;
    let voiceStream;

    try {
      voiceStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
    } catch {
      // Do nothing
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
      // Explicitly get from this.props again, since this is an async function
      clearScreenRecording();
      this.stopStream(voiceStream);
      return;
    }

    const tracks = [
      ...desktopStream.getVideoTracks(),
      ...(voiceStream ? this.mergeAudioStreams(desktopStream, voiceStream) : [])
    ];

    const stream = new MediaStream(tracks);
    desktopStream.oninactive = this.endStream;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: `video/webm${voiceStream ? '; codecs=vp8,opus' : ''}`
    });
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        addScreenRecordingChunk(event.data);
      }
    };
    mediaRecorder.start(10);

    startScreenRecording({ id, stream, desktopStream, voiceStream, mediaRecorder, onSuccess });
  };

  render() {
    const { isSharingDesktop, abbrText, showText, className, id, activeId } = this.props;
    const isActiveButton = id === activeId;

    let onClick;
    let text;
    let Icon;
    if (!isSharingDesktop || !isActiveButton) {
      onClick = this.startRecording;
      text = abbrText ? 'Record' : 'Screen Record';
      Icon = FaRegDotCircle;
    } else {
      onClick = this.stopAllMedia;
      text = abbrText ? 'End' : 'End Recording';
      Icon = IoIosSquare;
    }

    return (
      <>
        <Tooltip
          show={!navigator.mediaDevices}
          tooltip="Screen recordings are not allowed on insecure websites."
          tooltipProps={{ type: 'error' }}
        >
          <Button
            onClick={() => onClick()}
            className={s(`attachment-button screen-record-button ${className}`)}
            text={showText ? text : ''}
            underline
            underlineColor="red-200"
            icon={<Icon className={s(`${showText ? 'ml-sm' : ''} text-red-500`)} />}
            iconLeft={false}
            disabled={!navigator.mediaDevices || (activeId !== null && !isActiveButton)}
          />
        </Tooltip>
      </>
    );
  }
}

ScreenRecordButton.propTypes = {
  id: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  className: PropTypes.string,
  showText: PropTypes.bool,
  abbrText: PropTypes.bool,

  // Redux State
  activeId: PropTypes.string,
  isSharingDesktop: PropTypes.bool.isRequired,
  dockVisible: PropTypes.bool.isRequired,
  mediaRecorder: PropTypes.shape({
    stop: PropTypes.func.isRequired
  }),
  localStream: PropTypes.shape({
    getAudioTracks: PropTypes.func.isRequired
  }),
  desktopStream: PropTypes.shape({
    getAudioTracks: PropTypes.func.isRequired
  }),
  voiceStream: PropTypes.shape({
    getAudioTracks: PropTypes.func.isRequired
  }),

  // Redux Actions
  addScreenRecordingChunk: PropTypes.func.isRequired,
  startScreenRecording: PropTypes.func.isRequired,
  toggleDock: PropTypes.func.isRequired,
  clearScreenRecording: PropTypes.func.isRequired,
  endScreenRecording: PropTypes.func.isRequired
};

ScreenRecordButton.defaultProps = {
  className: '',
  showText: true,
  abbrText: false
};

export default ScreenRecordButton;
