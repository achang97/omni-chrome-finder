import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { IoMdAlert } from 'react-icons/io';
import { MdClose, MdSettings } from 'react-icons/md';
import ReactDraggable from 'react-draggable';

import {
  CardStatus,
  CardSection,
  CardLocation,
  CardUsers,
  CardVerificationInterval
} from 'components/cards';
import { FinderModal } from 'components/finder';
import { Button, Modal, Message, Loader, CheckBox } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import { usePrevious } from 'utils/react';
import { UserPropTypes } from 'utils/propTypes';
import { INTEGRATIONS } from 'appConstants';
import style from './external-verification.css';

const s = getStyleApplicationFn(style);

function trimTitle(documentTitle) {
  return documentTitle.substring(0, documentTitle.lastIndexOf(' - '));
}

const URL_REGEXES = [
  {
    integration: INTEGRATIONS.GOOGLE,
    regex: /https:\/\/docs\.google\.com\/[^/]+\/d\/[^/]+/,
    getTitle: trimTitle,
    getLinks: (regexMatch) => {
      const link = regexMatch[0];
      const previewLink = `${regexMatch[0]}/preview`;
      return { link, previewLink };
    }
  },
  {
    integration: INTEGRATIONS.CONFLUENCE,
    regex: /https:\/\/\S+.atlassian.net\/wiki\/spaces\/[^/]+\/pages\/\d+/,
    getTitle: (documentTitle) => trimTitle(trimTitle(documentTitle))
  },
  {
    integration: INTEGRATIONS.ZENDESK,
    regex: /https:\/\/\S+\.(zendesk|\S+)\.com\/hc\/\S+\/articles\/\d+/
  },
  {
    integration: INTEGRATIONS.DROPBOX,
    regex: /https:\/\/www\.dropbox\.com\/s\/[^/]+/
  },
  {
    integration: INTEGRATIONS.TETTRA,
    regex: /https:\/\/app\.tettra\.co\/teams\/[^/]+\/pages\/[^/#]+/,
    getTitle: (documentTitle) => trimTitle(trimTitle(documentTitle))
  },
  {
    integration: INTEGRATIONS.NOTION,
    regex: /https:\/\/(?:www\.)?notion\.so\/([^/#]+)[^/#]{32}/,
    getLinks: (regexMatch) => ({ link: regexMatch[0].replace(regexMatch[1], '') })
  }
];

const ExternalVerification = ({
  url,
  isDisplayed,
  activeIntegration,
  isCreateModalOpen,
  isFinderModalOpen,
  isSettingsModalOpen,
  settingIndex,
  owners,
  verificationInterval,
  finderNode,
  externalCard,
  isGettingCard,
  isCreatingCard,
  createCardError,
  user,
  isValidUser,
  isUpdatingUser,
  updateUserError,
  dockVisible,
  updateExternalVerificationInterval,
  addExternalOwner,
  removeExternalOwner,
  toggleExternalCreateModal,
  toggleExternalFinderModal,
  toggleExternalSettingsModal,
  toggleExternalDisplay,
  updateExternalSettingIndex,
  updateExternalIntegration,
  updateExternalFinderNode,
  resetExternalState,
  requestCreateExternalCard,
  requestGetExternalCard,
  requestUpdateUser,
  toggleDock,
  openCard
}) => {
  useEffect(() => {
    const isEnabled = ({ integration: { type }, links: { link } }) => {
      if (!isValidUser) return false;

      const {
        widgetSettings: {
          externalLink: { disabledPages, disabledIntegrations, disabled }
        }
      } = user;

      return !disabled && !disabledIntegrations.includes(type) && !disabledPages.includes(link);
    };

    const resetState = () => {
      if (activeIntegration) {
        resetExternalState();
        updateExternalIntegration(null);
      }

      addExternalOwner(user);
    };

    if (!isValidUser || !url || (activeIntegration && !isEnabled(activeIntegration))) {
      resetState();
    } else {
      let i;
      let newIntegration = null;
      for (i = 0; i < URL_REGEXES.length; i++) {
        const { regex, getTitle, getLinks, integration } = URL_REGEXES[i];
        const match = url.match(regex);
        if (match) {
          const links = getLinks ? getLinks(match) : { link: match[0] };
          if (isEnabled({ integration, links })) {
            newIntegration = { links, getTitle, integration };
            break;
          }
        }
      }

      if (!newIntegration) {
        resetState();
      } else if (!activeIntegration || newIntegration.links.link !== activeIntegration.links.link) {
        updateExternalIntegration(newIntegration);
        requestGetExternalCard();
      }
    }
  }, [
    url,
    user,
    isValidUser,
    activeIntegration,
    updateExternalIntegration,
    addExternalOwner,
    resetExternalState,
    requestGetExternalCard
  ]);

  const prevIsUpdatingUser = usePrevious(isUpdatingUser);
  useEffect(() => {
    if (prevIsUpdatingUser && !isUpdatingUser && !updateUserError && isSettingsModalOpen) {
      toggleExternalSettingsModal();
    }
  }, [
    isUpdatingUser,
    prevIsUpdatingUser,
    updateUserError,
    isSettingsModalOpen,
    toggleExternalSettingsModal,
    toggleExternalDisplay
  ]);

  const renderUntrackedView = () => {
    return (
      <>
        <div className={s('text-xs text-gray-reg mb-xs')}>This knowledge is</div>
        <div className={s('flex mb-sm')}>
          <IoMdAlert className={s('text-purple-reg mr-xs')} />
          <span className={s('text-sm text-gray-dark font-bold')}> Unverified </span>
        </div>
        <Button
          text="Verify with Omni"
          className={s('py-sm')}
          color="transparent"
          onClick={toggleExternalCreateModal}
        />
      </>
    );
  };

  const renderTrackedView = () => {
    const onClick = () => {
      if (!dockVisible) {
        toggleDock();
      }

      openCard({ _id: externalCard._id });
    };

    return (
      <>
        <div className={s('text-xs text-gray-reg mb-xs')}>This knowledge is</div>
        <CardStatus status={externalCard.status} />
        <div
          className={s('text-purple-reg text-xs mt-sm underline-border cursor-pointer')}
          onClick={onClick}
        >
          Manage
        </div>
      </>
    );
  };

  const renderCreateModal = () => {
    const { links, getTitle, integration } = activeIntegration;
    const title = getTitle ? getTitle(document.title) : document.title;
    const externalLinkAnswer = { ...links, type: integration.type };

    const SECTIONS = [
      {
        title: 'Location',
        children: (
          <CardLocation
            finderNode={finderNode}
            isEditable
            onChangeClick={toggleExternalFinderModal}
          />
        )
      },
      {
        title: 'Owner(s)',
        children: (
          <CardUsers
            users={owners}
            onAdd={addExternalOwner}
            onRemoveClick={({ user: removeUser }) => removeExternalOwner(removeUser)}
            size="sm"
            isEditable
          />
        )
      },
      {
        title: 'Verification Interval',
        children: (
          <CardVerificationInterval
            verificationInterval={verificationInterval}
            isEditable
            onChange={updateExternalVerificationInterval}
          />
        )
      }
    ];

    return (
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={toggleExternalCreateModal}
        title={title}
        shouldCloseOnOutsideClick
        important
        className={s('external-verification-modal overflow-visible')}
        bodyClassName={s('px-lg py-reg overflow-visible')}
        primaryButtonProps={{
          text: 'Track',
          disabled: owners.length === 0 || !verificationInterval,
          isLoading: isCreatingCard,
          onClick: () => requestCreateExternalCard(title, externalLinkAnswer)
        }}
      >
        {SECTIONS.map(({ title: sectionTitle, children }, i) => (
          <CardSection
            key={sectionTitle}
            title={sectionTitle}
            isVertical={false}
            isExpandable={false}
            className={s('py-xs')}
            showSeparator={i !== SECTIONS.length - 1}
          >
            {children}
          </CardSection>
        ))}
        <Message type="error" message={createCardError} className={s('my-sm')} />
      </Modal>
    );
  };

  const renderSettingsModal = () => {
    const {
      integration: { type, title },
      links: { link }
    } = activeIntegration;

    const {
      widgetSettings: { externalLink }
    } = user;

    const OPTIONS = [
      {
        label: 'Disable on this document',
        isImportant: false,
        newSettings: {
          ...externalLink,
          disabledPages: _.union(externalLink.disabledPages, [link])
        }
      },
      {
        label: `Disable on all ${title} Documents`,
        isImportant: true,
        newSettings: {
          ...externalLink,
          disabledIntegrations: _.union(externalLink.disabledIntegrations, [type])
        }
      },
      {
        label: 'Disable on all external docs',
        isImportant: true,
        newSettings: { ...externalLink, disabled: true }
      }
    ];

    const onSubmit = () => {
      requestUpdateUser({
        widgetSettings: {
          ...user.widgetSettings,
          externalLink: OPTIONS[settingIndex].newSettings
        }
      });
    };

    return (
      <Modal
        isOpen={isSettingsModalOpen}
        onRequestClose={toggleExternalSettingsModal}
        title="Verify Existing Documents Settings"
        shouldCloseOnOutsideClick
        important
        className={s('external-verification-modal')}
        bodyClassName={s('px-lg py-reg overflow-visible')}
        primaryButtonProps={{
          text: 'Save Settings',
          isLoading: isUpdatingUser,
          onClick: onSubmit
        }}
      >
        {OPTIONS.map(({ label, isImportant }, i) => (
          <div className={s('flex my-reg items-center')} key={label}>
            <CheckBox
              isSelected={i === settingIndex}
              toggleCheckbox={() => updateExternalSettingIndex(i)}
              className={s('flex-shrink-0 mr-reg h-xl w-xl')}
            />
            <div className={s(`${isImportant ? 'text-red-500 italic' : ''}`)}> {label} </div>
          </div>
        ))}
        <Message type="error" message={updateUserError} className={s('my-sm')} />
      </Modal>
    );
  };

  const render = () => {
    if (!isValidUser || !isDisplayed || !activeIntegration) {
      return null;
    }

    return (
      <>
        <ReactDraggable bounds="html">
          <div className={s('external-verification-container')}>
            <div className={s('flex self-stretch text-xs justify-end my-xs')}>
              <MdSettings
                onClick={toggleExternalSettingsModal}
                className={s('cursor-pointer text-gray-reg')}
              />
              <MdClose
                onClick={toggleExternalDisplay}
                className={s('cursor-pointer text-gray-dark')}
              />
            </div>
            {isGettingCard && <Loader size="sm" />}
            {!isGettingCard && (externalCard ? renderTrackedView() : renderUntrackedView())}
          </div>
        </ReactDraggable>
        {renderCreateModal()}
        {renderSettingsModal()}
        <FinderModal
          important
          isOpen={isFinderModalOpen}
          finderId="external-verification"
          onSecondaryClick={toggleExternalFinderModal}
          onPrimaryClick={(destination) => {
            toggleExternalFinderModal();
            updateExternalFinderNode(destination);
          }}
          className={s('external-finder-modal')}
          overlayClassName={s('rounded-lg')}
        />
      </>
    );
  };

  return render();
};

ExternalVerification.propTypes = {
  url: PropTypes.string,

  // Redux State
  isDisplayed: PropTypes.bool.isRequired,
  activeIntegration: PropTypes.shape({
    getTitle: PropTypes.func,
    integration: PropTypes.shape({
      type: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired,
    links: PropTypes.shape({
      link: PropTypes.string.isRequired,
      previewLink: PropTypes.string
    })
  }),
  isCreateModalOpen: PropTypes.bool.isRequired,
  isFinderModalOpen: PropTypes.bool.isRequired,
  settingIndex: PropTypes.number.isRequired,
  owners: PropTypes.arrayOf(PropTypes.object).isRequired,
  verificationInterval: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  }).isRequired,
  externalCard: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    finderNode: PropTypes.object
  }),
  isGettingCard: PropTypes.bool,
  isCreatingCard: PropTypes.bool,
  createCardError: PropTypes.string,
  user: UserPropTypes.isRequired,
  isValidUser: PropTypes.bool.isRequired,
  isUpdatingUser: PropTypes.bool,
  updateUserError: PropTypes.string,
  dockVisible: PropTypes.bool.isRequired,

  // Redux Actions
  updateExternalVerificationInterval: PropTypes.func.isRequired,
  addExternalOwner: PropTypes.func.isRequired,
  removeExternalOwner: PropTypes.func.isRequired,
  toggleExternalCreateModal: PropTypes.func.isRequired,
  toggleExternalFinderModal: PropTypes.func.isRequired,
  toggleExternalSettingsModal: PropTypes.func.isRequired,
  toggleExternalDisplay: PropTypes.func.isRequired,
  updateExternalSettingIndex: PropTypes.func.isRequired,
  updateExternalIntegration: PropTypes.func.isRequired,
  updateExternalFinderNode: PropTypes.func.isRequired,
  resetExternalState: PropTypes.func.isRequired,
  requestCreateExternalCard: PropTypes.func.isRequired,
  requestGetExternalCard: PropTypes.func.isRequired,
  requestUpdateUser: PropTypes.func.isRequired,
  toggleDock: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired
};

export default ExternalVerification;
