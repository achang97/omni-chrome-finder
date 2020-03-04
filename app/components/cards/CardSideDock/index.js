import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

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

import { isUploadedFile } from '../../../utils/fileHelpers';

import { getBaseAnimationStyle } from '../../../utils/animateHelpers';
import { MODAL_TYPE, PERMISSION_OPTIONS, VERIFICATION_INTERVAL_OPTIONS, FADE_IN_TRANSITIONS, CARD_STATUS } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/selectHelpers';

import style from './card-side-dock.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const SELECT_PERMISSION_OPTIONS = createSelectOptions(PERMISSION_OPTIONS);

const SIDE_DOCK_TRANSITION_MS = 300;

const CardSideDock = (props) => {
  const closeSideDock = () => {
    props.closeCardSideDock();
  }

  const getAttribute = (attribute) => {
    const { isEditing, edits } = props;
    return isEditing ? edits[attribute] : props[attribute];
  }

  const renderHeader = () => (
    <div className={s("flex justify-between text-purple-gray-50 mb-sm")}>
      <div className={s("text-xs")}> Card Information </div>
      <button onClick={closeSideDock}>
        <MdClose />
      </button>
    </div>
  );

  const renderOwners = () => {
    const { isEditing, addCardOwner, removeCardOwner } = props;
    const currOwners = getAttribute('owners');
    return (
      <CardSection className={s("mt-reg")} title="Owner(s)">
        <CardUsers
          isEditable={isEditing}
          users={currOwners}
          onAdd={addCardOwner}
          onRemoveClick={removeCardOwner}
        />
      </CardSection>
    );
  }

  const splitAttachments = (attachments) => {
    const { isEditing } = props;

    if (isEditing) {
      return { fileAttachments: attachments, screenRecordings: [] };
    } else {
      const fileAttachments = [];
      const screenRecordings = [];

      attachments.forEach(attachment => {
        if (attachment.name.endsWith('.webm')) {
          screenRecordings.push(attachment);
        } else {
          fileAttachments.push(attachment);
        }
      });

      return { fileAttachments, screenRecordings };
    }
  }

  const renderAttachments = () => {
    const { removeCardAttachment, updateCardAttachmentName, isEditing } = props; 
    const currAttachments = getAttribute('attachments');

    const { fileAttachments, screenRecordings } = splitAttachments(currAttachments);

    return (
      <CardSection className={s("mt-lg")} title="Attachments">
        { currAttachments.length === 0 &&
          <div className={s("text-sm text-gray-light")}>
            No current attachments
          </div>
        }
        <div className={s("flex flex-wrap")}>
          { fileAttachments.map(({ name, key, location, isLoading, error }, i) => (
            <div key={key}>
              <CardAttachment
                fileName={name}
                url={location}
                isLoading={isLoading}
                error={error}
                className={s("min-w-0")}
                textClassName={s("truncate")}
                isEditable={isEditing}
                onFileNameChange={(fileName) => updateCardAttachmentName(i, fileName)}
                onRemoveClick={() => removeCardAttachment(i)}
              />
            </div>
          ))}
        </div>
        { fileAttachments.length !== 0 && screenRecordings.length !== 0 &&
          <div className={s("my-sm text-sm text-gray-light")}> Screen Recordings </div>
        }
        <div className={s("flex flex-wrap")}>
          { screenRecordings.map(({ name, key, location, isLoading, error }) => (
            <div className={s("card-side-dock-video-wrapper")} key={key}>
              <VideoPlayer
                url={location}
                className={s("w-full")}
              />
              <div className={s("truncate text-xs mt-xs")}> {name} </div>
            </div>
          ))}
        </div>
      </CardSection>
    );
  }

  const renderTags = () => {
    const { isEditing, updateCardTags, removeCardTag } = props;
    const currTags = getAttribute('tags');

    return (
      <CardSection className={s("mt-lg")} title="Tags">
        <CardTags
          isEditable={isEditing}
          tags={currTags}
          onChange={updateCardTags}
          onRemoveClick={removeCardTag}
          showPlaceholder={true}
        />
      </CardSection>
    )
  }

  const renderKeywords = () => {
    const { isEditing, updateCardKeywords } = props;
    const currKeywords = getAttribute('keywords');
    return (
      <CardSection className={s("mt-lg")} title="Keywords">
        { isEditing ?
          <Select
            value={currKeywords}
            onChange={updateCardKeywords}
            isSearchable
            isMulti
            menuShouldScrollIntoView
            isClearable={false}
            placeholder={"Add keywords..."}
            type="creatable"
            components={{ DropdownIndicator: null }}
            noOptionsMessage={({ inputValue }) => currKeywords.some(keyword => keyword.value === inputValue) ?
              "Keyword already exists" : "Begin typing to add a keyword"
            }
          /> :
          <div>
            { currKeywords.length === 0 &&
              <div className={s("text-sm text-gray-light")}>
                No current keywords
              </div>
            }
            <div className={s("flex flex-wrap")}>
              { currKeywords.map(({ label, value }, i) => (
                <div key={value} className={s("text-sm mr-sm mb-sm truncate text-purple-reg underline-border border-purple-gray-10")}>
                  {value}{i !== currKeywords.length - 1 && ','}
                </div>
              ))}
            </div>
          </div>
        }

      </CardSection>
    );
  }

  const renderAdvanced = () => {
    const { isEditing, updateCardPermissions, updateCardPermissionGroups, updateCardVerificationInterval } = props;
    const currVerificationInterval = getAttribute('verificationInterval');
    const currPermissions = getAttribute('permissions');
    const currPermissionGroups = getAttribute('permissionGroups');

    return (
      <CardSection className={s("mt-lg")} title="Advanced">
        <div className={s("mb-sm")}>
          <div className={s("text-gray-reg text-xs mb-sm")}> Verification Interval </div>
          { isEditing ?
            <Select
              value={currVerificationInterval}
              onChange={updateCardVerificationInterval}
              options={VERIFICATION_INTERVAL_OPTIONS}
              placeholder="Select verification interval..."
              isSearchable
              menuShouldScrollIntoView
            /> :
            <div className={s("underline-border border-purple-gray-20 mb-sm text-purple-reg text-sm inline-block")}>
              {currVerificationInterval.label}
            </div>
          }
        </div>
        <div>
          <div className={s("text-gray-reg text-xs mb-sm")}> Permissions </div>
          <CardPermissions
            selectedPermission={currPermissions}
            onChangePermission={updateCardPermissions}
            permissionGroups={currPermissionGroups}
            onChangePermissionGroups={updateCardPermissionGroups}
            isDisabled={!isEditing}
          />
        </div>
      </CardSection>
    );
  }

  const renderFooter = () => {
    const { isDeletingCard, openCardModal } = props;
    return (
      <div className={s("pt-lg")}>
        <div className={s("text-sm font-medium")}>
          <div className={s("flex justify-between items-center")}>
            <div className={s("text-gray-reg")}> Created on: </div>
            <div className={s("text-purple-gray-50")}> Jan 13, 2020 </div>
          </div>
          <div className={s("flex justify-between items-center mt-sm")}>
            <div className={s("text-gray-reg")}> Last edited: </div>
            <div className={s("text-purple-gray-50")}> Jan 16, 2020 </div>
          </div>
        </div>
        <Button
          className={s("justify-between mt-lg bg-white text-red-500")}
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
  }

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
          <div className={s("card-side-dock-overlay")} style={{ ...baseStyle, ...FADE_IN_TRANSITIONS[state] }} onClick={closeSideDock} />
        )}
      </Transition>
    );
  }

  const render = () => {
    const { sideDockOpen, cardStatus } = props;

    const baseStyle = getBaseAnimationStyle(SIDE_DOCK_TRANSITION_MS);
    const transitionStyles = {
      entering: { transform: 'translateX(0%)' },
      entered:  { transform: 'translateX(0%)' },
      exiting:  { transform: 'translateX(100%)' },
      exited:  { transform: 'translateX(100%)' },
    }

    const isNewCard = cardStatus === CARD_STATUS.NOT_DOCUMENTED;

    return (
      <div className={s("card-side-dock-container")}>
        { renderOverlay() }
        <Transition
          in={sideDockOpen}
          timeout={SIDE_DOCK_TRANSITION_MS}
          mountOnEnter
          unmountOnExit
        >
          {state => (
            <div className={s("card-side-dock overflow-auto")} style={{ ...baseStyle, ...transitionStyles[state] }}>
              { renderHeader() }
              { !isNewCard && renderOwners() }
              { renderAttachments() }
              { !isNewCard && renderTags() }
              { !isNewCard && renderKeywords() }
              { !isNewCard && renderAdvanced() }
              { !isNewCard && renderFooter() }
            </div>
          )}
        </Transition>
      </div>
    );
  }

  return render();
}

export default connect(
  state => ({
    ...state.cards.activeCard,
  }),
  dispatch => bindActionCreators({
    closeCardSideDock,
    openCardModal,
    addCardOwner, removeCardOwner,
    removeCardAttachment, updateCardAttachmentName,
    updateCardTags, removeCardTag,
    updateCardKeywords,
    updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups,
  }, dispatch)
)(CardSideDock);