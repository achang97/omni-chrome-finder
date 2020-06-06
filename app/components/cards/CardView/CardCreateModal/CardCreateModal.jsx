import React, { useRef, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { MdLock } from 'react-icons/md';

import { Modal, Message } from 'components/common';

import { HINTS, MODAL_TYPE } from 'appConstants/card';
import { SEEN_FEATURES } from 'appConstants/profile';
import { hasValidEdits, isExistingCard, isJustMe } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';

import style from './card-create-modal.css';

import CardWalkthroughHelper from '../CardWalkthroughHelper';
import CardSection from '../../CardSection';
import CardUsers from '../../CardUsers';
import CardTags from '../../CardTags';
import CardPermissions from '../../CardPermissions';
import CardVerificationInterval from '../../CardVerificationInterval';
import CardLocation from '../../CardLocation';

const s = getStyleApplicationFn(style);

const WALKTHROUGH_PROPS = {
  [SEEN_FEATURES.OWNERS]: {
    title: 'Card Properties: Owners',
    subtitle:
      'Each card must have one or more owners. They are responsible for keeping this knowledge up to date.'
  },
  [SEEN_FEATURES.SUBSCRIBERS]: {
    title: 'Card Properties: Subscribers',
    subtitle:
      "Subscribers 'follow' along a card and receive notifications when the card content changes. Add team members you think would find this card useful."
  },
  [SEEN_FEATURES.UPDATE_INTERVAL]: {
    title: 'Card Properties: Verification Interval',
    subtitle:
      'This is how often we’ll send a notification to remind the owner(s) to verify that this card is up to date.'
  }
};

const CardCreateModal = ({
  _id,
  createError,
  isCreatingCard,
  isUpdatingCard,
  edits,
  isOpen,
  seenFeatures,
  requestCreateCard,
  requestUpdateCard,
  openCardModal,
  closeCardModal,
  addCardOwner,
  removeCardOwner,
  addCardSubscriber,
  removeCardSubscriber,
  updateCardTags,
  removeCardTag,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups,
  requestUpdateUser
}) => {
  const bottomRef = useRef(null);
  const [walkthroughRef, setWalkthroughRef] = useState(null);

  const getCurrentWalkthroughKey = () => {
    const FEATURES = [
      SEEN_FEATURES.OWNERS,
      SEEN_FEATURES.UPDATE_INTERVAL,
      SEEN_FEATURES.SUBSCRIBERS
    ];

    return FEATURES.find((feature) => !seenFeatures[feature]);
  };

  const currWalkthroughKey = getCurrentWalkthroughKey();

  const setRef = useCallback(
    (ref, featureKey) => {
      if (featureKey && featureKey === currWalkthroughKey) {
        setWalkthroughRef(ref);
      }
    },
    [currWalkthroughKey]
  );

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    if (createError) {
      scrollToBottom();
    }
  }, [createError]);

  const {
    owners = [],
    subscribers = [],
    tags = [],
    verificationInterval,
    permissions,
    permissionGroups = [],
    finderNode = {}
  } = edits;

  const renderLocation = (isEditable) => {
    const onChangeClick = () => {
      closeCardModal(MODAL_TYPE.CREATE);
      openCardModal(MODAL_TYPE.FINDER);
    };

    return (
      <CardLocation
        finderNode={finderNode}
        isEditable={isEditable}
        isPathClickable
        onChangeClick={onChangeClick}
      />
    );
  };

  const renderOwners = (isEditable) => {
    return (
      <CardUsers
        isEditable={isEditable}
        users={owners}
        onAdd={addCardOwner}
        onRemoveClick={({ index }) => removeCardOwner(index)}
        showTooltips
        size="xs"
        showNames={false}
      />
    );
  };

  const renderVerificationInterval = (isEditable) => {
    return (
      <CardVerificationInterval
        verificationInterval={verificationInterval}
        onChange={updateCardVerificationInterval}
        isEditable={isEditable}
      />
    );
  };

  const renderSubscribers = (isEditable) => {
    return (
      <CardUsers
        isEditable={isEditable}
        users={subscribers.map((subscriber) => ({
          ...subscriber,
          isEditable: !owners.some(({ _id: ownerId }) => ownerId === subscriber._id)
        }))}
        size="xs"
        showNames={false}
        onAdd={addCardSubscriber}
        onRemoveClick={({ index }) => removeCardSubscriber(index)}
        showTooltips
      />
    );
  };

  const renderAdvanced = (isEditable, isExisting, justMe) => {
    return (
      <>
        <AnimateHeight
          height={justMe ? 0 : 'auto'}
          onAnimationEnd={({ newHeight }) => newHeight !== 0 && scrollToBottom()}
        >
          <div className={s('mb-sm')}>
            <div className={s('text-gray-reg text-xs mb-sm')}> Tags </div>
            <CardTags
              isEditable={isEditable}
              tags={tags}
              onChange={updateCardTags}
              onRemoveClick={({ index }) => removeCardTag(index)}
              showPlaceholder
            />
          </div>
        </AnimateHeight>
        <div>
          <div className={s('text-gray-reg text-xs mb-sm')}> Permissions </div>
          <CardPermissions
            isEditable={isEditable}
            selectedPermissions={permissions}
            onChangePermissions={updateCardPermissions}
            permissionGroups={permissionGroups}
            onChangePermissionGroups={updateCardPermissionGroups}
            showJustMe={!isExisting}
          />
        </div>
      </>
    );
  };

  const renderAdvancedPreview = () => {
    if (!permissions) {
      return null;
    }

    return (
      <div className={s('text-xs text-purple-gray-50 flex')}>
        <MdLock />
        <span className={s('ml-xs')}> {permissions.label} </span>
      </div>
    );
  };

  const render = () => {
    const isExisting = isExistingCard(_id);
    const isLoading = isExisting ? isUpdatingCard : isCreatingCard;
    const onClick = isExisting ? () => requestUpdateCard(false) : requestCreateCard;

    const justMe = isJustMe(edits.permissions);

    const CARD_SECTIONS = [
      {
        title: 'Location',
        startExpanded: true,
        isExpandable: false,
        renderFn: renderLocation,
        showJustMe: true
      },
      {
        title: 'Owner(s)',
        startExpanded: true,
        isExpandable: false,
        hint: HINTS.OWNERS,
        featureKey: SEEN_FEATURES.OWNERS,
        renderFn: renderOwners
      },
      {
        title: 'Verification Interval',
        startExpanded: true,
        isExpandable: false,
        hint: HINTS.VERIFICATION_INTERVAL,
        featureKey: SEEN_FEATURES.UPDATE_INTERVAL,
        renderFn: renderVerificationInterval
      },
      {
        title: 'Subscriber(s)',
        startExpanded: true,
        isExpandable: false,
        hint: HINTS.SUBSCRIBERS,
        featureKey: SEEN_FEATURES.SUBSCRIBERS,
        renderFn: renderSubscribers
      },
      {
        title: 'Advanced',
        startExpanded: false,
        isExpandable: true,
        preview: renderAdvancedPreview(),
        renderFn: renderAdvanced,
        showJustMe: true
      }
    ];

    const primaryButtonProps = {
      text: 'Complete Card',
      onClick,
      isLoading,
      disabled: !hasValidEdits(edits)
    };

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={() => closeCardModal(MODAL_TYPE.CREATE)}
        title={edits.question}
        overlayClassName={s('rounded-b-lg')}
        bodyClassName={s('flex flex-col')}
        primaryButtonProps={primaryButtonProps}
      >
        <div className={s('flex-grow overflow-auto')}>
          {CARD_SECTIONS.map(
            (
              {
                title,
                hint,
                renderFn,
                showJustMe,
                startExpanded,
                isExpandable,
                preview,
                featureKey
              },
              i
            ) => (
              <AnimateHeight height={!justMe || showJustMe ? 'auto' : 0} key={title}>
                <div
                  ref={(ref) => setRef(ref, featureKey)}
                  className={s(`
                    relative px-lg pt-lg
                    ${
                      currWalkthroughKey && featureKey === currWalkthroughKey ? 'bg-white z-10' : ''
                    }
                  `)}
                >
                  <CardSection
                    title={title}
                    hint={hint}
                    isVertical={false}
                    startExpanded={startExpanded}
                    isExpandable={isExpandable}
                    preview={preview}
                    showSeparator={i < CARD_SECTIONS.length - 1}
                  >
                    {renderFn(
                      !currWalkthroughKey || featureKey === currWalkthroughKey,
                      isExisting,
                      justMe
                    )}
                  </CardSection>
                </div>
              </AnimateHeight>
            )
          )}
          <Message className={s('my-sm')} message={createError} type="error" />
          {currWalkthroughKey && <div className={s('card-walkthrough-overlay')} />}
          {currWalkthroughKey && (
            <CardWalkthroughHelper
              {...WALKTHROUGH_PROPS[currWalkthroughKey]}
              ref={walkthroughRef}
              onNextClick={() =>
                requestUpdateUser({ seenFeatures: { ...seenFeatures, [currWalkthroughKey]: true } })
              }
            />
          )}
          <div ref={bottomRef} />
        </div>
      </Modal>
    );
  };

  return render();
};

CardCreateModal.propTypes = {
  // Redux State
  _id: PropTypes.string.isRequired,
  createError: PropTypes.string,
  isCreatingCard: PropTypes.bool,
  isUpdatingCard: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  edits: PropTypes.shape({
    owners: PropTypes.arrayOf(PropTypes.object),
    subscribers: PropTypes.arrayOf(PropTypes.object),
    tags: PropTypes.arrayOf(PropTypes.object),
    verificationInterval: PropTypes.object,
    permissions: PropTypes.object,
    permissionGroups: PropTypes.arrayOf(PropTypes.object),
    finderNode: PropTypes.object
  }),
  seenFeatures: PropTypes.objectOf(PropTypes.bool).isRequired,

  // Redux Actions
  requestCreateCard: PropTypes.func.isRequired,
  requestUpdateCard: PropTypes.func.isRequired,
  openCardModal: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired,
  addCardOwner: PropTypes.func.isRequired,
  removeCardOwner: PropTypes.func.isRequired,
  addCardSubscriber: PropTypes.func.isRequired,
  removeCardSubscriber: PropTypes.func.isRequired,
  updateCardTags: PropTypes.func.isRequired,
  removeCardTag: PropTypes.func.isRequired,
  updateCardVerificationInterval: PropTypes.func.isRequired,
  updateCardPermissions: PropTypes.func.isRequired,
  updateCardPermissionGroups: PropTypes.func.isRequired,
  requestUpdateUser: PropTypes.func.isRequired
};

export default CardCreateModal;
