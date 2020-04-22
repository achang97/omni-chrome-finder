import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import AnimateHeight from 'react-animate-height';
import moment from 'moment';
import { MdClose } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

import { CardSection, CardUsers, CardTags, CardAttachments, CardPermissions, CardKeywords, CardVerificationInterval } from 'components/cards';
import { Button, Loader, HelpTooltip } from 'components/common';

import { getBaseAnimationStyle } from 'utils/animate';
import { isJustMe } from 'utils/card';
import { MODAL_TYPE, HINTS, PERMISSION_OPTION, STATUS } from 'appConstants/card';
import { TRANSITIONS } from 'appConstants/animate';

import style from './card-side-dock.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const DATE_FORMAT = 'MMM DD, YYYY';
const SIDE_DOCK_TRANSITION_MS = 200;

const CardSideDock = (props) => {
  const permissionRef = useRef(null);

  const closeSideDock = () => {
    props.closeCardSideDock();
  };

  const getAttribute = (attribute) => {
    const { isEditing, edits } = props;
    return isEditing ? edits[attribute] : props[attribute];
  };

  const renderHeader = () => (
    <div className={s('flex justify-between text-purple-gray-50 mb-sm')}>
      <div className={s('text-xs')}> Card Information </div>
      <button onClick={closeSideDock}>
        <MdClose />
      </button>
    </div>
  );

  const renderOwners = (onlyShowPermissions) => {
    const { isEditing, addCardOwner, removeCardOwner } = props;
    const currOwners = getAttribute('owners');
    return (
      <AnimateHeight height={onlyShowPermissions ? 0 : 'auto'}>
        <CardSection className={s('mt-reg')} title="Owner(s)" hint={HINTS.OWNERS}>
          <CardUsers
            isEditable={isEditing}
            users={currOwners}
            onAdd={addCardOwner}
            onRemoveClick={removeCardOwner}
            showTooltips
          />
        </CardSection>
      </AnimateHeight>
    );
  };

  const renderSubscribers = (onlyShowPermissions) => {
    const { isEditing, addCardSubscriber, removeCardSubscriber } = props;
    const currSubscribers = getAttribute('subscribers');
    const currOwners = getAttribute('owners');
    return (
      <AnimateHeight height={onlyShowPermissions ? 0 : 'auto'}>
        <CardSection className={s('mt-reg')} title="Subscribers(s)" hint={HINTS.SUBSCRIBERS}>
          <CardUsers
            isEditable={isEditing}
            users={currSubscribers.map(subscriber => ({
              ...subscriber,
              isEditable: !currOwners.some(({ _id: ownerId }) => ownerId === subscriber._id)
            }))}
            size="xs"
            showNames={false}
            onAdd={addCardSubscriber}
            onRemoveClick={removeCardSubscriber}
            showTooltips
          />
        </CardSection>
      </AnimateHeight>
    );
  };

  const renderAttachments = () => {
    const { removeCardAttachment, updateCardAttachmentName, isEditing } = props;
    const currAttachments = getAttribute('attachments');

    return (
      <CardSection className={s('mt-lg')} title="Attachments">
        <CardAttachments
          attachments={currAttachments}
          isEditable={isEditing}
          onRemoveClick={removeCardAttachment}
          onFileNameChange={({ name, key }) => updateCardAttachmentName(key, name)}
        />
      </CardSection>
    );
  };

  const renderTags = (onlyShowPermissions) => {
    const { isEditing, updateCardTags, removeCardTag } = props;
    const currTags = getAttribute('tags');

    return (
      <AnimateHeight height={onlyShowPermissions ? 0 : 'auto'}>
        <CardSection className={s('mt-lg')} title="Tags">
          <CardTags
            isEditable={isEditing}
            tags={currTags}
            onChange={updateCardTags}
            onRemoveClick={removeCardTag}
            showPlaceholder
          />
        </CardSection>
      </AnimateHeight>
    );
  };

  const renderKeywords = () => {
    const { isEditing, updateCardKeywords } = props;
    const currKeywords = getAttribute('keywords');
    return (
      <CardSection className={s('mt-lg')} title="Keywords">
        <CardKeywords
          isEditable={isEditing}
          keywords={currKeywords}
          onChange={updateCardKeywords}
        />
      </CardSection>
    );
  };

  const handleHideSections = ({ newHeight }) => {
    if (newHeight !== 0) {
      permissionRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const renderAdvanced = (onlyShowPermissions) => {
    const { isEditing, permissions, updateCardPermissions, updateCardPermissionGroups, updateCardVerificationInterval } = props;
    const currVerificationInterval = getAttribute('verificationInterval');
    const currPermissions = getAttribute('permissions');
    const currPermissionGroups = getAttribute('permissionGroups');

    return (
      <CardSection className={s('mt-lg')} title="Advanced">
        <AnimateHeight
          height={onlyShowPermissions ? 0 : 'auto'}
          onAnimationEnd={handleHideSections}
        >
          <div className={s('mb-sm')}>
            <div className={s('flex items-center text-gray-reg text-xs mb-sm')}>
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
            <CardVerificationInterval
              verificationInterval={currVerificationInterval}
              onChange={updateCardVerificationInterval}
              isEditable={isEditing}
            />
          </div>
        </AnimateHeight>
        <div ref={permissionRef}>
          <div className={s('text-gray-reg text-xs mb-sm')}>
            Permissions
          </div>
          <CardPermissions
            selectedPermission={currPermissions}
            onChangePermission={updateCardPermissions}
            permissionGroups={currPermissionGroups}
            onChangePermissionGroups={updateCardPermissionGroups}
            isDisabled={!isEditing}
            showJustMe={permissions.value === PERMISSION_OPTION.JUST_ME}
          />
        </div>
      </CardSection>
    );
  };

  const renderFooter = () => {
    const { isDeletingCard, openCardModal, createdAt, updatedAt } = props;
    return (
      <div className={s('pt-lg')}>
        <div className={s('text-sm font-medium')}>
          <div className={s('flex justify-between items-center')}>
            <div className={s('text-gray-reg')}> Created on: </div>
            <div className={s('text-purple-gray-50')}> {moment(createdAt).format(DATE_FORMAT)} </div>
          </div>
          <div className={s('flex justify-between items-center mt-sm')}>
            <div className={s('text-gray-reg')}> Last edited: </div>
            <div className={s('text-purple-gray-50')}> {moment(updatedAt).format(DATE_FORMAT)} </div>
          </div>
        </div>
        <Button
          className={s('justify-between mt-lg bg-white text-red-500')}
          text="Delete This Card"
          underline
          onClick={() => openCardModal(MODAL_TYPE.CONFIRM_DELETE)}
          underlineColor="red-200"
          disabled={isDeletingCard}
          icon={<FaRegTrashAlt />}
          iconLeft={false}
        />
      </div>
    );
  };

  const renderOverlay = () => {
    const { sideDockOpen } = props;

    const baseStyle = getBaseAnimationStyle(SIDE_DOCK_TRANSITION_MS);
    return (
      <Transition
        in={sideDockOpen}
        timeout={SIDE_DOCK_TRANSITION_MS}
        mountOnEnter
        unmountOnExit
      >
        {state => (
          <div className={s('card-side-dock-overlay')} style={{ ...baseStyle, ...TRANSITIONS.FADE_IN[state] }} onClick={closeSideDock} />
        )}
      </Transition>
    );
  };

  const render = () => {
    const { sideDockOpen, status, edits } = props;

    const baseStyle = getBaseAnimationStyle(SIDE_DOCK_TRANSITION_MS);
    const transitionStyles = {
      entering: { transform: 'translateX(100%)' },
      entered: { },
      exiting: { transform: 'translateX(100%)' },
      exited: { transform: 'translateX(100%)' },
    };

    const isNewCard = status === STATUS.NOT_DOCUMENTED;
    const onlyShowPermissions = isJustMe(getAttribute('permissions'));

    return (
      <div className={s('card-side-dock-container')}>
        { renderOverlay() }
        <Transition
          in={sideDockOpen}
          timeout={SIDE_DOCK_TRANSITION_MS}
          mountOnEnter
          unmountOnExit
        >
          {state => (
            <div className={s('card-side-dock overflow-auto')} style={{ ...baseStyle, ...transitionStyles[state] }}>
              { renderHeader() }
              { !isNewCard && renderOwners(onlyShowPermissions) }
              { !isNewCard && renderSubscribers(onlyShowPermissions) }
              { renderAttachments() }
              { !isNewCard && renderTags(onlyShowPermissions) }
              { !isNewCard && renderKeywords() }
              { !isNewCard && renderAdvanced(onlyShowPermissions) }
              { !isNewCard && renderFooter() }
            </div>
          )}
        </Transition>
      </div>
    );
  };

  return render();
};

export default CardSideDock;