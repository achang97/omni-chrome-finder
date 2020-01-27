import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ReactPlayer from 'react-player';
import { openCard, expandDock } from '../../actions/display';
import TextEditorExtension from '../../components/editors/TextEditorExtension';

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';

import style from './ask.css';
import { getStyleApplicationFn } from '../../utils/styleHelpers';
import { Card } from '../../components/cards/card';
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
      showQuestionInfo: false,
      showResults: false
    };
  }

  dummyCards = [
    {
      heading: 'How do i delete a user',
      description:
        'But stream software offline. Professor install angel sector anywhere create at components smart…',

      datePosted: '2 days ago',
      status: 'active'
    },
    {
      heading: 'How do i delete a user',
      description:
        'But stream software offline. Professor install angel sector anywhere create at components smart…',

      datePosted: '2 days ago',
      status: 'active'
    },
    {
      heading: 'How do i delete a user',
      description:
        'But stream software offline. Professor install angel sector anywhere create at components smart…',

      datePosted: '2 days ago',
      status: 'active'
    },
    {
      heading: 'How do i delete a user',
      description:
        'But stream software offline. Professor install angel sector anywhere create at components smart…',

      datePosted: '2 days ago',
      status: 'active'
    },
    {
      heading: 'How do i delete a user',
      description:
        'But stream software offline. Professor install angel sector anywhere create at components smart…',

      datePosted: '2 days ago',
      status: 'active'
    },
    {
      heading: 'How do i delete a user',
      description:
        'But stream software offline. Professor install angel sector anywhere create at components smart…',

      datePosted: '2 days ago',
      status: 'active'
    }
  ];

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
      <div className={s('overflow-y-scroll max-h-screen min-h-screen')}>
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
              'text-lg h-4 w-4 text-white border rounded-full bg-purple-light flex items-center justify-center p-2'
            )}
          >
            <span className={s('text-purple-reg')}>+</span>
          </button>
        </div>
        <div className={s('p-lg relative')}>
          <input
            id="standard-basic"
            className={s(
              'ask-question-text-field bg-white rounded p-sm w-full mb-1'
            )}
            placeholder="Question"
          />
          {/* <div>Ask Body</div> */}

          <TextEditorExtension />
          <button
            onClick={(e) => {
              console.log('clicked');
            }}
            className={s(
              'absolute cursor-pointer z-10 add-button text-lg h-4 w-4 text-white border rounded-full bg-purple-reg flex items-center justify-center p-2'
            )}
          >
            +
          </button>
        </div>
        <div className={s('flex flex-row justify-between p-lg')}>
          <button
            onClick={this.toggleScreenRecording}
            className="bg-red-200 flex flex-row text-red-500 p-2 rounded-lg"
          >
            {!desktopSharing ? 'Screen Record' : 'End Recording'}
            <div className="ml-2 h-5 w-5 flex items-center justify-center rounded-full border border-red-300">
              <div className="h-3 w-3 rounded-full bg-red-500" />
            </div>
          </button>
          <button
            onClick={this.toggleScreenRecording}
            className="bg-purple-200 flex flex-row text-purple-700 p-2 rounded-lg"
          >
            Screen Capture
            <div className="ml-2 h-4 w-6 flex items-center justify-center rounded-sm  bg-purple-700" />
          </button>
        </div>
        <div className="mt-1">
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
        <div className="bg-purple-200 text-gray-800 h-full">
          <div className={s('h-40')} style={{ minHeight: '375px' }}>
            <span>Send to channel/person</span>
          </div>
          <button
            onClick={() => {
              this.redirect('/login');
            }}
            className={s(
              'w-full bg-purple-gradient flex justify-center items-center text-white'
            )}
          >
            <span className="w-full flex justify-between p-2">
              <span className="">Ask Question</span>
              <span className="">></span>
            </span>
          </button>
        </div>
      </div>
    );
  };

  renderMinifiedAskPage = () => {
    const { showRelatedQuestions, showQuestionInfo, showResults } = this.state;

    return (
      <div className="">
        <div className={s('order-3 py-xs px-lg bg-gray-200 flex')}>
          <div className={s('flex flex-col items-center')}>
            <div className={s('mt-2 w-full mx-auto')}>
              <input
                onChange={this.onShowRelatedQuestions}
                placeholder="Let's find what you're looking for"
                className={s(
                  'p-sm text-sm w-full bg-white border border-gray-500 placeholder-purple-reg rounded-lg'
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
            className={s(
              'p-4 order-2 w-full flex flex-col rounded-sm shadow-md separate-popup bg-gray-200 border-gray-500 '
            )}
          >
            <div className="cards">
              <p className="text-gray-500 text-sm tracking-tighter">
                30 Results
              </p>
              <div
                className={s('mt-2 flex flex-col  overflow-y-scroll max-h-600')}
              >
                {this.dummyCards.map((card, index) => (
                  <Card
                    key={index}
                    heading={card.heading}
                    description={card.description}
                    datePosted={card.datePosted}
                    status={card.status}
                    onHover={e => this.setState({ showQuestionInfo: true })}
                    onMouseLeave={(e) => {
                      this.setState({ showQuestionInfo: false });
                    }}
                  />
                  ))}
              </div>
            </div>
            <div className="footer border-t border-gray-700 flex justify-center items-center mt-2">
              {!showResults && (
                <button
                  onClick={() => this.setState({ showResults: true })}
                  className="block text-sm mt-5 text-purple-reg underline"
                >
                  Show results from your current documentation
                </button>
              )}
              {showResults && (
                <div className={s('p-lg my-sm')}>
                  <div
                    className={s(
                      'rounded-full w-full p-lg bg-blue-400 border my-sm'
                    )}
                  >
                    Doc
                  </div>
                </div>
              )}
            </div>
            {showQuestionInfo && (
              <div
                className={s(
                  ' Question-Info order-1 w-full text-gray-800 flex flex-col rounded-sm shadow-md separate-popup bg-gray-200 border-gray-500 '
                )}
              >
                <div className={s('Question-Info__Header p-6 rounded-t-lg')}>
                  <p className="text-xl tracking-tight">
                    How do I delete a User?
                  </p>
                  <span className="mt-2">
                    I can’t find the area to delete an entire user in our
                    dashboard - where is this functionality located?
                  </span>
                </div>
                <div
                  className={s(
                    'Question-Info__Content bg-white p-6 tracking-tight'
                  )}
                >
                  <div>How do I delete a User?</div>
                  <div>
                    I can’t find the area to delete an entire user in our
                    dashboard - where is this functionality located?
                  </div>
                  <div>How do I delete a User?</div>
                  <div>
                    I can’t find the area to delete an entire user in our
                    dashboard - where is this functionality located?
                  </div>
                </div>
                <div
                  className={s(
                    'Question-Info__Footer border-t  h-10 flex items-center justify-center rounded-b-lg '
                  )}
                >
                  <a href="" className={s('block underline text-purple-reg')}>
                    View full card
                  </a>
                </div>
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

export default withRouter(Ask);
