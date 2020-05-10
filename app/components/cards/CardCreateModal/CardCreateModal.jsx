import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { MdLock, MdAutorenew } from 'react-icons/md';

import {
  CardSection,
  CardUsers,
  CardTags,
  CardAttachment,
  CardPermissions,
  CardVerificationInterval
} from 'components/cards';
import { Loader, Button, Modal, Separator, Message, HelpTooltip } from 'components/common';

import { HINTS, PERMISSION_OPTION, MODAL_TYPE } from 'appConstants/card';
import { hasValidEdits, isExistingCard, isJustMe } from 'utils/card';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const CardCreateModal = (props) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (props.createError) {
      scrollToBottom();
    }
  }, [props.createError]);

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const renderOwners = () => {
    const {
      edits: { owners = [] },
      addCardOwner,
      removeCardOwner
    } = props;
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
    const {
      edits: { subscribers = [], owners = [] },
      isEditing,
      addCardSubscriber,
      removeCardSubscriber
    } = props;
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
    const {
      edits: { tags = [] },
      updateCardTags,
      removeCardTag
    } = props;
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

  const renderAdvanced = ({ isExisting, justMe }) => {
    const {
      edits: { verificationInterval = {}, permissions = {}, permissionGroups = [] },
      updateCardVerificationInterval,
      updateCardPermissions,
      updateCardPermissionGroups
    } = props;
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
    const {
      edits: { verificationInterval = {}, permissions = {} }
    } = props;
    return (
      <div className={s('text-xs text-purple-gray-50 flex')}>
        {!justMe && (
          <>
            <MdAutorenew />
            <span className={s('ml-xs')}> {verificationInterval.label} </span>
            <Separator className={s('mx-reg')} />
          </>
        )}
        <MdLock />
        <span className={s('ml-xs')}> {permissions.label} </span>
      </div>
    );
  };

  const render = () => {
    const {
      modalOpen,
      requestCreateCard,
      requestUpdateCard,
      closeCardModal,
      createError,
      isCreatingCard,
      isUpdatingCard,
      edits,
      _id
    } = props;
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
        isOpen={modalOpen[MODAL_TYPE.CREATE]}
        onRequestClose={() => closeCardModal(MODAL_TYPE.CREATE)}
        title={edits.question}
        overlayClassName={s('rounded-b-lg')}
        bodyClassName={s('rounded-b-lg flex flex-col')}
        primaryButtonProps={primaryButtonProps}
      >
        <div className={s('flex-grow overflow-auto p-lg')}>
          {CARD_SECTIONS.map(
            ({ title, hint, renderFn, showJustMe, startExpanded = true, preview }, i) => (
              <AnimateHeight height={!justMe || showJustMe ? 'auto' : 0}>
                <CardSection
                  className={s(i < CARD_SECTIONS.length - 1 ? 'mb-lg' : '')}
                  title={title}
                  hint={hint}
                  startExpanded={startExpanded}
                  preview={preview}
                  showSeparator={i < CARD_SECTIONS.length - 1}
                >
                  {renderFn({ isExisting, justMe })}
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

export default CardCreateModal;
