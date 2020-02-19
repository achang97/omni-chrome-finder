import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  closeCardSideDock,
  removeCardAttachment,
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

import { getBaseAnimationStyle } from '../../../utils/animateHelpers';
import { PERMISSION_OPTIONS, VERIFICATION_INTERVAL_OPTIONS, FADE_IN_TRANSITIONS, CARD_STATUS_OPTIONS } from '../../../utils/constants';
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

  const renderAttachments = () => {
    const { removeCardAttachment, isEditable } = props; 
    const currAttachments = getAttribute('attachments');

    return (
      <CardSection className={s("mt-lg")} title="Attachments">
        { currAttachments.length === 0 &&
          <div className={s("text-sm text-gray-light")}>
            No current attachments
          </div>
        }
        <div className={s("flex flex-wrap")}>
          { currAttachments.map(({ type, data }, i) => (
            <CardAttachment
              type={type === 'recording' ? 'video' : data.type}
              filename={type === 'recording' ? 'Screen Recording' : data.name}
              className={s("min-w-0")}
              textClassName={s("truncate")}
              onRemoveClick={isEditable ? () => removeCardAttachment(i) : null}
            />
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
          <div className={s("text-gray-reg text-xs mb-xs")}> Verification Interval </div>
          <Select
            value={currVerificationInterval}
            onChange={updateCardVerificationInterval}
            options={VERIFICATION_INTERVAL_OPTIONS}
            placeholder="Select verification interval..."
            isSearchable
            menuShouldScrollIntoView
            isDisabled={!isEditing}
          />
        </div>
        <div>
          <div className={s("text-gray-reg text-xs mb-xs")}> Permissions </div>
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
          underlineColor="red-200"
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

    const isNewCard = cardStatus === CARD_STATUS_OPTIONS.NOT_DOCUMENTED;

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
    addCardOwner, removeCardOwner,
    removeCardAttachment,
    updateCardTags, removeCardTag,
    updateCardKeywords,
    updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups,
  }, dispatch)
)(CardSideDock);