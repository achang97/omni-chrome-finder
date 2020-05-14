import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { MdLock, MdAutorenew } from 'react-icons/md';

import { Modal, Separator, Message, HelpTooltip } from 'components/common';

import { HINTS, MODAL_TYPE } from 'appConstants/card';
import { hasValidEdits, isExistingCard, isJustMe } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';

import CardSection from '../../CardSection';
import CardUsers from '../../CardUsers';
import CardTags from '../../CardTags';
import CardPermissions from '../../CardPermissions';
import CardVerificationInterval from '../../CardVerificationInterval';

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
    permissionGroups = []
  } = edits;

  const renderOwners = () => {
    return (
      <CardUsers
        isEditable
        users={owners}
        onAdd={addCardOwner}
        onRemoveClick={removeCardOwner}
        showSelect
        showTooltips
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

  const renderTags = () => {
    return (
      <CardTags
        isEditable
        tags={tags}
        onChange={updateCardTags}
        onRemoveClick={removeCardTag}
        showPlaceholder
        showSelect
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
            <div className={s('flex items-center text-gray-reg text-xs mb-xs')}>
              <span> Verification Interval </span>
              <HelpTooltip
                className={s('ml-sm')}
                tooltip={HINTS.VERIFICATION_INTERVAL}
                tooltipProps={{
                  place: 'right'
                }}
              />
            </div>
            <CardVerificationInterval
              verificationInterval={verificationInterval}
              onChange={updateCardVerificationInterval}
              isEditable
            />
          </div>
        </AnimateHeight>
        <div>
          <div className={s('text-gray-reg text-xs mb-sm')}> Permissions </div>
          <CardPermissions
            selectedPermission={permissions}
            onChangePermission={updateCardPermissions}
            permissionGroups={permissionGroups}
            onChangePermissionGroups={updateCardPermissionGroups}
            showJustMe={!isExisting}
          />
        </div>
      </>
    );
  };

  const renderAdvancedPreview = (justMe) => {
    return (
      <div className={s('text-xs text-purple-gray-50 flex')}>
        {!justMe && verificationInterval && (
          <>
            <MdAutorenew />
            <span className={s('ml-xs')}> {verificationInterval.label} </span>
            <Separator className={s('mx-reg')} />
          </>
        )}
        {permissions && (
          <>
            <MdLock />
            <span className={s('ml-xs')}> {permissions.label} </span>
          </>
        )}
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
        title: 'Owner(s)',
        hint: HINTS.OWNERS,
        renderFn: renderOwners
      },
      {
        title: 'Subscriber(s)',
        hint: HINTS.SUBSCRIBERS,
        renderFn: renderSubscribers
      },
      {
        title: 'Tags',
        renderFn: renderTags
      },
      {
        title: 'Advanced',
        startExpanded: false,
        preview: renderAdvancedPreview(justMe),
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
        <div className={s('flex-grow overflow-auto p-lg')}>
          {CARD_SECTIONS.map(
            ({ title, hint, renderFn, showJustMe, startExpanded = true, preview }, i) => (
              <AnimateHeight height={!justMe || showJustMe ? 'auto' : 0} key={title}>
                <CardSection
                  className={s(i < CARD_SECTIONS.length - 1 ? 'mb-lg' : '')}
                  title={title}
                  hint={hint}
                  startExpanded={startExpanded}
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
    permissionGroups: PropTypes.arrayOf(PropTypes.object)
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
