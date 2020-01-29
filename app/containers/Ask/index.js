import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { MdChevronRight } from 'react-icons/md';
import ReactPlayer from 'react-player';
import { openCard, expandDock } from '../../actions/display';
import TextEditorExtension from '../../components/editors/TextEditorExtension';
import Button from '../../components/common/Button';
import { default as purplePaperPlane } from "../../assets/images/icons/purplePaperPlane.svg"

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';

import SuggestionPanel from "../../components/suggestions/SuggestionPanel";

import style from "./ask.css";
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

class Ask extends Component {
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

  redirect = (routeName) => {
    console.log(routeName);
    this.props.history.push(routeName);
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
      <div className={s('max-h-screen min-h-screen')}>
        <div className={s('flex flex-row justify-between p-lg')}>
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
          <button
            className={s(
              "text-lg h-lg w-lg text-white border rounded-full bg-purple-light flex items-center justify-center p-sm"
            )}
          >
            <span className={s("text-purple-reg")}>+</span>
          </button>
        </div>
        <div className={s("p-lg relative")}>
          <input
            id="standard-basic"
            className={s(
              "ask-question-text-field bg-white rounded p-sm mb-xs w-full"
            )}
            placeholder="Question"
          />
          <TextEditorExtension />
          <button
            onClick={(e) => {
              console.log('clicked');
            }}
            className={s(
              'absolute cursor-pointer z-10 add-button text-lg h-lg w-lg text-white border rounded-full bg-purple-reg flex items-center justify-center p-sm'
            )}
          >
            +
          </button>
        </div>
        <div className={s('flex flex-row justify-between px-lg py-xs')}>
          <button
            onClick={this.toggleScreenRecording}
            className={s("bg-red-200 flex flex-row text-red-500 p-sm rounded-lg")}
          >
            <span className="underline">
              {!desktopSharing ? 'Screen Record' : 'End Recording'}
            </span>
            <div className={s("ml-sm h-xl w-xl flex items-center justify-center rounded-full border border-red-300")}>
              <div className={s("h-reg w-reg rounded-full bg-red-500")} />
            </div>
          </button>
          <button
            onClick={this.toggleScreenRecording}
            className={s("bg-purple-grey flex flex-row items-center text-purple-reg p-sm rounded-lg")}
          >
            <span className="underline">
              Screen Capture
            </span>
            <div
              className={s(
                'ml-sm h-lg w-lg flex items-center justify-center rounded-sm  bg-purple-reg'
              )}
            />
          </button>
        </div>
        <div className={s("mt-sm p-sm")}>
          {screenRecordings.map(recording => (
            <div className={s('ask-video-player-container my-sm')}>
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
        <div className={s("bg-purple-light p-reg text-gray-800 h-full")}>
          <div className={s('flex flex-col')}>
            <span className={s("text-purple-reg text-sm font-light tracking-tight")}>Send to channel/person</span>
            <input placeholder={"Enter Name"} className={s("mt-sm text-gray-800 p-reg outline-none rounded-lg border-none")} />
            <div className={s("flex flex-row my-reg")}>
              <div className={s(" bg-purple-grey text-purple-reg font-bold text-reg rounded-lg p-sm")}>
                <div className={s("p-reg flex flex-row items-center justify-between")}>
                  <span className={s("capitalize font-bold")}>Design</span>
                  <span className={s("text-gray-500")}>x</span>
                </div>
                <div className={s("p-reg flex flex-col mt-sm border-t")}>
                  <div className={s("p-sm bg-white rounded-lg")}>
                    <div className={s(" p-reg flex flex-row items-center justify-between")}>
                      <span className={s("capitalize")}>Miodrag</span>
                      <span className={s("text-gray-500")}>x</span>
                    </div>
                    <div className={s(" p-reg flex flex-row items-center justify-between")}>
                      <span className={s("capitalize")}>Goran</span>
                      <span className={s("text-gray-500")}>x</span>
                    </div>
                    <div className={s(" p-reg flex flex-row items-center justify-between")}>
                      <span className={s("capitalize")}>Add</span>
                      <span className={s("text-gray-500")}>+</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={s("p-sm")}>
                <div className={s("w-full bg-white text-purple-reg font-bold text-reg rounded-lg flex flex-row justify-between p-reg")}>
                  <span>
                    @Chetan
                  </span>
                  <span className={s("text-gray-500 cursor-pointer")}>
                    x
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            this.redirect('/login');
          }}
          className={s(
            'w-full bg-purple-gradient rounded-bl-lg flex justify-center items-center text-white'
          )}
        >
          <span className={s("w-full flex flex-row justify-between items-center text-sm font-semibold")}>
            <span className={s("p-reg")}>Ask Question</span>
            <span className={s("h-2xl w-2xl text-purple-reg rounded-full bg-white flex items-center justify-center")}>
              {<img className="h-2xl w-2xl" src={purplePaperPlane} />}
            </span>
          </span>
        </button>
      </div>
    );
  };

  renderMinifiedAskPage = () => {
    const { showRelatedQuestions, showQuestionInfo, showResults } = this.state;
    return (
      <div className={s("p-lg flex-col")}>
        <div className={s("self-stretch")}>
          <input
            onChange={this.onShowRelatedQuestions}
            placeholder="Let's find what you're looking for"
            className={s("w-full")}
          />
        </div>
        <div className={s('my-lg flex flex-row justify-center items-center')}>
          <span className={s('flex-1 text-gray-dark mr-xs text-sm font-medium')}>
            Don't see your question?
          </span>
          <Button
            text="Ask Question"
            color="primary"
            className={s("flex-1 justify-between")}
            iconLeft={false}
            icon={<MdChevronRight color="white" />}
          />
        </div>
        <SuggestionPanel isVisible={showRelatedQuestions} />
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

export default withRouter(Ask);
