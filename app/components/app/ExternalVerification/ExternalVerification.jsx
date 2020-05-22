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
import { Button, Modal, Message, Loader } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import { usePrevious } from 'utils/react';
import { UserPropTypes } from 'utils/propTypes';
import { INTEGRATIONS } from 'appConstants';
import style from './external-verification.css';

const s = getStyleApplicationFn(style);

const URL_REGEXES = [
  {
    integration: INTEGRATIONS.GOOGLE.type,
    regex: /https:\/\/docs\.google\.com\/[^/]+\/d\/([^/]+)/,
    getTitle: (documentTitle) => documentTitle.substring(0, documentTitle.lastIndexOf(' - ')),
    getLinks: (regexMatch) => {
      const link = regexMatch[0];
      const previewLink = `${regexMatch[0]}/preview`;
      return { link, previewLink };
    }
  }
];

const ExternalVerification = ({
  url,
  isDisplayed,
  activeIntegration,
  isModalOpen,
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
  toggleExternalModal,
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
          const title = getTitle(document.title);
          newIntegration = { links, title, integration };
          break;
        }
      }

      // Reset state + parameters
      resetExternalState();
      updateExternalIntegration(newIntegration);
      addExternalOwner(user);

      if (newIntegration) {
        requestGetExternalCard(newIntegration.links.link);
      }
    }
  }, [
    url,
    prevUrl,
    user,
    updateExternalIntegration,
    addExternalOwner,
    resetExternalState,
    requestGetExternalCard
  ]);

  const renderUntrackedView = () => {
    return (
      <>
        <div className={s('flex mb-sm')}>
          <IoMdAlert className={s('text-purple-reg mr-xs')} />
          <span className={s('text-sm font-bold')}> Unverified </span>
        </div>
        <Button
          text="Verify with Omni"
          className={s('py-sm')}
          color="transparent"
          onClick={toggleExternalModal}
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
    const { title, links, integration } = activeIntegration;
    const externalLinkAnswer = { ...links, type: integration };

    const SECTIONS = [
      {
        title: 'Location',
        children: (
          <CardLocation
            finderNode={finderNode}
            isEditable
            onChangeClick={updateExternalFinderNode}
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
        isOpen={isModalOpen}
        onRequestClose={toggleExternalModal}
        title={title}
        shouldCloseOnOutsideClick
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
      </>
    );
  };

  return render();
};

ExternalVerification.propTypes = {
  url: PropTypes.string.isRequired,

  // Redux State
  isDisplayed: PropTypes.bool.isRequired,
  activeIntegration: PropTypes.shape({
    title: PropTypes.string.isRequired,
    integration: PropTypes.string.isRequired,
    links: PropTypes.shape({
      link: PropTypes.string.isRequired,
      previewLink: PropTypes.string.isRequired
    })
  }),
  isModalOpen: PropTypes.bool.isRequired,
  owners: PropTypes.arrayOf(PropTypes.object),
  verificationInterval: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }),
  externalCard: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    finderNode: PropTypes.object.isRequired
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
  toggleExternalModal: PropTypes.func.isRequired,
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
