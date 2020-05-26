import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { IoMdAlert } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import ReactDraggable from 'react-draggable';

import {
  CardStatus,
  CardSection,
  CardLocation,
  CardUsers,
  CardVerificationInterval
} from 'components/cards';
import { FinderModal } from 'components/finder';
import { Button, Modal, Message, Loader } from 'components/common';

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
    integration: INTEGRATIONS.GOOGLE.type,
    regex: /https:\/\/docs\.google\.com\/[^/]+\/d\/[^/]+/,
    getTitle: trimTitle,
    getLinks: (regexMatch) => {
      const link = regexMatch[0];
      const previewLink = `${regexMatch[0]}/preview`;
      return { link, previewLink };
    }
  },
  {
    integration: INTEGRATIONS.CONFLUENCE.type,
    regex: /https:\/\/\S+.atlassian.net\/wiki\/spaces\/[^/]+\/pages\/\d+/,
    getTitle: (documentTitle) => {
      return trimTitle(trimTitle(documentTitle));
    },
    getLinks: (regexMatch) => {
      return { link: regexMatch[0] };
    }
  }
];

const ExternalVerification = ({
  url,
  isDisplayed,
  activeIntegration,
  isCreateModalOpen,
  isFinderModalOpen,
  owners,
  verificationInterval,
  finderNode,
  externalCard,
  isGettingCard,
  isCreatingCard,
  createCardError,
  user,
  isValidUser,
  dockVisible,
  updateExternalVerificationInterval,
  addExternalOwner,
  removeExternalOwner,
  toggleExternalCreateModal,
  toggleExternalFinderModal,
  toggleExternalDisplay,
  updateExternalIntegration,
  updateExternalFinderNode,
  resetExternalState,
  requestCreateExternalCard,
  requestGetExternalCard,
  toggleDock,
  openCard
}) => {
  const prevUrl = usePrevious(url);
  useEffect(() => {
    if (prevUrl !== url && url) {
      let i;
      let newIntegration = null;
      for (i = 0; i < URL_REGEXES.length; i++) {
        const { regex, getTitle, getLinks, integration } = URL_REGEXES[i];
        const match = url.match(regex);
        if (match) {
          const links = getLinks(match);
          newIntegration = { links, getTitle, integration };
          break;
        }
      }

      // Reset state + parameters
      if (!activeIntegration || activeIntegration.link !== newIntegration.link) {
        resetExternalState();
        updateExternalIntegration(newIntegration);
        addExternalOwner(user);

        if (newIntegration) {
          requestGetExternalCard();
        }
      }
    }
  }, [
    url,
    prevUrl,
    user,
    activeIntegration,
    updateExternalIntegration,
    addExternalOwner,
    resetExternalState,
    requestGetExternalCard
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
    const title = getTitle(document.title);
    const externalLinkAnswer = { ...links, type: integration };

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

  const render = () => {
    if (!isValidUser || !isDisplayed || !activeIntegration) {
      return null;
    }

    return (
      <>
        <ReactDraggable bounds="html">
          <div className={s('external-verification-container')}>
            <MdClose
              onClick={toggleExternalDisplay}
              className={s('ml-auto my-xs cursor-pointer text-xs')}
            />
            {isGettingCard && <Loader size="sm" />}
            {!isGettingCard && (externalCard ? renderTrackedView() : renderUntrackedView())}
          </div>
        </ReactDraggable>
        {renderCreateModal()}
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
    getTitle: PropTypes.func.isRequired,
    integration: PropTypes.string.isRequired,
    links: PropTypes.shape({
      link: PropTypes.string.isRequired,
      previewLink: PropTypes.string
    })
  }),
  isCreateModalOpen: PropTypes.bool.isRequired,
  isFinderModalOpen: PropTypes.bool.isRequired,
  owners: PropTypes.arrayOf(PropTypes.object),
  verificationInterval: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  }),
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
  dockVisible: PropTypes.bool.isRequired,

  // Redux Actions
  updateExternalVerificationInterval: PropTypes.func.isRequired,
  addExternalOwner: PropTypes.func.isRequired,
  removeExternalOwner: PropTypes.func.isRequired,
  toggleExternalCreateModal: PropTypes.func.isRequired,
  toggleExternalFinderModal: PropTypes.func.isRequired,
  toggleExternalDisplay: PropTypes.func.isRequired,
  updateExternalIntegration: PropTypes.func.isRequired,
  updateExternalFinderNode: PropTypes.func.isRequired,
  resetExternalState: PropTypes.func.isRequired,
  requestCreateExternalCard: PropTypes.func.isRequired,
  requestGetExternalCard: PropTypes.func.isRequired,
  toggleDock: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired
};

export default ExternalVerification;
