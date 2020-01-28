import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ReactPlayer from 'react-player';
import { openCard, expandDock } from '../../actions/display';
import TextEditorExtension from '../../components/editors/TextEditorExtension';

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';

import GlobalStyle from '../../styles/global.css';
import style from "./ask.css";
import { getStyleApplicationFn } from '../../utils/styleHelpers';
import { Card } from '../../components/cards/card';
const s = getStyleApplicationFn(style);
const tw = getStyleApplicationFn(GlobalStyle)

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
      <div className={tw('max-h-screen min-h-screen show-scrollbar')}>
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
              'text-lg h-4 w-4 text-white border rounded-full bg-purple-light flex items-center justify-center p-sm'
            )}
          >
            <span className={s('text-purple-reg font-semibold')}>+</span>
          </button>
        </div>
        <div className={s('px-lg py-sm relative')}>
          <input
            id="standard-basic"
            className={s(
              'ask-question-text-field bg-white rounded p-sm w-full mb-sm'
            )}
            placeholder="Question"
          />

          <TextEditorExtension />
          <button
            onClick={(e) => {
              console.log('clicked');
            }}
            className={s(
              'absolute cursor-pointer z-10 add-button text-lg h-4 w-4 text-white border rounded-full bg-purple-reg flex items-center justify-center p-sm'
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
            <div className={tw("ml-sm h-5 w-5 flex items-center justify-center rounded-full border border-red-300")}>
              <div className={s("h-3 w-3 rounded-full bg-red-500")} />
            </div>
          </button>
          <button
            onClick={this.toggleScreenRecording}
            className={s("bg-purple-200 flex flex-row items-center text-purple-700 p-sm rounded-lg")}
          >
            <span className="underline">
              Screen Capture
            </span>
            <div
              className={s(
                'ml-sm h-4 w-6 flex items-center justify-center rounded-sm  bg-purple-700'
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
        <div className={s("bg-purple-light p-reg text-gray-800 h-full ")}>
          <div className={s('flex flex-col')} style={{ minHeight: '325px' }}>
            <span className={s("text-purple-reg text-sm font-light tracking-tight")}>Send to channel/person</span>
            <input placeholder={"Enter Name"} className={s("mt-sm text-gray-800 p-reg outline-none rounded-lg border-none ")} />
            <div className={s("flex flex-row justify-between my-reg")}>
              <div className={s(" bg-purple-reg text-purple-reg font-bold text-reg rounded-lg p-sm w-48")}>
                <div className={s("h-10 p-reg flex flex-row items-center justify-between")}>
                  <span className={s("capitalize text-white font-bold")}>Design</span>
                  <span className={s("text-white")}>x</span>
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
              <div className={s("selected-users w-48 p-sm")}>
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
            'w-full h-16 bg-purple-gradient rounded-bl-lg rounded-br-lg flex justify-center items-center text-white'
          )}
        >
          <span className={s("w-full flex flex-row justify-between text-sm font-semibold")}>
            <span className={s("p-reg")}>Ask Question</span>
            <span className={s("p-reg")}>></span>
          </span>
        </button>
      </div>
    );
  };

  renderMinifiedAskPage = () => {
    const { showRelatedQuestions, showQuestionInfo, showResults } = this.state;

    return (
      <div >
        <div className={s('flex flex-col py-sm px-lg bg-white flex w-full')}>
          <div className={s('mt-sm w-full mx-auto')}>
            <input
              onChange={this.onShowRelatedQuestions}
              placeholder="Let's find what you're looking for"
              className={s(
                'p-reg text-sm w-full outline-none bg-white border border-gray-500 placeholder-purple-reg rounded-lg'
              )}
            />
          </div>
          <div className={s('my-lg flex flex-row justify-center items-center w-full')}>
            <span className={s('w-1/2 text-gray-500 text-xs')}>
              Don't see your questions?
              </span>
            <button
              className={s(
                'flex-1 bg-purple-gradient flex justify-center items-center rounded-lg text-white'
              )}
              onClick={this.props.expandDock}
            >
              <span className={s("w-full flex justify-between text-sm font-semibold")}>
                <span className={s("p-reg")}>Ask Question</span>
                <span className={s("p-reg")}>></span>
              </span>
            </button>
          </div>
        </div>
        {showRelatedQuestions && (
          <div
            className={s(
              'p-reg order-2 w-full flex flex-col rounded-sm shadow-md separate-popup bg-gray-200 border-gray-500 '
            )}
          >
            <div className={s("cards")}>
              <p className={s("text-gray-500 text-sm tracking-tighter")}>
                30 Results
              </p>
              <div
                className={s('mt-sm flex flex-col  overflow-y-scroll max-h-600')}
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
            <div className={s("footer border-t border-gray-700 flex justify-center items-center mt-sm")} >
              {!showResults && (
                <button
                  onClick={() => this.setState({ showResults: true })}
                  className={s("block text-sm my-reg text-purple-reg underline font-bold tracking-tight")}
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
                <div className={s('Question-Info__Header p-xl rounded-t-lg')}>
                  <p className={s("text-xl tracking-tight")}>
                    How do I delete a User?
                  </p>
                  <span className={s("mt-sm")}>
                    I can’t find the area to delete an entire user in our
                    dashboard - where is this functionality located?
                  </span>
                </div>
                <div
                  className={s(
                    'Question-Info__Content bg-white p-xl tracking-tight'
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
                    'Question-Info__Footer border-t my-reg h-10 flex items-center justify-center rounded-b-lg '
                  )}
                >
                  <a href="" className={s('block underline text-purple-reg')}>
                    View full card
                  </a>
                </div>
              </div>
            )}
          </div>
        )
        }
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
