import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { MdChevronRight, MdPictureInPicture, MdClose, MdCloudUpload, MdAttachment } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { FaRegDotCircle, FaPaperPlane, FaMinus } from 'react-icons/fa';

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
import Dropzone from '../../components/common/Dropzone';
import Dropdown from '../../components/common/Dropdown';
import RecipientDropdown from "../../components/ask/RecipientDropdown";
import CardAttachment from "../../components/cards/CardAttachment";

import { colors } from '../../styles/colors';
import { expandDock } from '../../actions/display';
import * as askActions from '../../actions/ask';
import { ASK_INTEGRATIONS } from '../../utils/constants';

import style from "./ask.css";
import { getStyleApplicationFn, isOverflowing } from '../../utils/styleHelpers';
import { createSelectOptions } from '../../utils/selectHelpers';
const s = getStyleApplicationFn(style);

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
    dockExpanded: state.display.dockExpanded,
    ...state.ask,
  }),
  dispatch => bindActionCreators({
    expandDock,
    ...askActions
  }, dispatch)
)

class Ask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAttachmentDropdownOpen: false,
    }

    this.expandedPageRef = React.createRef();
  }

  renderTabHeader = () => {
    const { changeAskIntegration, activeIntegration } = this.props;

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
          onTabClick={changeAskIntegration}
          showRipple={false}
        >
          {ASK_INTEGRATIONS.map((integration) => (
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

  startScreenRecording = () => {
    const { addAskScreenRecordingChunk, startAskScreenRecording, askScreenRecordingError } = this.props;
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
            addAskScreenRecordingChunk(event.data);
          }
        });
        mediaRecorder.start(10);

        stream.onended = () => {
          this.endScreenRecording();
        };

        stream.addEventListener('inactive', (e) => {
          this.endScreenRecording();
        });

        startAskScreenRecording(stream, mediaRecorder);
      })
      .catch(error => {
        askScreenRecordingError(error);
      });
  };

  endScreenRecording = () => {
    const { mediaRecorder, localStream, recordedChunks, screenRecordings, endAskScreenRecording } = this.props;

    mediaRecorder.stop();
    localStream.getTracks().forEach(track => track.stop());
    const recordingBlob = new Blob(recordedChunks, { type: 'video/webm' });

    const reader = new FileReader();
    reader.readAsDataURL(recordingBlob);
    reader.onloadend = () => endAskScreenRecording(reader.result);
  };


  renderAskInputs = () => {
    const {
      questionTitle, updateAskQuestionTitle,
      questionDescription, updateAskQuestionDescription,
      desktopSharing,
      addAskAttachments, removeAskAttachment, attachments,
    } = this.props;
    const { isAttachmentDropdownOpen } = this.state;

    return (
      <div >
        <div className={s("flex-col relative")}>
          <input
            placeholder="Question"
            onChange={e => updateAskQuestionTitle(e.target.value)}
            value={questionTitle}
            className={s("w-full mb-reg")}
          />
          <TextEditor 
            onEditorStateChange={updateAskQuestionDescription} 
            editorState={questionDescription} 
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
            onClick={!desktopSharing ? this.startScreenRecording : this.endScreenRecording}
            className={s("ask-attachment-button ask-screen-record-shadow mr-xs bg-red-100 text-red-500")}
            text={!desktopSharing ? 'Screen Record' : 'End Recording'}
            underline
            underlineColor="red-200"
            icon={<FaRegDotCircle className={s("ml-sm text-red-500")} />}
            iconLeft={false}
          />
          <Dropzone
            className={s("mx-xs flex-1 border border-dashed")}
            style={{ borderColor: colors.gray.light }}
            onDrop={acceptedFiles => addAskAttachments(acceptedFiles)}
          >
            <Button
              className={s("ask-attachment-button bg-white text-purple-reg shadow-none")}
              text="Drag & Drop"
              icon={<MdCloudUpload color={colors.purple.reg} className={s("ml-sm")} />}
              iconLeft={false}
            />
          </Dropzone>
          <div className={s("ml-xs relative")}>
            <Button
              onClick={() => this.setState({ isAttachmentDropdownOpen: !isAttachmentDropdownOpen })}
              className={s("bg-white py-reg px-sm")}
              icon={<MdAttachment color={colors.purple.reg} className={s("ask-attachment-icon")} />}
            />
            <div className={s("ask-attachment-count")}>
              {attachments.length}
            </div>
            <Dropdown isOpen={isAttachmentDropdownOpen}>
              <div className={s("ask-attachment-dropdown")}>
                { attachments.length === 0 &&
                  <div className={s("text-center")}>
                    No current attachments
                  </div>
                }
                { attachments.map(({ type, data }, i) => (
                  <CardAttachment
                    type={type === 'recording' ? 'video' : data.type}
                    filename={type === 'recording' ? 'Screen Recording' : data.name}
                    textClassName={s("truncate")}
                    removeIconClassName={s("ml-auto")}
                    onRemoveClick={() => removeAskAttachment(i)}
                  />
                ))}
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }

  renderIndividualRecipient = ({ id, name }, index) => {
    const { removeAskRecipient } = this.props;

    return (
      <div key={id} className={s("bg-white ask-recipient")}>
        <span className={s("truncate")}> @ {name} </span>
        <div>
          <button onClick={() => removeAskRecipient(index)}>
            <MdClose className={s("text-purple-gray-50 ml-xs")} />
          </button>
        </div>
      </div>
    );
  }

  renderChannelRecipient = ({ id, name, mentions, isDropdownOpen, isDropdownSelectOpen }, index) => {
    const { removeAskRecipient, updateAskRecipient } = this.props;

    return (
      <div key={id} className={s(`bg-purple-gray-10 ask-recipient ${isDropdownOpen || isDropdownSelectOpen ? 'rounded-t-none' : ''}`)}>
        <span className={s("truncate")}> # {name} </span>
        <div
          className={s("ask-recipient-mentions-count button-hover")}
          onClick={() => updateAskRecipient(index, { isDropdownOpen: true, isDropdownSelectOpen: false })}
        >
          {mentions.length}
        </div>
        <div className={s("vertical-separator bg-purple-gray-50")} />
        <button onClick={() => updateAskRecipient(index, { isDropdownOpen: false, isDropdownSelectOpen: true })}>
          <IoMdAdd className={s("text-purple-reg mr-xs")} />
        </button>
        <button onClick={() => removeAskRecipient(index)}>
          <MdClose className={s("text-purple-reg")} />
        </button>
      </div>
    );
  }

  renderRecipientSelection = () => {
    const { recipients, addAskRecipient, updateAskRecipient } = this.props;

    return (
      <div className={s("bg-purple-light flex-1 flex flex-col p-lg")}>
        <div className={s("text-purple-reg text-xs mb-reg")}>Send to channel/person</div>
        <Select
          value={null}
          onChange={({ label, value }) => addAskRecipient(value)}
          placeholder="Enter name"
          options={PLACEHOLDER_RECIPIENT_OPTIONS.filter(({ value: recipient }) => !recipients.some(currRecipient => currRecipient.id === recipient.id))}
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
          renderScrollElement={({ type, ...rest }, i) => (type === 'channel' ?
            this.renderChannelRecipient(rest, i) :
            this.renderIndividualRecipient(rest, i)
          )}
          renderOverflowElement={({ type, id, name, mentions, isDropdownOpen, isDropdownSelectOpen }, i) => ( type === 'channel' &&
            <RecipientDropdown
              name={name}
              mentions={mentions}
              isDropdownOpen={isDropdownOpen}
              isDropdownSelectOpen={isDropdownSelectOpen}
              onAddMention={(newMention) => updateAskRecipient(i, { mentions: _.union(mentions, [newMention]) })}
              onRemoveMention={(removeMention) => updateAskRecipient(i, { mentions: _.without(mentions, removeMention) })}
              onClose={() => updateAskRecipient(i, { isDropdownOpen: false, isDropdownSelectOpen: false })}
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
    return (
      <div className={s('flex flex-col flex-1 min-h-0')}>
        <div className={s('flex flex-col flex-1 overflow-y-auto bg-purple-light')} ref={this.expandedPageRef}>
          <div className={s("p-lg bg-white")}>
            { this.renderTabHeader() }
            { this.renderAskInputs() }
          </div>
          { this.renderRecipientSelection() }
        </div>
        { this.renderFooterButton() }
      </div>
    );
  };

  expandDock = () => {
    const { expandDock, updateAskSearchText } = this.props;
    updateAskSearchText("");
    expandDock();
  }

  renderMinifiedAskPage = () => {
    const { expandDock, updateAskSearchText, searchText } = this.props;
    const showRelatedQuestions = searchText.length > 0;

    return (
      <div className={s("p-lg overflow-y-auto")}>
        <input
          onChange={e => updateAskSearchText(e.target.value)}
          value={searchText}
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
            onClick={() => this.expandDock()}
          />
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
