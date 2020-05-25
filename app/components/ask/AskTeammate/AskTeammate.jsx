import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MdClose } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { FaPaperPlane } from 'react-icons/fa';
import {
  Button,
  Loader,
  CircleButton,
  Separator,
  Tabs,
  Tab,
  Select,
  Dropdown,
  BackButton
} from 'components/common';
import { ScreenRecordButton, AttachmentDropdown, AttachmentDropzone } from 'components/attachments';
import IntegrationAuthButton from 'components/profile/IntegrationAuthButton';

import { colors } from 'styles/colors';
import { generateFileKey, isAnyLoading } from 'utils/file';
import { UserPropTypes } from 'utils/propTypes';
import { isLoggedIn } from 'utils/auth';
import { ROUTES, INTEGRATIONS, ASK } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import style from './ask-teammate.css';

import RecipientDropdownBody from '../RecipientDropdownBody';

const s = getStyleApplicationFn(style);

const AskTeammate = ({
  user,
  changeAskIntegration,
  activeIntegration,
  requestAddAskAttachment,
  requestRemoveAskAttachment,
  attachments,
  updateAskAttachmentName,
  requestAskQuestion,
  isAskingQuestion,
  questionTitle,
  updateAskQuestionTitle,
  recipients,
  removeAskRecipient,
  updateAskRecipient,
  addAskRecipient,
  slackConversations,
  requestGetSlackConversations,
  toggleAskTeammate,
  history
}) => {
  const [authWindow, setAuthWindow] = useState(null);

  const isLoggedInSlack = isLoggedIn(user, INTEGRATIONS.SLACK.type);
  useEffect(() => {
    if (isLoggedInSlack) {
      requestGetSlackConversations();

      // Duplicate logic here in case IntegrationAuthButton dismounts before being able to
      // automatically log out
      if (authWindow) {
        authWindow.close();
        setAuthWindow(null);
      }
    }
  }, [isLoggedInSlack]);

  const renderTabHeader = () => {
    return (
      <div className={s('flex flex-row items-center mb-lg')}>
        <BackButton className={s('mr-sm')} onClick={toggleAskTeammate} />
        <Tabs
          activeValue={activeIntegration}
          tabClassName={s('text-sm font-normal rounded-full py-sm px-reg')}
          inactiveTabClassName={s('text-purple-reg')}
          activeTabClassName={s('primary-gradient text-white font-semibold')}
          onTabClick={changeAskIntegration}
          showRipple={false}
        >
          {ASK.INTEGRATIONS.map((integration) => (
            <Tab key={integration.type} value={integration}>
              <div
                className={s(
                  integration !== activeIntegration
                    ? 'underline-border border-purple-gray-20'
                    : 'primary-underline'
                )}
              >
                {integration.title}
              </div>
            </Tab>
          ))}
        </Tabs>
        <CircleButton
          content={<IoMdAdd color={colors.purple.reg} />}
          size="md"
          className={s('ml-auto')}
          buttonClassName={s('bg-purple-light')}
          onClick={() => history.push(ROUTES.PROFILE)}
        />
      </div>
    );
  };

  const addAskAttachments = (files) => {
    files.forEach((file) => {
      requestAddAskAttachment(generateFileKey(), file);
    });
  };

  const renderAskInputs = () => {
    return (
      <div>
        <div className={s('flex-col relative')}>
          <textarea
            placeholder="Question"
            onChange={(e) => updateAskQuestionTitle(e.target.value)}
            value={questionTitle}
            autoFocus
            className={s('w-full mb-reg')}
          />
        </div>
        <div className={s('flex px-xs pt-reg')}>
          <ScreenRecordButton
            id="ask"
            onSuccess={({ recording }) => addAskAttachments([recording])}
          />
          <AttachmentDropzone className={s('mx-xs')} onDrop={addAskAttachments} />
          <AttachmentDropdown
            attachments={attachments}
            onFileNameChange={({ key, fileName }) => updateAskAttachmentName(key, fileName)}
            onRemoveClick={(key) => requestRemoveAskAttachment(key)}
          />
        </div>
      </div>
    );
  };

  const renderIndividualRecipient = (individual, index) => {
    const { id, name } = individual;
    return (
      <div key={id} className={s('bg-white ask-recipient')}>
        <span className={s('truncate')}> @ {name} </span>
        <button onClick={() => removeAskRecipient(index)} type="button">
          <MdClose className={s('text-purple-gray-50 ml-xs')} />
        </button>
      </div>
    );
  };

  const renderChannelRecipient = (channel, index) => {
    const { id, name, mentions, members, isDropdownOpen, isDropdownSelectOpen } = channel;
    return (
      <div
        key={id}
        className={s(
          `bg-purple-gray-10 ask-recipient ${
            isDropdownOpen || isDropdownSelectOpen ? 'rounded-t-none' : ''
          }`
        )}
      >
        <span className={s('truncate')}> # {name} </span>
        <Dropdown
          isOpen={isDropdownOpen}
          onToggle={(dropdownOpen) => updateAskRecipient(index, { isDropdownOpen: dropdownOpen })}
          isDown={false}
          isTogglerRelative={false}
          toggler={
            <div className={s('ask-recipient-mentions-count button-hover')}>{mentions.length}</div>
          }
          body={
            <div className={s('ask-recipient-dropdown')}>
              {mentions.length === 0 ? (
                <div className={s('text-center text-purple-reg font-normal')}>
                  No current mentions
                </div>
              ) : (
                <div className={s('overflow-auto px-reg text-purple-reg')}>
                  {mentions.map((mention) => (
                    <div key={mention.id} className={s('flex justify-between items-center py-xs')}>
                      <div className={s('min-w-0 truncate font-semibold')}> @{mention.name} </div>
                      <button
                        onClick={() =>
                          updateAskRecipient(index, { mentions: _.without(mentions, mention) })
                        }
                        type="button"
                      >
                        <MdClose className={s('text-purple-reg')} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
        />
        <Separator className={s('bg-purple-gray-50')} />
        <Dropdown
          isOpen={isDropdownSelectOpen}
          onToggle={(dropdownOpen) =>
            updateAskRecipient(index, { isDropdownSelectOpen: dropdownOpen })
          }
          isDown={false}
          isTogglerRelative={false}
          toggler={
            <button type="button">
              <IoMdAdd className={s('text-purple-reg mr-xs')} />
            </button>
          }
          body={
            <div className={s('ask-recipient-dropdown')}>
              <RecipientDropdownBody
                mentions={mentions}
                mentionOptions={members}
                onAddMention={(newMention) =>
                  updateAskRecipient(index, { mentions: _.union(mentions, [newMention]) })
                }
              />
            </div>
          }
        />
        <button onClick={() => removeAskRecipient(index)} type="button">
          <MdClose className={s('text-purple-reg')} />
        </button>
      </div>
    );
  };

  const renderRecipientSelection = () => {
    return (
      <div className={s('bg-purple-light flex-1 flex flex-col p-lg')}>
        <div className={s('text-purple-reg text-xs mb-reg')}>Send to channel/person</div>
        <Select
          value={null}
          onChange={addAskRecipient}
          placeholder="Enter name"
          options={_.differenceBy(slackConversations, recipients, 'id')}
          getOptionLabel={(option) =>
            `${option.type === ASK.SLACK_RECIPIENT_TYPE.CHANNEL ? '#' : '@'}${option.name}`
          }
          getOptionValue={(option) => option.id}
          isSearchable
          menuShouldScrollIntoView
        />
        {recipients.length === 0 && (
          <div className={s('text-gray-light text-sm my-reg text-center')}>
            No current recipients
          </div>
        )}
        <div className={s('my-xs flex flex-wrap content-start')}>
          {recipients.map(({ type, ...rest }, i) =>
            type === ASK.SLACK_RECIPIENT_TYPE.CHANNEL
              ? renderChannelRecipient(rest, i)
              : renderIndividualRecipient(rest, i)
          )}
        </div>
      </div>
    );
  };

  const renderFooterButton = () => {
    return (
      <Button
        className={s(
          'self-stretch justify-between rounded-t-none rounded-br-none rounded-bl-reg text-reg'
        )}
        color="primary"
        text="Ask Question"
        disabled={
          questionTitle === '' ||
          recipients.length === 0 ||
          isAnyLoading(attachments) ||
          isAskingQuestion
        }
        iconLeft={false}
        icon={
          isAskingQuestion ? (
            <Loader className={s('h-3xl w-3xl')} color="white" />
          ) : (
            <span
              className={s(
                'rounded-full h-3xl w-3xl flex justify-center items-center bg-white text-purple-reg'
              )}
            >
              <FaPaperPlane />
            </span>
          )
        }
        onClick={requestAskQuestion}
      />
    );
  };

  const renderDisabledView = () => {
    const { title, logo, disabled } = activeIntegration;

    return (
      <div className={s('flex flex-col items-center')}>
        <div className={s('large-icon-container my-reg')}>
          <img src={logo} className={s('w-full h-full')} alt={title} />
        </div>
        <div className={s('mt-reg mb-lg font-semibold')}>
          {disabled
            ? `Our ${title} integration is coming soon!`
            : `You aren't logged into ${title}`}
        </div>
        {!disabled && (
          <IntegrationAuthButton
            integration={activeIntegration}
            onWindowOpen={setAuthWindow}
            className={s('py-sm')}
          />
        )}
      </div>
    );
  };

  const render = () => {
    const loggedIn = isLoggedIn(user, activeIntegration.type);
    const isDisabled = activeIntegration.disabled;

    return (
      <div className={s('flex flex-col flex-1 min-h-0 relative')}>
        <div className={s('flex flex-col flex-1 overflow-y-auto')}>
          <div className={s('p-lg bg-white')}>
            {renderTabHeader()}
            {!loggedIn || isDisabled ? renderDisabledView() : renderAskInputs()}
          </div>
          {loggedIn && !isDisabled && renderRecipientSelection()}
        </div>
        {loggedIn && !isDisabled && renderFooterButton()}
      </div>
    );
  };

  return render();
};

AskTeammate.propTypes = {
  activeIntegration: PropTypes.oneOf(ASK.INTEGRATIONS).isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  isAskingQuestion: PropTypes.bool,
  questionTitle: PropTypes.string.isRequired,
  recipients: PropTypes.arrayOf(PropTypes.object).isRequired,
  slackConversations: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: UserPropTypes.isRequired,

  // Redux Actions
  toggleAskTeammate: PropTypes.func.isRequired,
  changeAskIntegration: PropTypes.func.isRequired,
  requestAddAskAttachment: PropTypes.func.isRequired,
  requestRemoveAskAttachment: PropTypes.func.isRequired,
  updateAskAttachmentName: PropTypes.func.isRequired,
  requestAskQuestion: PropTypes.func.isRequired,
  updateAskQuestionTitle: PropTypes.func.isRequired,
  removeAskRecipient: PropTypes.func.isRequired,
  updateAskRecipient: PropTypes.func.isRequired,
  addAskRecipient: PropTypes.func.isRequired,
  requestGetSlackConversations: PropTypes.func.isRequired
};

AskTeammate.defaultProps = {
  isAskingQuestion: false
};

export default AskTeammate;
