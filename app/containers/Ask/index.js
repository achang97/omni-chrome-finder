import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import AnimateHeight from 'react-animate-height';
import { connect } from 'react-redux';
import moment from 'moment';

import { MdChevronRight, MdPictureInPicture, MdClose, MdCloudUpload, MdAttachment } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { FaRegDotCircle, FaPaperPlane, FaMinus } from 'react-icons/fa';

import TextEditor from '../../components/editors/TextEditor';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import CircleButton from '../../components/common/CircleButton';
import Separator from '../../components/common/Separator';
import Message from '../../components/common/Message';
import _ from 'lodash';

import Tabs from '../../components/common/Tabs';
import Tab from '../../components/common/Tab';
import Select from '../../components/common/Select';
import SuggestionPanel from '../../components/suggestions/SuggestionPanel';
import Dropzone from '../../components/common/Dropzone';
import Dropdown from '../../components/common/Dropdown';
import Badge from '../../components/common/Badge';
import RecipientDropdownBody from '../../components/ask/RecipientDropdownBody';
import CardAttachment from '../../components/cards/CardAttachment';

import ScreenRecordButton from '../../components/attachments/ScreenRecordButton';
import AttachmentDropdown from '../../components/attachments/AttachmentDropdown';
import AttachmentDropzone from '../../components/attachments/AttachmentDropzone';

import { colors } from '../../styles/colors';
import { expandDock } from '../../actions/display';
import { requestSearchCards } from '../../actions/search';
import * as askActions from '../../actions/ask';
import { generateFileKey, isAnyLoading } from '../../utils/file';
import { isLoggedIn, getIntegrationAuthLink } from '../../utils/auth';
import { ROUTES, ASK_INTEGRATIONS, INTEGRATIONS, DEBOUNCE_60_HZ, SEARCH_TYPE, SLACK_RECIPIENT_TYPE  } from '../../utils/constants';

import SlackIcon from '../../assets/images/icons/Slack_Mark.svg';
import GmailIcon from '../../assets/images/icons/Gmail_Icon.svg';

import { getArrayWithout } from '../../utils/array';

import style from './ask.css';
import { getStyleApplicationFn } from '../../utils/style';
import { createSelectOptions } from '../../utils/select';
const s = getStyleApplicationFn(style);

class Ask extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { user } = this.props;

    if (isLoggedIn(user, INTEGRATIONS.SLACK.type)) {
      this.props.requestGetSlackConversations();
    }
  }

  componentDidUpdate(prevProps) {
    const prevPropsSlack = isLoggedIn(prevProps.user, INTEGRATIONS.SLACK.type);
    const currPropsSlack = isLoggedIn(this.props.user, INTEGRATIONS.SLACK.type);
    if (!prevPropsSlack && currPropsSlack) {
      this.props.requestGetSlackConversations();
    }
  }

  renderTabHeader = () => {
    const { changeAskIntegration, activeIntegration, history } = this.props;

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
          {ASK_INTEGRATIONS.map(integration => (
            <Tab key={integration.type} value={integration}>
              <div className={s(integration !== activeIntegration ? 'underline-border border-purple-gray-20' : 'primary-underline')}>
                {integration.title}
              </div>
            </Tab>
          ))}
        </Tabs>
        <CircleButton
          content={<IoMdAdd color={colors.purple.reg} />}
          size="md"
          buttonClassName={s('bg-purple-light')}
          onClick={() => history.push(ROUTES.PROFILE)}
        />
      </div>
    );
  }

  addAskAttachments = (files) => {
    const { requestAddAskAttachment } = this.props;
    files.forEach((file) => {
      requestAddAskAttachment(generateFileKey(), file);
    });
  }

  renderAskInputs = () => {
    const {
      questionTitle, updateAskQuestionTitle,
      questionDescription, updateAskQuestionDescription,
      requestRemoveAskAttachment, attachments, updateAskAttachmentName,
    } = this.props;

    return (
      <div >
        <div className={s('flex-col relative')}>
          <input
            placeholder="Question"
            onChange={e => updateAskQuestionTitle(e.target.value)}
            value={questionTitle}
            autoFocus
            className={s('w-full mb-reg')}
          />
          <TextEditor
            onEditorStateChange={updateAskQuestionDescription}
            editorState={questionDescription}
            editorType="EXTENSION"
          />
        </div>
        <div className={s('flex px-xs pt-reg')}>
          <ScreenRecordButton
            onSuccess={recording => this.addAskAttachments([recording])}
          />
          <AttachmentDropzone
            className={s('mx-xs')}
            onDrop={this.addAskAttachments}
          />
          <AttachmentDropdown
            attachments={attachments}
            onFileNameChange={({ key, fileName }) => updateAskAttachmentName(key, fileName)}
            onRemoveClick={(key) => requestRemoveAskAttachment(key)}
          />
        </div>
      </div>
    );
  }

  renderIndividualRecipient = ({ id, name }, index) => {
    const { removeAskRecipient } = this.props;

    return (
      <div key={id} className={s('bg-white ask-recipient')}>
        <span className={s('truncate')}> @ {name} </span>
        <div>
          <button onClick={() => removeAskRecipient(index)}>
            <MdClose className={s('text-purple-gray-50 ml-xs')} />
          </button>
        </div>
      </div>
    );
  }

  renderChannelRecipient = ({ id, name, mentions, members, isDropdownOpen, isDropdownSelectOpen }, index) => {
    const { removeAskRecipient, updateAskRecipient } = this.props;

    return (
      <div key={id} className={s(`bg-purple-gray-10 ask-recipient ${isDropdownOpen || isDropdownSelectOpen ? 'rounded-t-none' : ''}`)}>
        <span className={s('truncate')}> # {name} </span>
        <Dropdown
          isOpen={isDropdownOpen}
          onToggle={isDropdownOpen => updateAskRecipient(index, { isDropdownOpen })}
          isDown={false}
          isTogglerRelative={false}
          toggler={
            <div className={s('ask-recipient-mentions-count button-hover')}>
              {mentions.length}
            </div>
          }
          body={
            <div className={s('ask-recipient-dropdown')}>
              { mentions.length === 0 ?
                <div className={s('text-center text-purple-reg font-normal')}> No current mentions </div> :
                <div className={s('overflow-auto px-reg text-purple-reg')}>
                  { mentions.map(mention => (
                    <div key={mention.id} className={s('flex justify-between items-center py-xs')}>
                      <div className={s('min-w-0 truncate font-semibold')}> @{mention.name} </div>
                      <button onClick={() => updateAskRecipient(index, { mentions: _.without(mentions, mention) })}>
                        <MdClose className={s('text-purple-reg')} />
                      </button>
                    </div>
                  ))}
                </div>
              }
            </div>
          }
        />
        <Separator className={s('bg-purple-gray-50')} />
        <Dropdown
          isOpen={isDropdownSelectOpen}
          onToggle={isDropdownSelectOpen => updateAskRecipient(index, { isDropdownSelectOpen })}
          isDown={false}
          isTogglerRelative={false}
          toggler={
            <button>
              <IoMdAdd className={s('text-purple-reg mr-xs')} />
            </button>
          }
          body={
            <div className={s('ask-recipient-dropdown')}>
              <RecipientDropdownBody
                mentions={mentions}
                mentionOptions={members}
                onAddMention={newMention => updateAskRecipient(index, { mentions: _.union(mentions, [newMention]) })}
              />
            </div>
          }
        />
        <button onClick={() => removeAskRecipient(index)}>
          <MdClose className={s('text-purple-reg')} />
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
      <div className={s('bg-purple-light flex-1 flex flex-col p-lg')}>
        <div className={s('text-purple-reg text-xs mb-reg')}>Send to channel/person</div>
        <Select
          value={null}
          onChange={addAskRecipient}
          placeholder="Enter name"
          options={getArrayWithout(slackConversations, recipients, 'id')}
          getOptionLabel={option => `${option.type === SLACK_RECIPIENT_TYPE.CHANNEL ? '#' : '@'}${option.name}`}
          getOptionValue={option => option.id}
          isSearchable
          menuShouldScrollIntoView
        />
        { recipients.length === 0 &&
          <div className={s('text-gray-light text-sm my-reg text-center')}>
            No current recipients
          </div>
        }
        <div className={s('my-xs flex flex-wrap content-start')}>
          { recipients.map(({ type, ...rest }, i) => (type === SLACK_RECIPIENT_TYPE.CHANNEL ?
            this.renderChannelRecipient(rest, i) :
            this.renderIndividualRecipient(rest, i)
          ))}
        </div>
      </div>
    );
  }

  renderFooterButton = () => {
    const { questionTitle, questionDescription, recipients, requestAskQuestion, attachments, isAskingQuestion } = this.props;
    return (
      <Button
        className={s('self-stretch justify-between rounded-t-none rounded-br-none rounded-bl-reg text-reg')}
        color="primary"
        text="Ask Question"
        disabled={
          questionTitle === '' ||
          !questionDescription.getCurrentContent().hasText() ||
          recipients.length === 0 ||
          isAnyLoading(attachments) ||
          isAskingQuestion
        }
        iconLeft={false}
        icon={isAskingQuestion ?
          <Loader className={s('h-3xl w-3xl')} color="white" /> :
          <span className={s('rounded-full h-3xl w-3xl flex justify-center items-center bg-white text-purple-reg')}>
            <FaPaperPlane />
          </span>
        }
        onClick={requestAskQuestion}
      />
    );
  }
  
  renderDisabledView = () => {
    const { user, token, activeIntegration } = this.props;

    const { type, title, logo, disabled } = activeIntegration;
    const authLink = getIntegrationAuthLink(user._id, token, type);

    return (
      <div className={s('flex flex-col items-center')}>
        <div className={s('large-icon-container my-reg')}>
          <img src={logo} className={s('w-full h-full')} />
        </div>
        <div className={s('mt-reg mb-lg font-semibold')}>
          { disabled ?
            `Our ${title} integration is coming soon!` :
            `You aren't logged into ${title}`
          }
        </div>
        { !disabled &&
          <div className={s('rounded-lg shadow-md py-sm px-lg')}>
            <a target="_blank" href={authLink} className={s('flex items-center')}>
              <span className={s('mr-sm text-md')}> Connect to {title} </span>
              <img src={logo} className={s('h-lg')} />
            </a>
          </div>
        }
      </div>
    );
  }

  renderExpandedAskPage = () => {
    const { askError, askSuccess, user, activeIntegration } = this.props;
    const loggedIn = isLoggedIn(user, activeIntegration.type);
    const isDisabled = activeIntegration.disabled;

    return (
      <div className={s('flex flex-col flex-1 min-h-0 relative')}>
        <div className={s('flex flex-col flex-1 overflow-y-auto bg-purple-light')}>
          <div className={s('p-lg bg-white flex-1')}>
            { this.renderTabHeader() }
            { (!loggedIn || isDisabled) ? this.renderDisabledView() : this.renderAskInputs() }
          </div>
          { loggedIn && !isDisabled && this.renderRecipientSelection() }
        </div>
        { loggedIn && !isDisabled && this.renderFooterButton() }
      </div>
    );
  };

  expandDock = () => {
    const { expandDock, updateAskSearchText, showFeedback, toggleAskFeedbackInput, updateAskFeedback } = this.props;

    if (showFeedback) {
      toggleAskFeedbackInput();
      updateAskFeedback('');
    }

    updateAskSearchText('');
    expandDock();
  }

  renderMinifiedAskPage = () => {
    const {
      expandDock, searchText, updateAskSearchText, requestSearchCards,
      toggleAskFeedbackInput, showFeedback, feedback, updateAskFeedback,
      requestSubmitFeedback, isSubmittingFeedback, feedbackSuccess, feedbackError,
    } = this.props;

    return (
      <div className={s('p-lg overflow-y-auto')}>
        <input
          onChange={e => updateAskSearchText(e.target.value)}
          value={searchText}
          placeholder="Let's find what you're looking for"
          className={s('w-full')}
          autoFocus
        />
        <div className={s('mt-lg flex flex-row justify-center items-center')}>
          <span className={s('flex-1 text-gray-dark ml-sm text-xs font-medium')}>
            Don't see your question?
          </span>
          <Button
            text="Ask Question"
            color="primary"
            className={s('justify-between')}
            iconLeft={false}
            icon={<MdChevronRight color="white" className={s('ml-sm')} />}
            onClick={() => this.expandDock()}
          />
        </div>
        <AnimateHeight height={showFeedback ? 0 : 'auto'}>
          <div className={s('flex justify-end mt-reg text-gray-dark text-xs font-medium')}>
            <div className={s('cursor-pointer')} onClick={toggleAskFeedbackInput}>
              Have Feedback?
            </div>
          </div>
        </AnimateHeight>
        <AnimateHeight height={showFeedback ? 'auto' : 0}>
          <Separator horizontal className={s('my-reg')} />
          { feedbackSuccess ? 
            <Message
              message={<span> 🎉 <span className={s('mx-sm')}> Thanks for your feedback! </span> 🎉 </span>}
              className={s('text-md text-center text-green-reg')}
              animate
              temporary
              onHide={toggleAskFeedbackInput}
              type="success"
            /> :
            <div>
              <div className={s(('flex justify-between mb-xs text-gray-dark'))}>
                <div className={s('text-xs')}> Enter your feedback: </div>
                <MdClose className={s('cursor-pointer')} onClick={toggleAskFeedbackInput} />
              </div>
              <textarea
                className={s('w-full resize')}
                value={feedback}
                onChange={e => updateAskFeedback(e.target.value)}
              />
              <Message className={s('my-sm')} message={feedbackError} type="error" />
              <Button
                text="Submit Feedback"
                color="transparent"
                className={s('p-xs')}
                iconLeft={false}
                icon={isSubmittingFeedback ?
                  <Loader size="xs" className={s('ml-sm')} color="white" /> :
                  null
                }
                disabled={feedback.length === 0}
                onClick={requestSubmitFeedback}
              />
            </div>
          }
        </AnimateHeight>
        <SuggestionPanel
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

export default connect(
  state => ({
    dockExpanded: state.display.dockExpanded,
    ...state.ask,
    user: state.profile.user,
    token: state.auth.token,
  }),
  dispatch => bindActionCreators({
    expandDock,
    ...askActions,
    requestSearchCards,
  }, dispatch)
)(Ask);
