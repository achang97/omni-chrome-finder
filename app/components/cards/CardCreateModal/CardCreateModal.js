import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { MdLock, MdAutorenew } from 'react-icons/md';

import { CardSection, CardUsers, CardTags, CardAttachment, CardPermissions } from 'components/cards';
import { Select, Loader, Button, Modal, Separator, Message, HelpTooltip } from 'components/common';

import { HINTS, PERMISSION_OPTION, VERIFICATION_INTERVAL_OPTIONS, MODAL_TYPE } from 'appConstants/card';
import { hasValidEdits, isExistingCard, isJustMe } from 'utils/card';

import style from './card-create-modal.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const CardCreateModal = (props) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (props.createError) {
      scrollToBottom();
    }
  }, [props.createError])

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  const renderOwners = () => {
    const { edits: { owners = [] }, addCardOwner, removeCardOwner } = props;
    return (
      <CardSection title="Owner(s)" hint={HINTS.OWNERS}>
        <CardUsers
          isEditable
          users={owners}
          onAdd={addCardOwner}
          onRemoveClick={removeCardOwner}
          showSelect
          showTooltips
        />
      </CardSection>
    );
  }

  const renderSubscribers = (onlyShowPermissions) => {
    const { edits: { subscribers=[], owners=[] }, isEditing, addCardSubscriber, removeCardSubscriber } = props;
    return (
      <CardSection className={s('mt-reg')} title="Subscribers(s)" hint={HINTS.SUBSCRIBERS}>
        <CardUsers
          isEditable={isEditing}
          users={subscribers.map(subscriber => ({
            ...subscriber,
            isEditable: !owners.some(({ _id: ownerId }) => ownerId === subscriber._id)
          }))}
          size="xs"
          showNames={false}
          onAdd={addCardSubscriber}
          onRemoveClick={removeCardSubscriber}
          showTooltips
        />
      </CardSection>
    );
  };

  const renderTags = () => {
    const { edits: { tags = [] }, updateCardTags, removeCardTag } = props;
    return (
      <CardSection className={s('mt-reg')} title="Tags">
        <CardTags
          isEditable
          tags={tags}
          onChange={updateCardTags}
          onRemoveClick={removeCardTag}
          showPlaceholder
          showSelect
        />
      </CardSection>
    );
  }

  const renderKeywords = () => {
    const { edits: { keywords = [] }, updateCardKeywords } = props;
    return (
      <CardSection
        className={s('mt-reg')}
        title="Keywords"
        startExpanded={false}
        preview={
          <div className={s('card-create-modal-keywords-preview')}>
            { keywords.map(({ label, value }, i) => (
              <div key={value} className={i !== keywords.length - 1 ? s('mr-xs') : ''}>
                {label}{i !== keywords.length - 1 && ','}
              </div>
            ))}
          </div>
        }
      >
        <Select
          value={keywords}
          onChange={updateCardKeywords}
          isSearchable
          isMulti
          menuShouldScrollIntoView
          isClearable={false}
          placeholder={'Add keywords...'}
          type="creatable"
          components={{ DropdownIndicator: null }}
          noOptionsMessage={({ inputValue }) => keywords.some(keyword => keyword.value === inputValue) ?
            'Keyword already exists' : 'Begin typing to add a keyword'
          }
        />
      </CardSection>
    );
  }

  const renderAdvanced = (isExisting, onlyShowPermissions) => {
    const { edits: { verificationInterval = {}, permissions = {}, permissionGroups = [] }, updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups } = props;
    return (
      <CardSection
        className={s('mt-reg')}
        title="Advanced"
        showSeparator={false}
        startExpanded={false}
        preview={
          <div className={s('text-xs text-purple-gray-50 flex')}>
            { !onlyShowPermissions &&
              <React.Fragment>
                <MdAutorenew />
                <span className={s('ml-xs')}> {verificationInterval.label} </span>
                <Separator className={s('mx-reg')} />
              </React.Fragment>
            }
            <MdLock />
            <span className={s('ml-xs')}> {permissions.label} </span>
          </div>
        }
      >
        <AnimateHeight
          height={onlyShowPermissions ? 0 : 'auto'}
          onAnimationEnd={({ newHeight }) => newHeight !== 0 && scrollToBottom()}
        >
          <div>
            <div className={s('flex items-center text-gray-reg text-xs mb-xs')}>
              <span> Verification Interval </span>
              <HelpTooltip
                className={s('ml-sm')} 
                id={'tooltip-side-dock-interval'}
                text={HINTS.VERIFICATION_INTERVAL}
                tooltipProps={{
                  place: 'right'  
                }}
              />
            </div>
            <Select
              value={verificationInterval}
              onChange={updateCardVerificationInterval}
              options={VERIFICATION_INTERVAL_OPTIONS}
              placeholder="Select verification interval..."
              isSearchable
              menuShouldScrollIntoView
            />
          </div>
        </AnimateHeight>
        <div className={s('mt-sm')}>
          <div className={s('text-gray-reg text-xs mb-sm')}> Permissions </div>
          <CardPermissions
            selectedPermission={permissions}
            onChangePermission={updateCardPermissions}
            permissionGroups={permissionGroups}
            onChangePermissionGroups={updateCardPermissionGroups}
            showJustMe={!isExisting}
          />
        </div>
      </CardSection>
    );
  }

  const { modalOpen, requestCreateCard, requestUpdateCard, closeCardModal, createError, isCreatingCard, isUpdatingCard, edits, _id } = props;
  const isExisting = isExistingCard(_id);
  const isLoading = isExisting ? isUpdatingCard : isCreatingCard;
  const onClick = isExisting ? requestUpdateCard : requestCreateCard;

  const onlyShowPermissions = isJustMe(edits.permissions);
  const primaryButtonProps = {
    text: 'Complete Card',
    onClick: onClick,  
    iconLeft: false,
    icon: isLoading ? <Loader className={s('ml-sm')} size="sm" color="white" /> : null,
    disabled: !hasValidEdits(edits) || isLoading
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
        <AnimateHeight height={onlyShowPermissions ? 0 : 'auto'}>
          { renderOwners() }
          { renderSubscribers() }
          { renderTags() }
        </AnimateHeight>
        { renderKeywords() }
        { renderAdvanced(isExisting, onlyShowPermissions) }
        <Message className={s('my-sm')} message={createError} type="error" />
        <div ref={bottomRef} />
      </div>
    </Modal>
  );
}

export default CardCreateModal;
