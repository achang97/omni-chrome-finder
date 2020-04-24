import React, { useEffect } from 'react';
import AnimateHeight from 'react-animate-height';
import _ from 'lodash';
import moment from 'moment';
import { MdChevronRight, MdPictureInPicture, MdClose, MdCloudUpload, MdAttachment } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { FaRegDotCircle, FaPaperPlane, FaMinus } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import {
  Button, Loader, CircleButton, Separator, Message,
  Tabs, Tab, Select, Dropzone, Dropdown, Badge
} from 'components/common';
import { ScreenRecordButton, AttachmentDropdown, AttachmentDropzone } from 'components/attachments';
import TextEditor from 'components/editors/TextEditor';
import SuggestionPanel from 'components/suggestions/SuggestionPanel';
import RecipientDropdownBody from 'components/ask/RecipientDropdownBody';
import CardAttachment from 'components/cards/CardAttachment';

import { colors } from 'styles/colors';
import { generateFileKey, isAnyLoading } from 'utils/file';
import { isLoggedIn, getIntegrationAuthLink } from 'utils/auth';
import { getArrayWithout } from 'utils/array';
import { ROUTES, INTEGRATIONS, ASK } from 'appConstants';

import style from './ask.css';
import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn(style);

const PROGRESS_BAR_STYLES = {
  // How long animation takes to go from one percentage to another, in seconds
  pathTransitionDuration: 0.5,

  // Colors
  textColor: colors.gold.reg,
  pathColor: colors.purple.reg,

  textSize: '30px',
};

const USER_PERFORMANCE = {
  FIRST_CARD: true,
  SEARCH_CARD: true,
  MARK_HELPFUL: true,
  CREATE_CARD: false,
  FLAG_OUTDATED: true,
  ADD_TAG: true,
  UP_TO_DATE: false,
  NO_UNRESOLVED: false,
  CREATE_CARD_RECENT: true,
  OWN_MULTIPLE: true,
  ADD_SUBSCRIBER: false,
}

const PERFORMANCE_CRITERIA = {
  FIRST_CARD: {
    title: "Make your first card",
    weight: 20,
  },
  SEARCH_CARD: {
    title: "Search for a card and open it",
    weight: 10,
  },
  MARK_HELPFUL: {
    title: "Mark a card as helpful",
    weight: 10,
  },
  CREATE_CARD: {
    title: "Create a card in the extension",
    weight: 10,
  },
  FLAG_OUTDATED: {
    title: "Flag a card as out of date",
    weight: 5,
  },
  ADD_TAG: {
    title: "Add a tag to one of your cards",
    weight: 5,
  },
  UP_TO_DATE: {
    title: "Make sure all your cards are up to date",
    weight: 10,
  },
  NO_UNRESOLVED: {
    title: "Make sure all your tasks are resolved",
    weight: 10,
  },
  CREATE_CARD_RECENT: {
    title: "Created a card in the past week",
    weight: 5,
  },
  OWN_MULTIPLE: {
    title: "Own at least 4 cards",
    weight: 10,
  },
  ADD_SUBSCRIBER: {
    title: "Add a subscriber to your card",
    weight: 5,
  }
}

const Ask = ({
  user, token, 
  changeAskIntegration, activeIntegration,
  requestAddAskAttachment, requestRemoveAskAttachment, attachments, updateAskAttachmentName,
  requestAskQuestion, isAskingQuestion, askError, askSuccess,
  questionTitle, updateAskQuestionTitle,
  questionDescription, updateAskQuestionDescription,
  recipients, removeAskRecipient, updateAskRecipient, addAskRecipient,
  slackConversations, requestGetSlackConversations, isGettingSlackConversations, getSlackConversationsError,
  dockExpanded, expandDock,
  searchText, updateAskSearchText, requestSearchCards,
  toggleAskFeedbackInput, showFeedback, feedback, updateAskFeedback,
  requestSubmitFeedback, isSubmittingFeedback, feedbackSuccess, feedbackError,
  togglePerformanceScore, showPerformanceScore,
  history
}) => {
  const isLoggedInSlack = isLoggedIn(user, INTEGRATIONS.SLACK.type);
  useEffect(() => {
    if (isLoggedInSlack) {
      requestGetSlackConversations();
    }
  }, [isLoggedInSlack]);

  const getPerformanceColors = (score) => {
    switch (true) {
    case score === 100:
      return { pathColor: colors.gold.reg, textColor: 'text-gold-reg'};
    case score < 100 && score >= 80:
      return { pathColor: colors.green.reg, textColor: 'text-green-reg' };
    case score < 80 && score >= 60:
      return { pathColor: colors.yellow.reg, textColor: 'text-yellow-reg' };
    case score < 60:
      return { pathColor: colors.red.reg, textColor: 'text-red-reg' };
    default:
      return {};
  }
  }

  const getPerformanceScore = () => {
    let score = 0;
    Object.keys(PERFORMANCE_CRITERIA).map((criteria) => {
      if (USER_PERFORMANCE[criteria]) score += PERFORMANCE_CRITERIA[criteria].weight;
    })
    return 100;
  }

  const renderTabHeader = () => {
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
          {ASK.INTEGRATIONS.map(integration => (
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

  const addAskAttachments = (files) => {
    files.forEach((file) => {
      requestAddAskAttachment(generateFileKey(), file);
    });
  }

  const renderAskInputs = () => {
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
            placeholder="Add a description here"
          />
        </div>
        <div className={s('flex px-xs pt-reg')}>
          <ScreenRecordButton
            id="ask"
            onSuccess={({ recording }) => addAskAttachments([recording])}
          />
          <AttachmentDropzone
            className={s('mx-xs')}
            onDrop={addAskAttachments}
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

  const renderIndividualRecipient = ({ id, name }, index) => {
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

  const renderChannelRecipient = ({ id, name, mentions, members, isDropdownOpen, isDropdownSelectOpen }, index) => {
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

  const renderRecipientSelection = () => {
    return (
      <div className={s('bg-purple-light flex-1 flex flex-col p-lg')}>
        <div className={s('text-purple-reg text-xs mb-reg')}>Send to channel/person</div>
        <Select
          value={null}
          onChange={addAskRecipient}
          placeholder="Enter name"
          options={getArrayWithout(slackConversations, recipients, 'id')}
          getOptionLabel={option => `${option.type === ASK.SLACK_RECIPIENT_TYPE.CHANNEL ? '#' : '@'}${option.name}`}
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
          { recipients.map(({ type, ...rest }, i) => (type === ASK.SLACK_RECIPIENT_TYPE.CHANNEL ?
            renderChannelRecipient(rest, i) :
            renderIndividualRecipient(rest, i)
          ))}
        </div>
      </div>
    );
  }

  const renderFooterButton = () => {
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
  
  const renderDisabledView = () => {
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

  const renderExpandedAskPage = () => {
    const loggedIn = isLoggedIn(user, activeIntegration.type);
    const isDisabled = activeIntegration.disabled;

    return (
      <div className={s('flex flex-col flex-1 min-h-0 relative')}>
        <div className={s('flex flex-col flex-1 overflow-y-auto bg-purple-light')}>
          <div className={s('p-lg bg-white flex-1')}>
            { renderTabHeader() }
            { (!loggedIn || isDisabled) ? renderDisabledView() : renderAskInputs() }
          </div>
          { loggedIn && !isDisabled && renderRecipientSelection() }
        </div>
        { loggedIn && !isDisabled && renderFooterButton() }
      </div>
    );
  };

  const showFullDock = () => {
    if (showFeedback) {
      toggleAskFeedbackInput();
      updateAskFeedback('');
    }

    updateAskSearchText('');
    expandDock();
  }

  const renderPerformanceScoreSection = () => {
    return (
      <AnimateHeight height={showPerformanceScore ? 'auto' : 0}>
        <Separator horizontal className={s('my-reg')} />
        <div className={s(('flex justify-between mb-xs text-gray-dark items-center mb-reg'))}>
          <div className={s('flex items-center')}>
            <CircularProgressbar
              className={s('w-3xl h-3xl')}
              value={getPerformanceScore()}
              styles={buildStyles({...PROGRESS_BAR_STYLES, pathColor: getPerformanceColors(getPerformanceScore()).pathColor })}
            />
            <div className={s(`text-xs font-semibold ml-sm ${getPerformanceColors(getPerformanceScore()).textColor}`)}>My Performance: {getPerformanceScore()}%</div>
          </div>
          <MdClose className={s('cursor-pointer')} onClick={togglePerformanceScore} />
        </div>
        <div className={s('overflow-auto')}>
        {
          Object.keys(PERFORMANCE_CRITERIA).map((criteria) => {
            const criteriaInfo = PERFORMANCE_CRITERIA[criteria]
            const isComplete = USER_PERFORMANCE[criteria]
            return (
              <div className={s(`flex justify-between mb-sm text-sm rounded-lg p-sm items-center ${isComplete ? 'gold-gradient' : 'border border-solid border-gray-light'}`)}>
                <div>{criteriaInfo.title}</div>
                <div className={s(`p-xs rounded-lg font-semibold ${isComplete ? 'gold-gradient text-gold-reg' : 'text-purple-reg'}`)}>{criteriaInfo.weight}%</div>
              </div>
            )
          })
        }
        </div>
      </AnimateHeight>
    )
  }

  const renderMinifiedAskPage = () => {
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
            onClick={showFullDock}
          />
        </div>
        <AnimateHeight height={(showFeedback || showPerformanceScore) ? 0 : 'auto'}>
          <div className={s('flex justify-between items-center mt-reg')}>
            <div className={s('flex items-center cursor-pointer')} onClick={togglePerformanceScore}>
              <CircularProgressbar
                className={s('w-3xl h-3xl')}
                value={getPerformanceScore()}
                styles={buildStyles({...PROGRESS_BAR_STYLES, pathColor: getPerformanceColors(getPerformanceScore()).pathColor })}
              />
              <div className={s(`text-xs font-semibold ml-sm ${getPerformanceColors(getPerformanceScore()).textColor}`)}>My Performance: {getPerformanceScore()}%</div>
            </div>
            <div className={s('flex justify-end text-gray-dark text-xs font-medium')}>
              <div className={s('cursor-pointer')} onClick={toggleAskFeedbackInput}>
                Have Feedback?
              </div>
            </div>
          </div>
        </AnimateHeight>
        { renderPerformanceScoreSection() }
        <AnimateHeight height={showFeedback ? 'auto' : 0}>
          <Separator horizontal className={s('my-reg')} />
          { feedbackSuccess ? 
            <Message
              message={<span> 🎉 <span className={s('mx-sm')}> Thanks for your feedback! </span> 🎉 </span>}
              className={s('text-md text-center text-green-reg')}
              animate
              temporary
              show={feedbackSuccess}
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

  return (dockExpanded ? renderExpandedAskPage() : renderMinifiedAskPage());
}

export default Ask;
