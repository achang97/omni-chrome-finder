import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { MdChevronRight, MdPictureInPicture } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { FaRegDotCircle } from 'react-icons/fa';

import { EditorState } from 'draft-js';
import ReactPlayer from 'react-player';
import TextEditor from '../../components/editors/TextEditor';
import Button from '../../components/common/Button';
import { default as purplePaperPlane } from "../../assets/images/icons/purplePaperPlane.svg"

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import SuggestionPanel from "../../components/suggestions/SuggestionPanel";

import { colors } from '../../styles/colors';

import { openCard, expandDock } from '../../actions/display';

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

      // Text editors
      editorState: EditorState.createEmpty(),

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

  renderTabHeader = () => {
    const { tabValue } = this.state;
    return (
      <div className={s('flex flex-row justify-between')}>
        <Tabs
          activeIndex={tabValue}
          className={s('mb-lg')}
          tabClassName={s(
            'text-sm font-normal rounded-full py-sm px-reg'
          )}
          inactiveTabClassName={s('text-purple-reg')}
          activeTabClassName={s(
            'primary-gradient text-white font-semibold'
          )}
          onTabClick={this.handleTabClick}
          showRipple={false}
        >
          {INTEGRATIONS.map((integration, i) => (
            <Tab key={integration}>
              <div className={s(i !== tabValue ? 'ask-integrations-tab-text' : 'primary-underline')}>
                {integration}
              </div>
            </Tab>
          ))}
        </Tabs>
        <button className={s("circle-button bg-purple-light shadow-md")}>
          <IoMdAdd color={colors.purple.reg} />
        </button>
      </div>   
    ); 
  }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState : editorState });
  }

  renderAskInputs = () => {
    const { desktopSharing, screenRecordings, editorState } = this.state;
    return (
      <div >
        <div className={s("flex-col relative")}>
          <input
            placeholder="Question"
            onChange={this.onShowRelatedQuestions}
            className={s("w-full mb-reg")}
          />
          <TextEditor 
            onEditorStateChange={this.onEditorStateChange} 
            editorState={editorState} 
            // wrapperClassName={s('card-description-text-editor-wrapper-edit')} 
            editorClassName={s('text-editor')} 
            toolbarClassName={s('text-editor-toolbar')}
          />
          <Button
            icon={<IoMdAdd color="white" /> }
            className={s('absolute z-10 ask-text-editor-add-button circle-button-sm')}
          />
        </div>
        <div className={s('flex')}>
          <button
            onClick={this.toggleScreenRecording}
            className={s("ask-screen-capture-button mr-xs bg bg-red-100 text-red-500")}
          >
            <span className={s("ask-screen-capture-button-text")}>
              {!desktopSharing ? 'Screen Record' : 'End Recording'}
            </span>
            <FaRegDotCircle color="red" className={s("ml-sm")} />
          </button>
          <button
            onClick={this.toggleScreenRecording}
            className={s("ask-screen-capture-button ml-xs bg-purple-xlight text-purple-reg")}
          >
            <span className={s("ask-screen-capture-button-text")}>
              Screen Capture
            </span>
            <MdPictureInPicture color={colors.purple.reg} className={s("ml-sm")} />
          </button>
        </div>
      </div>
    );
  }

  renderExpandedAskPage = () => {
    const { editorState } = this.state;
    return (
      <div className={s('max-h-screen min-h-screen')}>
        <div className={s("p-lg")}>
          { this.renderTabHeader() }
          { this.renderAskInputs() }
        </div>
      </div>
    );
  };

  renderMinifiedAskPage = () => {
    const { showRelatedQuestions, showQuestionInfo, showResults } = this.state;
    const { expandDock } = this.props;
    
    return (
      <div className={s("p-lg flex-col")}>
        <input
          onChange={this.onShowRelatedQuestions}
          placeholder="Let's find what you're looking for"
          className={s("w-full")}
        />
        <div className={s('my-lg flex flex-row justify-center items-center')}>
          <span className={s('flex-1 text-gray-dark ml-sm text-sm font-medium')}>
            Don't see your question?
          </span>
          <Button
            text="Ask Question"
            color="primary"
            className={s("justify-between")}
            iconLeft={false}
            icon={<MdChevronRight color="white" />}
            onClick={expandDock}
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
