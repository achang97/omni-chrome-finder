import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { MdLock } from 'react-icons/md';

import { Modal, Message } from 'components/common';

import { HINTS, MODAL_TYPE } from 'appConstants/card';
import { hasValidEdits, isExistingCard, isJustMe } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';

import CardSection from '../../CardSection';
import CardUsers from '../../CardUsers';
import CardTags from '../../CardTags';
import CardPermissions from '../../CardPermissions';
import CardVerificationInterval from '../../CardVerificationInterval';
import CardLocation from '../../CardLocation';

const s = getStyleApplicationFn();

const CardCreateModal = ({
  _id,
  createError,
  isCreatingCard,
  isUpdatingCard,
  isEditing,
  edits,
  isOpen,
  requestCreateCard,
  requestUpdateCard,
  closeCardModal,
  addCardOwner,
  removeCardOwner,
  addCardSubscriber,
  removeCardSubscriber,
  updateCardTags,
  removeCardTag,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups
}) => {
  const bottomRef = useRef(null);

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

  const renderLocation = () => {
    return <CardLocation finderNode={finderNode} isEditable />;
  };

  const renderOwners = () => {
    return (
      <CardUsers
        isEditable
        users={owners}
        onAdd={addCardOwner}
        onRemoveClick={removeCardOwner}
        showTooltips
        size="xs"
        showNames={false}
      />
    );
  };

  const renderVerificationInterval = () => {
    return (
      <CardVerificationInterval
        verificationInterval={verificationInterval}
        onChange={updateCardVerificationInterval}
        isEditable
      />
    );
  };

  const renderSubscribers = () => {
    return (
      <CardUsers
        isEditable={isEditing}
        users={subscribers.map((subscriber) => ({
          ...subscriber,
          isEditable: !owners.some(({ _id: ownerId }) => ownerId === subscriber._id)
        }))}
        size="xs"
        showNames={false}
        onAdd={addCardSubscriber}
        onRemoveClick={removeCardSubscriber}
        showTooltips
      />
    );
  };

  const renderAdvanced = (isExisting, justMe) => {
    return (
      <>
        <AnimateHeight
          height={justMe ? 0 : 'auto'}
          onAnimationEnd={({ newHeight }) => newHeight !== 0 && scrollToBottom()}
        >
          <div className={s('mb-sm')}>
            <div className={s('text-gray-reg text-xs mb-sm')}> Tags </div>
            <CardTags
              isEditable
              tags={tags}
              onChange={updateCardTags}
              onRemoveClick={removeCardTag}
              showPlaceholder
            />
          </div>
        </AnimateHeight>
        <div>
          <div className={s('text-gray-reg text-xs mb-sm')}> Permissions </div>
          <CardPermissions
            isEditable
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
    const onClick = isExisting ? requestUpdateCard : requestCreateCard;

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
        renderFn: renderOwners
      },
      {
        title: 'Verification Interval',
        startExpanded: true,
        isExpandable: false,
        hint: HINTS.VERIFICATION_INTERVAL,
        renderFn: renderVerificationInterval
      },
      {
        title: 'Subscriber(s)',
        startExpanded: true,
        isExpandable: false,
        hint: HINTS.SUBSCRIBERS,
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
        bodyClassName={s('rounded-b-lg flex flex-col')}
        primaryButtonProps={primaryButtonProps}
      >
        <div className={s('flex-grow overflow-auto px-lg py-reg')}>
          {CARD_SECTIONS.map(
            ({ title, hint, renderFn, showJustMe, startExpanded, isExpandable, preview }, i) => (
              <AnimateHeight height={!justMe || showJustMe ? 'auto' : 0} key={title}>
                <CardSection
                  className={s(i < CARD_SECTIONS.length - 1 ? 'mb-lg' : '')}
                  title={title}
                  hint={hint}
                  isVertical={false}
                  startExpanded={startExpanded}
                  isExpandable={isExpandable}
                  preview={preview}
                  showSeparator={i < CARD_SECTIONS.length - 1}
                >
                  {renderFn(isExisting, justMe)}
                </CardSection>
              </AnimateHeight>
            )
          )}
          <Message className={s('my-sm')} message={createError} type="error" />
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
  isEditing: PropTypes.bool.isRequired,
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

  // Redux Actions
  requestCreateCard: PropTypes.func.isRequired,
  requestUpdateCard: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired,
  addCardOwner: PropTypes.func.isRequired,
  removeCardOwner: PropTypes.func.isRequired,
  addCardSubscriber: PropTypes.func.isRequired,
  removeCardSubscriber: PropTypes.func.isRequired,
  updateCardTags: PropTypes.func.isRequired,
  removeCardTag: PropTypes.func.isRequired,
  updateCardVerificationInterval: PropTypes.func.isRequired,
  updateCardPermissions: PropTypes.func.isRequired,
  updateCardPermissionGroups: PropTypes.func.isRequired
};

export default CardCreateModal;
