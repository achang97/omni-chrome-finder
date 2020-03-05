import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { MdChevronRight, MdPictureInPicture, MdClose, MdCloudUpload, MdAttachment } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { FaRegDotCircle, FaPaperPlane, FaMinus } from 'react-icons/fa';

import TextEditor from '../../components/editors/TextEditor';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import CircleButton from '../../components/common/CircleButton';
import _ from 'underscore';

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import Select from '../../components/common/Select';
import SuggestionPanel from "../../components/suggestions/SuggestionPanel";
import Dropzone from '../../components/common/Dropzone';
import Dropdown from '../../components/common/Dropdown';
import RecipientDropdownBody from "../../components/ask/RecipientDropdownBody";
import CardAttachment from "../../components/cards/CardAttachment";

import { colors } from '../../styles/colors';
import { expandDock } from '../../actions/display';
import { requestSearchCards } from '../../actions/search';
import * as askActions from '../../actions/ask';
import { generateFileKey } from '../../utils/fileHelpers';
import { ASK_INTEGRATIONS, DEBOUNCE_60_HZ, SEARCH_TYPE, SLACK_RECIPIENT_TYPE } from '../../utils/constants';

import style from "./ask.css";
import { getStyleApplicationFn, isOverflowing } from '../../utils/styleHelpers';
import { createSelectOptions } from '../../utils/selectHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
    dockExpanded: state.display.dockExpanded,
    ...state.ask,
    user: state.profile.user,
  }),
  dispatch => bindActionCreators({
    expandDock,
    ...askActions,
    requestSearchCards,
  }, dispatch)
)

class Ask extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    if (this.isLoggedInSlack()) {
      this.props.requestGetSlackConversations();
    }
  }

  componentDidUpdate(prevProps) {
    const prevPropsSlack = prevProps.user && prevProps.user.integrations.slack.access_token;
    const currPropsSlack = this.isLoggedInSlack();
    if (!prevPropsSlack && currPropsSlack) {
      this.props.requestGetSlackConversations();
    }
  }

  isLoggedInSlack = () => {
    return this.props.user && this.props.user.integrations.slack.access_token;
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
              <div className={s(integration !== activeIntegration ? 'underline-border border-purple-gray-20' : 'primary-underline')}>
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
    const { addAskScreenRecordingChunk, startAskScreenRecording, handleAskScreenRecordingError } = this.props;
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
        handleAskScreenRecordingError(error);
      });
  };

  endScreenRecording = () => {
    const { mediaRecorder, localStream, recordedChunks, screenRecordings, endAskScreenRecording, requestAddAskAttachment } = this.props;

    if (mediaRecorder && localStream) {
      mediaRecorder.stop();
      localStream.getTracks().forEach(track => track.stop());
      endAskScreenRecording();

      const now = moment().format('DD.MM.YYYY HH:mm:ss');
      const recording = new File(recordedChunks, `Screen Recording ${now}.webm`, { type: 'video/webm' });
      requestAddAskAttachment(generateFileKey(), recording);
    }
  };

  addAskAttachments = (files) => {
    const { requestAddAskAttachment } = this.props;
    files.forEach(file => {
      requestAddAskAttachment(generateFileKey(), file);
    })
  }

  renderAskInputs = () => {
    const {
      questionTitle, updateAskQuestionTitle,
      questionDescription, updateAskQuestionDescription,
      desktopSharing,
      requestRemoveAskAttachment, attachments, updateAskAttachmentName,
    } = this.props;

    return (
      <div >
        <div className={s("flex-col relative")}>
          <input
            placeholder="Question"
            onChange={e => updateAskQuestionTitle(e.target.value)}
            value={questionTitle}
            autoFocus
            className={s("w-full mb-reg")}
          />
          <TextEditor 
            onEditorStateChange={updateAskQuestionDescription} 
            editorState={questionDescription} 
            editorType="EXTENSION"
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
            disabled={!navigator.mediaDevices}
          />
          <Dropzone
            className={s("mx-xs flex-1 border border-dashed")}
            style={{ borderColor: colors.gray.light }}
            onDrop={acceptedFiles => this.addAskAttachments(acceptedFiles)}
          >
            <Button
              className={s("ask-attachment-button bg-white text-purple-reg shadow-none")}
              text="Drag & Drop"
              icon={<MdCloudUpload color={colors.purple.reg} className={s("ml-sm")} />}
              iconLeft={false}
            />
          </Dropzone>
          <Dropdown
            className={s("ml-xs")}
            toggler={
              <div className={s("relative")}>
                <Button
                  className={s("bg-white py-reg px-sm")}
                  icon={<MdAttachment color={colors.purple.reg} className={s("ask-attachment-icon")} />}
                />
                <div className={s("ask-attachment-count")}>
                  {attachments.length}
                </div>
              </div>
            }
            body={
              <div className={s("ask-attachment-dropdown")}>
                { attachments.length === 0 &&
                  <div className={s("text-center")}>
                    No current attachments
                  </div>
                }
                { attachments.map(({ name, key, mimetype, location, isLoading, error }, i) => (
                  <CardAttachment
                    key={key}
                    type={mimetype}
                    fileName={name}
                    url={location}
                    isLoading={isLoading}
                    error={error}
                    textClassName={s("truncate")}
                    removeIconClassName={s("ml-auto")}
                    isEditable={true}
                    onFileNameChange={(fileName) => updateAskAttachmentName(key, fileName)}
                    onRemoveClick={() => requestRemoveAskAttachment(key)}
                  />
                ))}
              </div>
            }
          />
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

  renderChannelRecipient = ({ id, name, mentions, members, isDropdownOpen, isDropdownSelectOpen }, index) => {
    const { removeAskRecipient, updateAskRecipient } = this.props;

    return (
      <div key={id} className={s(`bg-purple-gray-10 ask-recipient ${isDropdownOpen || isDropdownSelectOpen ? 'rounded-t-none' : ''}`)}>
        <span className={s("truncate")}> # {name} </span>
        <Dropdown
          isOpen={isDropdownOpen}
          onToggle={isDropdownOpen => updateAskRecipient(index, { isDropdownOpen })}
          isDown={false}
          isTogglerRelative={false}
          toggler={
            <div className={s("ask-recipient-mentions-count button-hover")}>
              {mentions.length}
            </div>
          }
          body={ 
            <div className={s("ask-recipient-dropdown")}>
              { mentions.length === 0 ?
                <div className={s("text-center text-purple-reg font-normal")}> No current mentions </div> :
                <div className={s("overflow-auto px-reg text-purple-reg")}>
                  { mentions.map((mention) => (
                    <div key={mention.id} className={s("flex justify-between items-center py-xs")}>
                      <div className={s("min-w-0 truncate font-semibold")}> @{mention.name} </div>
                      <button onClick={() => updateAskRecipient(index, { mentions: _.without(mentions, mention)})}>
                        <MdClose className={s("text-purple-reg")} />
                      </button>
                    </div>
                  ))}
                </div>
              }
            </div>
          }
        />
        <div className={s("vertical-separator bg-purple-gray-50")} />
        <Dropdown
          isOpen={isDropdownSelectOpen}
          onToggle={isDropdownSelectOpen => updateAskRecipient(index, { isDropdownSelectOpen })}
          isDown={false}
          isTogglerRelative={false}
          toggler={
            <button>
              <IoMdAdd className={s("text-purple-reg mr-xs")} />
            </button>
          }
          body={ 
            <div className={s("ask-recipient-dropdown")}>
              <RecipientDropdownBody
                mentions={mentions}
                mentionOptions={members}
                onAddMention={(newMention) => updateAskRecipient(index, { mentions: _.union(mentions, [newMention]) })}
              />
            </div>
          }
        />
        <button onClick={() => removeAskRecipient(index)}>
          <MdClose className={s("text-purple-reg")} />
        </button>
      </div>
    );
  }

  renderRecipientSelection = () => {
    const {
      recipients, addAskRecipient, updateAskRecipient,
      slackConversations, isGettingSlackConversations, getSlackConversationsError,
    } = this.props;

    return (
      <div className={s("bg-purple-light flex-1 flex flex-col p-lg")}>
        <div className={s("text-purple-reg text-xs mb-reg")}>Send to channel/person</div>
        <Select
          value={null}
          onChange={addAskRecipient}
          placeholder="Enter name"
          options={slackConversations}
          getOptionLabel={option => `${option.type === SLACK_RECIPIENT_TYPE.CHANNEL ? '#' : '@'}${option.name}`}
          getOptionValue={option => option.id}
          isSearchable
          menuShouldScrollIntoView
        />
        { recipients.length === 0 &&
          <div className={s("text-gray-light text-sm my-reg text-center")}>
            No current recipients
          </div>
        }
        <div className={s("my-xs flex flex-wrap content-start")}>
          { recipients.map(({ type, ...rest }, i) => (type === SLACK_RECIPIENT_TYPE.CHANNEL ?
            this.renderChannelRecipient(rest, i) :
            this.renderIndividualRecipient(rest, i)
          ))}
        </div>
      </div>
    );    
  }

  renderFooterButton = () => {
    const { questionTitle, questionDescription, recipients, requestAskQuestion, isAskingQuestion } = this.props;
    return (
      <Button
        className={s('self-stretch justify-between rounded-t-none rounded-br-none rounded-bl-reg text-reg')}
        color="primary"
        text="Ask Question"
        disabled={questionTitle === '' || !questionDescription.getCurrentContent().hasText() || recipients.length === 0 || isAskingQuestion}
        iconLeft={false}
        icon={ isAskingQuestion ?
          <Loader className={s("h-3xl w-3xl")} size="sm" color="white" /> :
          <span className={s("rounded-full h-3xl w-3xl flex justify-center items-center bg-white text-purple-reg")}>
            <FaPaperPlane />
          </span>
        }
        onClick={requestAskQuestion}
      />
    )
  }

  renderResultModal = (isOpen, title, content) => {
    const { clearAskQuestionInfo } = this.props;
    return (
      <Modal 
        isOpen={isOpen} 
        onRequestClose={clearAskQuestionInfo}
        bodyClassName={s("overflow-none flex flex-col rounded-b-lg p-reg")}
        className={s("bg-purple-light")}
        overlayClassName={s("rounded-b-lg")}
        title={title}
      >
        <div className={s("mb-sm")}> { content } </div>
        <Button
          text="Ok"
          color="primary"
          className={s("p-sm")}
          onClick={clearAskQuestionInfo}
        /> 
      </Modal>
    );
  }

  renderExpandedAskPage = () => {
    const { askError, askSuccess, user } = this.props;
    const url = "https://slack.com/oauth/authorize?client_id=902571434263.910615559953&scope=chat:write:user,calls:read,calls:write,channels:history,channels:read,commands,files:read,groups:history,groups:read,im:history,im:read,im:write,incoming-webhook,links:read,mpim:history,mpim:read,mpim:write,pins:read,pins:write,reactions:read,reactions:write,reminders:read,reminders:write,remote_files:read,remote_files:share,remote_files:write,team:read,usergroups:read,usergroups:write,users.profile:read,users:read,users:read.email,users:write&user_scope=calls:read,calls:write,channels:history,channels:read,channels:write,dnd:read,dnd:write,emoji:read,files:read,files:write,groups:history,groups:read,groups:write,im:history,im:read,im:write,links:read,links:write,mpim:history,mpim:read,mpim:write,pins:read,pins:write,reactions:read,reactions:write,reminders:read,reminders:write,remote_files:read,remote_files:share,remote_files:write,search:read,stars:read,stars:write,team:read,usergroups:read,usergroups:write,users.profile:read,users.profile:write,users:read,users:read.email,users:write&state=" + user._id;

    const isLoggedInSlack = this.isLoggedInSlack();

    return (
      <div className={s('flex flex-col flex-1 min-h-0 relative')}>
        <div className={s('flex flex-col flex-1 overflow-y-auto bg-purple-light')}>
          <div className={s("p-lg bg-white")}>
            { this.renderTabHeader() }
            { !isLoggedInSlack ?
              <div>
                <a target="_blank" href={url}><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
              </div> :
              this.renderAskInputs()
            }
          </div>
          { isLoggedInSlack && this.renderRecipientSelection() }
        </div>
        { isLoggedInSlack && this.renderFooterButton() }
        {/* Modals */}
        { this.renderResultModal(!!askError, 'Ask Error', askError) }
        { this.renderResultModal(askSuccess, 'Ask Success', 'Successfully sent question!') }
      </div>
    );
  };

  expandDock = () => {
    const { expandDock, updateAskSearchText } = this.props;
    updateAskSearchText("");
    expandDock();
  }

  renderMinifiedAskPage = () => {
    const { expandDock, searchText, updateAskSearchText, requestSearchCards } = this.props;
    const showRelatedQuestions = searchText.length > 0;

    return (
      <div className={s("p-lg overflow-y-auto")}>
        <input
          onChange={e => updateAskSearchText(e.target.value)}
          value={searchText}
          placeholder="Let's find what you're looking for"
          className={s("w-full")}
          autoFocus
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
        <SuggestionPanel
          isVisible={showRelatedQuestions}
          query={searchText}
        />
      </div>
    );
  };

  render() {
    const { dockExpanded } = this.props;
    return (dockExpanded ? this.renderExpandedAskPage() : this.renderMinifiedAskPage());
  }
}

export default withRouter(Ask);
