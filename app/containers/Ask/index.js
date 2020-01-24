import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player'
import { openCard, expandDock } from '../../actions/display';
import TextEditorExtension from '../../components/editors/TextEditorExtension';

import Tabs from '../../components/common/Tabs/Tabs';

import style from './ask.css';
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const INTEGRATIONS = [
  'Slack',
  'Email',
  'Asana'
]

@connect(
  state => ({
    dockExpanded: state.display.dockExpanded,
  }),
  dispatch => bindActionCreators({
    openCard,
    expandDock,
  }, dispatch)
)

export default class Ask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabValue: 0,

      // Screen Recording
      desktopSharing: false,
      localStream: null,
      mediaRecorder: null,
      recordedChunks: [],
      screenRecordings: [],
    }
  }

  handleTabClick = (tabValue) => {
    this.setState({ tabValue });
  }

  openCard = () => {
    // eslint-disable-next-line no-tabs,no-mixed-spaces-and-tabs,react/prop-types
    // Open card with random ID
  	this.props.openCard(Math.floor(Math.random() * Math.floor(10000)));
  }

  toggleScreenRecording = () => {
    const { desktopSharing, localStream } = this.state;

    if (!desktopSharing) {
      this.startScreenRecording();
    } else {
      this.endScreenRecording();
    }
  }

  startScreenRecording = () => {
    navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 },
      } 
    })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorder.addEventListener('dataavailable', event => {
          if (event.data && event.data.size > 0) {
            this.setState({ recordedChunks: [...this.state.recordedChunks, event.data] });
          }
        });
        mediaRecorder.start(10);

        stream.onended = () => {
          console.log('stream.onended fired.')
          if (this.state.desktopSharing) {
            this.toggleScreenRecording();
          }
        };

        stream.addEventListener('inactive', e => {
          console.log('stream inactive fired.');
          this.toggleScreenRecording();
        });

        this.setState({ desktopSharing: true, localStream: stream, mediaRecorder });
      })
      .catch(error => console.log(error));
  }

  endScreenRecording = () => {
    const { mediaRecorder, localStream, recordedChunks, screenRecordings } = this.state;
    
    mediaRecorder.stop();
    localStream.getTracks().forEach(track => track.stop());
    const recordingBlob = new Blob(recordedChunks, {type: 'video/webm'});

    var reader = new FileReader();
    reader.readAsDataURL(recordingBlob); 
    reader.onloadend = () => {
      this.setState({
        desktopSharing: false,
        localStream: null,
        mediaRecorder: null,
        recordedChunks: [],
        screenRecordings: [...screenRecordings, reader.result]
      });
    }
  }

  renderExpandedAskPage = () => {
    const { tabValue, desktopSharing, screenRecordings, editorState } = this.state;
    return (
      <div className={s("p-lg")}>
        <Tabs
          labels={INTEGRATIONS.map(integration => (
            <div className={s("ask-integrations-tab-text")}> {integration} </div>
          ))}
          activeIndex={tabValue}
          className={s("mb-lg")}
          tabClassName={s("ask-integrations-tab text-sm font-normal rounded-full")}
          inactiveTabClassName={s("text-purple-reg")}
          activeTabClassName={s("ask-integrations-tab-selected border-white shadow-xl text-white font-semibold")}
          onTabClick={this.handleTabClick}
          showRipple={false}
        />
        <input id="standard-basic" className={s("ask-question-text-field bg-white rounded p-sm w-full")} placeholder="Question" />
        <div>Ask Body</div>
        <button
          className={s("bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-xs px-sm border border-blue-500 hover:border-transparent rounded")}
          onClick={this.openCard}
        >
          Open Card
        </button>
        <TextEditorExtension />
        <button onClick={this.toggleScreenRecording}>
          { !desktopSharing ? 'Screen Record' : 'End Recording' }
        </button>
        <div>
          { screenRecordings.map((recording) => (
            <div className={s("ask-video-player-container")}>
              <ReactPlayer url={recording} className={s("absolute top-0 left-0")} controls playing height="100%" width="100%"/>
            </div>
          ))}    
        </div>
      </div>
    );
  }

  renderMinifiedAskPage = () => {
    return (
      <div>
        Just a peek
        <button onClick={this.props.expandDock}> Ask Question </button>
      </div>
    )
  }

  render() {
    const { dockExpanded } = this.props;
    return (
      <div>
        { dockExpanded ? this.renderExpandedAskPage() : this.renderMinifiedAskPage() }
      </div>
    );
  }
}


