import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import AnimateHeight from 'react-animate-height';
import moment from 'moment';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  closeCardSideDock,
  openCardModal,
  removeCardAttachment, updateCardAttachmentName,
  addCardOwner, removeCardOwner,
  updateCardTags, removeCardTag,
  updateCardKeywords,
  updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups,
} from '../../../actions/cards';

import { MdClose } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

import CardSection from '../CardSection';
import CardUsers from '../CardUsers';
import CardTags from '../CardTags';
import CardAttachment from '../CardAttachment';
import CardPermissions from '../CardPermissions';

import Select from '../../common/Select';
import Button from '../../common/Button';
import Loader from '../../common/Loader';
import VideoPlayer from '../../common/VideoPlayer';

import { isUploadedFile } from '../../../utils/file';

import { getBaseAnimationStyle } from '../../../utils/animate';
import { MODAL_TYPE, PERMISSION_OPTION, PERMISSION_OPTIONS, VERIFICATION_INTERVAL_OPTIONS, FADE_IN_TRANSITIONS, CARD_STATUS } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/select';
import { isJustMe } from '../../../utils/card';

import style from './card-side-dock.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const SELECT_PERMISSION_OPTIONS = createSelectOptions(PERMISSION_OPTIONS);
const DATE_FORMAT = 'MMM DD, YYYY';
const SIDE_DOCK_TRANSITION_MS = 300;

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
        <CardSection className={s('mt-reg')} title="Owner(s)">
          <CardUsers
            isEditable={isEditing}
            users={currOwners}
            onAdd={addCardOwner}
            onRemoveClick={removeCardOwner}
          />
        </CardSection>
      </AnimateHeight>
    );
  };

  const splitAttachments = (attachments) => {
    const { isEditing } = props;

    if (isEditing) {
      return { fileAttachments: attachments, screenRecordings: [] };
    }
    const fileAttachments = [];
    const screenRecordings = [];

    attachments.forEach((attachment) => {
      if (attachment.name.endsWith('.webm')) {
        screenRecordings.push(attachment);
      } else {
        fileAttachments.push(attachment);
      }
    });

    return { fileAttachments, screenRecordings };
  };

  const renderAttachments = () => {
    const { removeCardAttachment, updateCardAttachmentName, isEditing } = props;
    const currAttachments = getAttribute('attachments');

    const { fileAttachments, screenRecordings } = splitAttachments(currAttachments);

    return (
      <CardSection className={s('mt-lg')} title="Attachments">
        { currAttachments.length === 0 &&
          <div className={s('text-sm text-gray-light')}>
            No current attachments
          </div>
        }
        <div className={s('flex flex-wrap')}>
          { fileAttachments.map(({ name, mimetype, key, location, isLoading, error }, i) => (
            <CardAttachment
              key={key}
              type={mimetype}
              fileName={name}
              url={location}
              isLoading={isLoading}
              error={error}
              className={s('min-w-0')}
              textClassName={s('truncate')}
              isEditable={isEditing}
              onFileNameChange={fileName => updateCardAttachmentName(i, fileName)}
              onRemoveClick={() => removeCardAttachment(i)}
            />
          ))}
        </div>
        { fileAttachments.length !== 0 && screenRecordings.length !== 0 &&
          <div className={s('my-sm text-sm text-gray-light')}> Screen Recordings </div>
        }
        <div className={s('flex flex-wrap')}>
          { screenRecordings.map(({ name, key, location, isLoading, error }) => (
            <div className={s('card-side-dock-video-wrapper')} key={key}>
              <VideoPlayer
                url={location}
                className={s('w-full')}
              />
              <div className={s('truncate text-xs mt-xs')}> {name} </div>
            </div>
          ))}
        </div>
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
        { isEditing ?
          <Select
            value={currKeywords}
            onChange={updateCardKeywords}
            isSearchable
            isMulti
            menuShouldScrollIntoView
            isClearable={false}
            placeholder={'Add keywords...'}
            type="creatable"
            components={{ DropdownIndicator: null }}
            noOptionsMessage={({ inputValue }) => currKeywords.some(keyword => keyword.value === inputValue) ?
              'Keyword already exists' : 'Begin typing to add a keyword'
            }
          /> :
              <div>
                { currKeywords.length === 0 &&
                <div className={s('text-sm text-gray-light')}>
                No current keywords
              </div>
            }
                <div className={s('flex flex-wrap')}>
                  { currKeywords.map(({ label, value }, i) => (
                    <div key={value} className={s('text-sm mr-sm mb-sm truncate text-purple-reg underline-border border-purple-gray-10')}>
                      {value}{i !== currKeywords.length - 1 && ','}
                    </div>
              ))}
                </div>
              </div>
        }

      </CardSection>
    );
  };

  const handleHideSections = (newHeight) => {
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
          onAnimationEnd={newHeight => handleHideSections(newHeight)}
        >
          <div className={s('mb-sm')}>
            <div className={s('text-gray-reg text-xs mb-sm')}> Verification Interval </div>
            { isEditing ?
              <Select
                value={currVerificationInterval}
                onChange={updateCardVerificationInterval}
                options={VERIFICATION_INTERVAL_OPTIONS}
                placeholder="Select verification interval..."
                isSearchable
                menuShouldScrollIntoView
              /> :
              <div className={s('underline-border border-purple-gray-20 mb-sm text-purple-reg text-sm inline-block')}>
                {currVerificationInterval.label}
              </div>
            }
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
          <div className={s('card-side-dock-overlay')} style={{ ...baseStyle, ...FADE_IN_TRANSITIONS[state] }} onClick={closeSideDock} />
        )}
      </Transition>
    );
  };

  const render = () => {
    const { sideDockOpen, status, edits } = props;

    const baseStyle = getBaseAnimationStyle(SIDE_DOCK_TRANSITION_MS);
    const transitionStyles = {
      entering: { transform: 'translateX(0%)' },
      entered: { transform: 'translateX(0%)' },
      exiting: { transform: 'translateX(100%)' },
      exited: { transform: 'translateX(100%)' },
    };

    const isNewCard = status === CARD_STATUS.NOT_DOCUMENTED;
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

export default connect(
  state => ({
    ...state.cards.activeCard,
  }),
  dispatch => bindActionCreators({
    closeCardSideDock,
    openCardModal,
    addCardOwner,
    removeCardOwner,
    removeCardAttachment,
    updateCardAttachmentName,
    updateCardTags,
    removeCardTag,
    updateCardKeywords,
    updateCardVerificationInterval,
    updateCardPermissions,
    updateCardPermissionGroups,
  }, dispatch)
)(CardSideDock);
