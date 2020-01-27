import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';
import { openCard, expandDock } from '../../actions/display';
import TextEditorExtension from '../../components/editors/TextEditorExtension';

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';

import style from './ask.css';
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const INTEGRATIONS = ['Slack', 'Email', 'Asana'];

@connect(
  state => ({
    dockExpanded: state.display.dockExpanded
  }),
  dispatch =>
    bindActionCreators(
      {
        openCard,
        expandDock
      },
      dispatch
    )
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

      //loading questions
      showRelatedQuestions: false,
      showQuestionInfo: false
    };
  }

  handleTabClick = (tabValue) => {
    this.setState({ tabValue });
  };

  onShowRelatedQuestions = (ev) => {
    this.setState({
      showRelatedQuestions: ev.target.value.trim().length > 0
    });
  };

  openCard = () => {
    // eslint-disable-next-line no-tabs,no-mixed-spaces-and-tabs,react/prop-types
    // Open card with random ID
    this.props.openCard(Math.floor(Math.random() * Math.floor(10000)));
  };

  toggleScreenRecording = () => {
    const { desktopSharing, localStream } = this.state;

    if (!desktopSharing) {
      this.startScreenRecording();
    } else {
      this.endScreenRecording();
    }
  };

  startScreenRecording = () => {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: false,
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 }
        }
      })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm'
        });
        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data && event.data.size > 0) {
            this.setState({
              recordedChunks: [...this.state.recordedChunks, event.data]
            });
          }
        });
        mediaRecorder.start(10);

        stream.onended = () => {
          console.log('stream.onended fired.');
          if (this.state.desktopSharing) {
            this.toggleScreenRecording();
          }
        };

        stream.addEventListener('inactive', (e) => {
          console.log('stream inactive fired.');
          this.toggleScreenRecording();
        });

        this.setState({
          desktopSharing: true,
          localStream: stream,
          mediaRecorder
        });
      })
      .catch(error => console.log(error));
  };

  endScreenRecording = () => {
    const {
      mediaRecorder,
      localStream,
      recordedChunks,
      screenRecordings
    } = this.state;

    mediaRecorder.stop();
    localStream.getTracks().forEach(track => track.stop());
    const recordingBlob = new Blob(recordedChunks, { type: 'video/webm' });

    const reader = new FileReader();
    reader.readAsDataURL(recordingBlob);
    reader.onloadend = () => {
      this.setState({
        desktopSharing: false,
        localStream: null,
        mediaRecorder: null,
        recordedChunks: [],
        screenRecordings: [...screenRecordings, reader.result]
      });
    };
  };

  renderExpandedAskPage = () => {
    const {
      tabValue,
      desktopSharing,
      screenRecordings,
      editorState
    } = this.state;
    return (
      <div className={s('p-lg')}>
        <Tabs
          activeIndex={tabValue}
          className={s('mb-lg')}
          tabClassName={s(
            'ask-integrations-tab text-sm font-normal rounded-full'
          )}
          inactiveTabClassName={s('text-purple-reg')}
          activeTabClassName={s(
            'ask-integrations-tab-selected text-white font-semibold'
          )}
          onTabClick={this.handleTabClick}
          showRipple={false}
        >
          {INTEGRATIONS.map(integration => (
            <Tab key={integration}>
              <div className={s('ask-integrations-tab-text')}>
                {' '}
                {integration}{' '}
              </div>
            </Tab>
          ))}
        </Tabs>
        <input
          id="standard-basic"
          className={s('ask-question-text-field bg-white rounded p-sm w-full')}
          placeholder="Question"
        />
        <div>Ask Body</div>
        <button
          className={s(
            'bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-xs px-sm border border-blue-500 hover:border-transparent rounded'
          )}
          onClick={this.openCard}
        >
          Open Card
        </button>
        <TextEditorExtension />
        <button onClick={this.toggleScreenRecording}>
          {!desktopSharing ? 'Screen Record' : 'End Recording'}
        </button>
        <div>
          {screenRecordings.map(recording => (
            <div className={s('ask-video-player-container')}>
              <ReactPlayer
                url={recording}
                className={s('absolute top-0 left-0')}
                controls
                playing
                height="100%"
                width="100%"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  renderMinifiedAskPage = () => {
    const { showRelatedQuestions, showQuestionInfo } = this.state;

    return (
      <div className="flex flex-row">
        <div className={s('order-3 py-xs px-lg bg-gray-200 flex')}>
          <div className={s('flex flex-col items-center')}>
            <div className={s('mt-2 w-full mx-auto')}>
              <input
                onChange={this.onShowRelatedQuestions}
                placeholder="Let's find what you're looking for"
                className={s(
                  'p-sm text-sm w-full bg-white border border-gray-500 placeholder-purple-light rounded-lg'
                )}
              />
            </div>
            <div className={s('my-lg flex flex-row justify-center w-full')}>
              <span className={s('w-1/2 text-gray-500 text-sm p-0 ')}>
                Don't see your questions?
              </span>
              <button
                className={s(
                  'flex-1 bg-purple-gradient flex justify-center items-center rounded-lg text-white'
                )}
                onClick={this.props.expandDock}
              >
                <span className="w-full flex justify-between p-2">
                  <span className="">Ask Question</span>
                  <span className="">></span>
                </span>
              </button>
            </div>
          </div>
        </div>
        {showRelatedQuestions && (
          <div
            onMouseOver={e => this.setState({ showQuestionInfo: true })}
            onMouseOut={e => this.setState({ showQuestionInfo: false })}
            className={s(
              'order-2 w-64 h-64 separate-popup bg-gray-200 border-gray-500 '
            )}
          >
            Div 2
            {showQuestionInfo && (
              <div
                className={s(
                  'mx-1 absolute order-1 w-64 h-64 bg-red-200 border-gray-500 separate-popup '
                )}
              >
                Div 1
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  render() {
    const { dockExpanded } = this.props;
    return (
      <div>
        {dockExpanded
          ? this.renderExpandedAskPage()
          : this.renderMinifiedAskPage()}
      </div>
    );
  }
}
