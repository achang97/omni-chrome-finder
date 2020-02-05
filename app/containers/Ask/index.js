import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { MdChevronRight, MdPictureInPicture, MdClose, MdCloudUpload } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { FaRegDotCircle, FaPaperPlane, FaMinus } from 'react-icons/fa';

import { EditorState } from 'draft-js';
import ReactPlayer from 'react-player';
import TextEditor from '../../components/editors/TextEditor';
import Button from '../../components/common/Button';
import CircleButton from '../../components/common/CircleButton';
import _ from 'underscore';

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import Select from '../../components/common/Select';
import SuggestionPanel from "../../components/suggestions/SuggestionPanel";
import ScrollContainer from '../../components/common/ScrollContainer';

import RecipientDropdown from "../../components/ask/RecipientDropdown";

import { colors } from '../../styles/colors';
import { expandDock } from '../../actions/display';
import { openCard } from '../../actions/cards';

import style from "./ask.css";
import { getStyleApplicationFn, isOverflowing } from '../../utils/styleHelpers';
import { createSelectOptions } from '../../utils/selectHelpers';
const s = getStyleApplicationFn(style);

const INTEGRATIONS = ['Slack', 'Email', 'Asana'];

const PLACEHOLDER_RECIPIENT_OPTIONS = createSelectOptions([
  { id: 'c1', type: 'channel', name: 'Design' },
  { id: 'u1', type: 'user', name: 'Akshay' },
  { id: 'u2', type: 'user', name: 'Chetan' },
  { id: 'u3', type: 'user', name: 'Andrew' },
  { id: 'u4', type: 'user', name: 'Fernando' },
  { id: 'u5', type: 'user', name: 'Chetan Really Long Name Wow ASDf ASdf ASdf asdf !!!' },  
  { id: 'u6', type: 'user', name: 'Roger' },
  { id: 'u7', type: 'user', name: 'Mike' },
  { id: 'u8', type: 'channel', name: 'Engineering' },
  { id: 'u9', type: 'channel', name: 'Frontend' },
], (option) => ({ label: `${option.type === 'channel' ? '#' : '@'} ${option.name}`, value: option }));

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
      activeIntegration: INTEGRATIONS[0],

      // Text editors
      editorState: EditorState.createEmpty(),

      // Screen Recording
      desktopSharing: false,
      localStream: null,
      mediaRecorder: null,
      recordedChunks: [],
      screenRecordings: [],

      recipients: [
      ],

      //loading questions
      showRelatedQuestions: false,
    };

    this.expandedPageRef = React.createRef();
  }

  handleTabClick = (activeIntegration) => {
    this.setState({ activeIntegration });
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

  renderTabHeader = () => {
    const { activeIntegration } = this.state;
    return (
      <div className={s('flex flex-row justify-between')}>
        <Tabs
          activeValue={activeIntegration}
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
          {INTEGRATIONS.map((integration) => (
            <Tab key={integration} value={integration}>
              <div className={s(integration !== activeIntegration ? 'ask-integrations-tab-text' : 'primary-underline')}>
                {integration}
              </div>
            </Tab>
          ))}
        </Tabs>
        <CircleButton
          content={<IoMdAdd color={colors.purple.reg} />}
          size="md"
          buttonClassName={s("bg-purple-light")}
        />
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
            editorType="EXTENSION"
          />
          <CircleButton
            content={<IoMdAdd color="white" /> }
            size="sm"
            containerClassName={s('absolute z-10 ask-text-editor-add-button')}
            buttonClassName={s("primary-gradient")}
          />
        </div>
        <div className={s('flex px-xs pt-reg')}>
          <Button
            onClick={this.toggleScreenRecording}
            className={s("ask-screen-capture-button ask-screen-record-shadow mr-xs bg-red-100 text-red-500")}
            text={!desktopSharing ? 'Screen Record' : 'End Recording'}
            underline
            underlineColor="red-200"
            icon={<FaRegDotCircle className={s("ml-sm text-red-500")} />}
            iconLeft={false}
          />
          <Button
            onClick={this.toggleScreenRecording}
            className={s("ask-screen-capture-button ml-xs bg-white text-purple-reg border border-dashed border-gray-light shadow-none")}
            text="Drag & Drop"
            icon={<MdCloudUpload color={colors.purple.reg} className={s("ml-sm")} />}
            iconLeft={false}
          />
        </div>
        { /*<div className={s("mt-sm p-sm")}>
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
        */ }
      </div>
    );
  }

  updateRecipientInfo = (name, newInfo) => {
    const { recipients } = this.state;
    this.setState({ 
      recipients: recipients.map(recipient => (
        recipient.name === name ? { ...recipient, ...newInfo } : recipient
      ))
    })
  }

  addRecipient = ({ label, value: newRecipient }) => {
    const { recipients } = this.state;

    if (!recipients.find(({ id }) => id === newRecipient.id)) {
      let newRecipients;
      if (newRecipient.type === 'user') {
        newRecipients = [...recipients, newRecipient];
      } else {
        newRecipients = [...recipients, { ...newRecipient, mentions: [], isDropdownOpen: false, isDropdownSelectOpen: false }];
      }      

      this.setState({ recipients: newRecipients });
    }
  }

  removeRecipient = (recipientId) => {
    const { recipients } = this.state;
    this.setState({ recipients: recipients.filter(({ id }) => id !== recipientId )});
  }

  renderIndividualRecipient = ({ id, name }) => {
    return (
      <div key={id} className={s("bg-white ask-recipient")}>
        <span className={s("truncate")}> @ {name} </span>
        <div>
          <button onClick={() => this.removeRecipient(id)}>
            <MdClose className={s("text-purple-gray-50 ml-xs")} />
          </button>
        </div>
      </div>
    );
  }

  renderChannelRecipient = ({ id, name, mentions, isDropdownOpen, isDropdownSelectOpen }) => {
    return (
      <div key={id} className={s(`bg-purple-gray-10 ask-recipient ${isDropdownOpen || isDropdownSelectOpen ? 'rounded-t-none' : ''}`)}>
        <span className={s("truncate")}> # {name} </span>
        <div
          className={s("ask-recipient-mentions-count button-hover")}
          onClick={() => this.updateRecipientInfo(name, { isDropdownOpen: true, isDropdownSelectOpen: false })}
        >
          {mentions.length}
        </div>
        <div className={s("vertical-separator bg-purple-gray-50")} />
        <button onClick={() => this.updateRecipientInfo(name, { isDropdownOpen: false, isDropdownSelectOpen: true })}>
          <IoMdAdd className={s("text-purple-reg mr-xs")} />
        </button>
        <button onClick={() => this.removeRecipient(id)}>
          <MdClose className={s("text-purple-reg")} />
        </button>
      </div>
    );
  }

  renderRecipientSelection = () => {
    const { recipients } = this.state;
    return (
      <div className={s("bg-purple-light flex-1 flex flex-col p-lg")}>
        <div className={s("text-purple-reg text-xs mb-reg")}>Send to channel/person</div>
        <Select
          value={null}
          onChange={this.addRecipient}
          placeholder="Enter name"
          options={PLACEHOLDER_RECIPIENT_OPTIONS.filter(({ value: recipient }) => !recipients.find(currRecipient => currRecipient.id === recipient.id))}
          isSearchable
          menuShouldScrollIntoView
        />
        { recipients.length === 0 &&
          <div className={s("text-gray-light text-sm my-reg text-center")}>
            No current recipients
          </div>
        }
        <ScrollContainer
          className={s("my-xs flex flex-col flex-1")}
          scrollContainerClassName={s(`flex-1 flex flex-wrap content-start ${isOverflowing(this.expandedPageRef.current) ? 'ask-recipient-scroll-max' : ''}`)}
          scrollElementClassName={s("min-w-0")}
          list={recipients}
          renderScrollElement={({ type, ...rest }) => (type === 'channel' ?
            this.renderChannelRecipient(rest) :
            this.renderIndividualRecipient(rest)
          )}
          renderOverflowElement={({ type, name, mentions, isDropdownOpen, isDropdownSelectOpen }) => ( type === 'channel' &&
            <RecipientDropdown
              name={name}
              mentions={mentions}
              isDropdownOpen={isDropdownOpen}
              isDropdownSelectOpen={isDropdownSelectOpen}
              onAddMention={(newMention) => this.updateRecipientInfo(name, { mentions: _.union(mentions, [newMention]) })}
              onRemoveMention={(removeMention) => this.updateRecipientInfo(name, { mentions: _.without(mentions, removeMention) })}
              onClose={() => this.updateRecipientInfo(name, { isDropdownOpen: false, isDropdownSelectOpen: false })}
            />
          )}
          position="top"
          matchDimensions={true}
          showCondition={({ type, isDropdownOpen, isDropdownSelectOpen }) => (
            type === 'channel' && (isDropdownOpen || isDropdownSelectOpen)
          )}
          marginAdjust={true}
        />
      </div>
    );    
  }

  renderFooterButton = () => {
    return (
      <Button
        className={s('self-stretch justify-between rounded-t-none rounded-br-none rounded-bl-reg text-reg')}
        color="primary"
        text="Ask Question"
        iconLeft={false}
        icon={
          <span className={s("rounded-full h-3xl w-3xl flex justify-center items-center bg-white text-purple-reg")}>
            <FaPaperPlane />
          </span>
        }
      />
    )
  }


  renderExpandedAskPage = () => {
    const { editorState } = this.state;
    return (
      <div className={s('flex flex-col flex-1 min-h-0')}>
        <div className={s('flex flex-col flex-1 overflow-y-auto')} ref={this.expandedPageRef}>
          <div className={s("p-lg")}>
            { this.renderTabHeader() }
            { this.renderAskInputs() }
          </div>
          { this.renderRecipientSelection() }
        </div>
        { this.renderFooterButton() }
      </div>
    );
  };

  renderMinifiedAskPage = () => {
    const { showRelatedQuestions, showQuestionInfo, showResults } = this.state;
    const { expandDock } = this.props;
    
    return (
      <div className={s("p-lg overflow-y-auto")}>
      	<div onClick={this.openCard}> Open Card </div>
        <input
          onChange={this.onShowRelatedQuestions}
          placeholder="Let's find what you're looking for"
          className={s("w-full")}
        />
        <div className={s('mt-lg flex flex-row justify-center items-center')}>
          <span className={s('flex-1 text-gray-dark ml-sm text-xs font-medium')}>
            Don't see your question?
          </span>
          <Button
            text="Ask Question"
            color="primary"
            className={s("justify-between")}
            iconLeft={false}
            icon={<MdChevronRight color="white" className={s("ml-sm")} />}
            onClick={expandDock}
          />
        </div>
        <div className="flex justify-between items-center">

        </div>
        <SuggestionPanel isVisible={showRelatedQuestions} />
      </div>
    );
  };

  render() {
    const { dockExpanded } = this.props;
    return (dockExpanded ? this.renderExpandedAskPage() : this.renderMinifiedAskPage());
  }
}

export default withRouter(Ask);
