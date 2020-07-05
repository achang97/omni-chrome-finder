import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import AnimateHeight from 'react-animate-height';
import moment from 'moment';
import { MdClose, MdEdit, MdArchive } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

import { Button } from 'components/common';

import { getBaseAnimationStyle } from 'utils/animate';
import { isJustMe } from 'utils/card';
import { MODAL_TYPE, INVITE_TYPE, HINTS, PERMISSION_OPTION, STATUS } from 'appConstants/card';
import { TRANSITIONS } from 'appConstants/animate';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-side-dock.css';

import CardSection from '../../CardSection';
import CardUsers from '../../CardUsers';
import CardTags from '../../CardTags';
import CardAttachments from '../../CardAttachments';
import CardPermissions from '../../CardPermissions';
import CardVerificationInterval from '../../CardVerificationInterval';
import CardLocation from '../../CardLocation';

const s = getStyleApplicationFn(style);

const DATE_FORMAT = 'MMM DD, YYYY';
const SIDE_DOCK_TRANSITION_MS = 200;

const CardSideDock = ({
  hasDeleteAccess,
  isEditing,
  status,
  finderNode,
  owners,
  subscribers,
  attachments,
  tags,
  permissions,
  permissionGroups,
  verificationInterval,
  isDeletingCard,
  createdAt,
  updatedAt,
  sideDockOpen,
  edits,
  closeCardSideDock,
  openCardModal,
  closeCardModal,
  addCardOwner,
  removeCardOwner,
  addCardSubscriber,
  removeCardSubscriber,
  removeCardAttachment,
  updateCardAttachmentName,
  updateCardTags,
  removeCardTag,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups,
  updateInviteType,
  updateInviteEmail,
  editCard
}) => {
  const permissionRef = useRef(null);

  const openInviteModal = (inviteEmail, inviteType) => {
    openCardModal(MODAL_TYPE.INVITE_USER);
    updateInviteType(inviteType);
    updateInviteEmail(inviteEmail);
  };

  const renderHeader = () => {
    return (
      <div className={s('flex justify-between text-purple-gray-50 mb-sm')}>
        <div className={s('text-xs')}> Card Information </div>
        <button onClick={closeCardSideDock} type="button">
          <MdClose />
        </button>
      </div>
    );
  };

  const renderLocation = () => {
    const currFinderNode = isEditing ? edits.finderNode : finderNode;
    const onChangeClick = () => {
      closeCardModal(MODAL_TYPE.CREATE);
      openCardModal(MODAL_TYPE.FINDER);
    };

    return (
      <CardLocation
        finderNode={currFinderNode}
        isEditable={isEditing}
        isPathClickable
        onChangeClick={onChangeClick}
      />
    );
  };

  const renderOwners = () => {
    const currOwners = isEditing ? edits.owners : owners;
    return (
      <CardUsers
        isEditable={isEditing}
        users={currOwners}
        onAdd={addCardOwner}
        onRemoveClick={({ index }) => removeCardOwner(index)}
        onCreate={(value) => openInviteModal(value, INVITE_TYPE.ADD_CARD_OWNER)}
        size="sm"
        showTooltips
        showInviteOptions
      />
    );
  };

  const renderVerificationInterval = () => {
    const currVerificationInterval = isEditing ? edits.verificationInterval : verificationInterval;
    return (
      <CardVerificationInterval
        verificationInterval={currVerificationInterval}
        onChange={updateCardVerificationInterval}
        isEditable={isEditing}
      />
    );
  };

  const renderSubscribers = () => {
    const currSubscribers = isEditing ? edits.subscribers : subscribers;
    const currOwners = isEditing ? edits.owners : owners;
    return (
      <CardUsers
        isEditable={isEditing}
        users={currSubscribers.map((subscriber) => ({
          ...subscriber,
          isEditable: !currOwners.some(({ _id: ownerId }) => ownerId === subscriber._id)
        }))}
        size="xs"
        showNames={false}
        onAdd={addCardSubscriber}
        onRemoveClick={({ index }) => removeCardSubscriber(index)}
        onCreate={(value) => openInviteModal(value, INVITE_TYPE.ADD_CARD_SUBSCRIBER)}
        showTooltips
        showInviteOptions
      />
    );
  };

  const renderAttachments = () => {
    const currAttachments = isEditing ? edits.attachments : attachments;
    return (
      <CardAttachments
        attachments={currAttachments}
        isEditable={isEditing}
        onRemoveClick={removeCardAttachment}
        onFileNameChange={({ name, key }) => updateCardAttachmentName(key, name)}
      />
    );
  };

  const handleHideSections = ({ newHeight }) => {
    if (newHeight !== 0) {
      permissionRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const renderAdvanced = (justMe) => {
    let currTags;
    let currPermissions;
    let currPermissionGroups;

    if (isEditing) {
      currTags = edits.tags;
      currPermissions = edits.permissions;
      currPermissionGroups = edits.permissionGroups;
    } else {
      currTags = tags;
      currPermissions = permissions;
      currPermissionGroups = permissionGroups;
    }

    return (
      <>
        <AnimateHeight height={justMe ? 0 : 'auto'} onAnimationEnd={handleHideSections}>
          <div className={s('mb-reg')}>
            <div className={s('text-gray-reg text-xs mb-sm')}> Tags </div>
            <CardTags
              isEditable={isEditing}
              isCreatable
              showSelect
              tags={currTags}
              onChange={updateCardTags}
              onRemoveClick={({ index }) => removeCardTag(index)}
              showPlaceholder
            />
          </div>
        </AnimateHeight>
        <div ref={permissionRef}>
          <div className={s('text-gray-reg text-xs mb-sm')}>Permissions</div>
          <CardPermissions
            selectedPermissions={currPermissions}
            onChangePermissions={updateCardPermissions}
            permissionGroups={currPermissionGroups}
            onChangePermissionGroups={updateCardPermissionGroups}
            isEditable={isEditing}
            showJustMe={permissions.value === PERMISSION_OPTION.JUST_ME}
          />
        </div>
      </>
    );
  };

  const renderFooter = () => {
    const FOOTER_BUTTONS = [
      {
        text: 'Archive This Card',
        Icon: MdArchive,
        modalType: MODAL_TYPE.CONFIRM_ARCHIVE,
        disabled: isDeletingCard
      },
      {
        text: 'Delete This Card',
        Icon: FaRegTrashAlt,
        modalType: MODAL_TYPE.CONFIRM_DELETE,
        disabled: isDeletingCard
      }
    ];

    return (
      <div className={s('pt-lg')}>
        <div className={s('text-sm font-medium')}>
          <div className={s('flex justify-between items-center')}>
            <div className={s('text-gray-reg')}> Created on: </div>
            <div className={s('text-purple-gray-50')}>{moment(createdAt).format(DATE_FORMAT)}</div>
          </div>
          <div className={s('flex justify-between items-center mt-sm')}>
            <div className={s('text-gray-reg')}> Last edited: </div>
            <div className={s('text-purple-gray-50')}>{moment(updatedAt).format(DATE_FORMAT)}</div>
          </div>
        </div>
        {hasDeleteAccess && (
          <div className={s('mt-lg')}>
            {FOOTER_BUTTONS.map(({ text, Icon, disabled, modalType }) => (
              <Button
                key={text}
                className={s('justify-between mb-sm bg-white text-red-500')}
                text={text}
                underline
                onClick={() => openCardModal(modalType)}
                underlineColor="red-200"
                disabled={disabled}
                icon={<Icon />}
                iconLeft={false}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOverlay = () => {
    const baseStyle = getBaseAnimationStyle(SIDE_DOCK_TRANSITION_MS);
    return (
      <Transition in={sideDockOpen} timeout={SIDE_DOCK_TRANSITION_MS} mountOnEnter unmountOnExit>
        {(state) => (
          <div
            className={s('card-side-dock-overlay')}
            style={{ ...baseStyle, ...TRANSITIONS.FADE_IN[state] }}
            onClick={closeCardSideDock}
          />
        )}
      </Transition>
    );
  };

  const renderEditButton = () => {
    if (isEditing) return null;

    return (
      <button
        onClick={editCard}
        className={s('flex items-center text-purple-gray-50')}
        type="button"
      >
        <span className={s('text-xs mr-xs')}> Edit </span>
        <MdEdit className={s('text-sm self-end')} />
      </button>
    );
  };

  const CARD_SECTIONS = [
    {
      title: 'Location',
      renderFn: renderLocation
    },
    {
      title: 'Owner(s)',
      hint: HINTS.OWNERS,
      renderFn: renderOwners
    },
    {
      title: 'Verification Interval',
      hint: HINTS.VERIFICATION_INTERVAL,
      renderFn: renderVerificationInterval
    },
    {
      title: 'Subscriber(s)',
      hint: HINTS.SUBSCRIBERS,
      renderFn: renderSubscribers
    },
    {
      title: 'Attachments',
      renderFn: renderAttachments,
      showJustMe: true,
      showNewCard: true
    },
    {
      title: 'Advanced',
      renderFn: renderAdvanced,
      showJustMe: true
    }
  ];

  const render = () => {
    const baseStyle = getBaseAnimationStyle(SIDE_DOCK_TRANSITION_MS);
    const transitionStyles = {
      entering: { transform: 'translateX(100%)' },
      entered: {},
      exiting: { transform: 'translateX(100%)' },
      exited: { transform: 'translateX(100%)' }
    };

    const isNewCard = status === STATUS.NOT_DOCUMENTED;
    const justMe = isJustMe(isEditing ? edits.permissions : permissions);

    return (
      <div className={s('card-side-dock-container')}>
        {renderOverlay()}
        <Transition in={sideDockOpen} timeout={SIDE_DOCK_TRANSITION_MS} mountOnEnter unmountOnExit>
          {(state) => (
            <div
              className={s('card-side-dock overflow-auto')}
              style={{ ...baseStyle, ...transitionStyles[state] }}
            >
              {renderHeader()}
              {CARD_SECTIONS.map(
                ({ title, hint, renderFn, showJustMe, showNewCard = false }, i) => (
                  <AnimateHeight
                    key={title}
                    height={(!justMe || showJustMe) && (!isNewCard || showNewCard) ? 'auto' : 0}
                  >
                    <CardSection
                      className={s(i < CARD_SECTIONS.length - 1 ? 'mb-lg' : '')}
                      title={title}
                      hint={hint}
                      headerEnd={renderEditButton()}
                    >
                      {renderFn(justMe)}
                    </CardSection>
                  </AnimateHeight>
                )
              )}
              {!isNewCard && renderFooter()}
            </div>
          )}
        </Transition>
      </div>
    );
  };

  return render();
};

CardSideDock.propTypes = {
  hasDeleteAccess: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(Object.values(STATUS)).isRequired,
  path: PropTypes.arrayOf(PropTypes.object),
  owners: PropTypes.arrayOf(PropTypes.object).isRequired,
  subscribers: PropTypes.arrayOf(PropTypes.object).isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  permissions: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired,
  permissionGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  verificationInterval: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  }).isRequired,
  isDeletingCard: PropTypes.bool,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  sideDockOpen: PropTypes.bool.isRequired,
  edits: PropTypes.shape({
    path: PropTypes.arrayOf(PropTypes.object),
    owners: PropTypes.arrayOf(PropTypes.object),
    subscribers: PropTypes.arrayOf(PropTypes.object),
    attachments: PropTypes.arrayOf(PropTypes.object),
    tags: PropTypes.arrayOf(PropTypes.object),
    permissions: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }),
    permissionGroups: PropTypes.arrayOf(PropTypes.object),
    verificationInterval: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  }).isRequired,

  // Redux Actions
  addCardOwner: PropTypes.func.isRequired,
  removeCardOwner: PropTypes.func.isRequired,
  addCardSubscriber: PropTypes.func.isRequired,
  removeCardSubscriber: PropTypes.func.isRequired,
  removeCardAttachment: PropTypes.func.isRequired,
  updateCardAttachmentName: PropTypes.func.isRequired,
  updateCardTags: PropTypes.func.isRequired,
  removeCardTag: PropTypes.func.isRequired,
  updateCardPermissions: PropTypes.func.isRequired,
  updateCardPermissionGroups: PropTypes.func.isRequired,
  updateCardVerificationInterval: PropTypes.func.isRequired,
  openCardModal: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired,
  closeCardSideDock: PropTypes.func.isRequired,
  updateInviteType: PropTypes.func.isRequired,
  updateInviteEmail: PropTypes.func.isRequired,
  editCard: PropTypes.func.isRequired
};

CardSideDock.defaultProps = {
  isDeletingCard: false
};

export default CardSideDock;
