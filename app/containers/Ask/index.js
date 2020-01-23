import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import ReactPlayer from 'react-player'
import style from './ask.css';
import { openCard } from '../../actions/display';

import TextEditorExtension from '../../components/editors/TextEditorExtension';


const INTEGRATIONS = [
  'Slack',
  'Email',
  'Asana'
]

@connect(
    // eslint-disable-next-line no-unused-vars
  state => ({
  }),
  dispatch => bindActionCreators({ openCard, }, dispatch)
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

  handleTabClick = (event, tabValue) => {
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

  render() {
  	const { editorState } = this.state;

    const { tabValue, desktopSharing, screenRecordings } = this.state;
    return (
      <div>
        <style type="text/css">{style}</style>
        <div className="p-lg">
          <div className="flex float-left w-full">
            <div className="w-2/3">
              <Tabs value={tabValue} onChange={this.handleTabClick} TabIndicatorProps={{ style: { display: 'none', } }}>
                { INTEGRATIONS.map((integration, i) => (
                  <Tab
                    label={integration}
                    className={`ask-integrations-tab font-semibold text-purple-reg ${tabValue === i ? 'shadow-md ask-integrations-tab-selected' : ''}`}
                  />
                ))}
              </Tabs>
            </div>
          </div>
          <TextField id="standard-basic" className="ask-question-text-field bg-white rounded p-sm w-full" placeholder="Question" InputProps={{ disableUnderline: true }} />
          <div>Ask Body</div>
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-xs px-sm border border-blue-500 hover:border-transparent rounded"
            onClick={this.openCard}
          >
            Open Card
          </button>
          <TextEditorExtension />
          <button onClick={this.toggleScreenRecording}>
            { !desktopSharing ? 'Screen Record' : 'End Recording' }
          </button>
          <Grid container spacing={3}>
            { screenRecordings.map((recording) => (
              <Grid item xs={6}>
                <div className="ask-video-player-container">
                  <ReactPlayer url={recording} className="absolute top-0 left-0" controls playing height="100%" width="100%"/>
                </div>
              </Grid>
            ))}    
          </Grid>
        </div>
      </div>
    );
  }
}


