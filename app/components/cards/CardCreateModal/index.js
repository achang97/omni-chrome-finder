import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardSection from '../CardSection';
import CardUsers from '../CardUsers';
import CardTags from '../CardTags';
import CardAttachment from '../CardAttachment';
import CardPermissions from '../CardPermissions';

import Select from '../../common/Select';
import Loader from '../../common/Loader';
import Button from '../../common/Button';
import Modal from '../../common/Modal';

import { MdLock, MdAutorenew } from 'react-icons/md';

import { PERMISSION_OPTIONS_MAP, VERIFICATION_INTERVAL_OPTIONS, CARD_STATUS_OPTIONS, MODAL_TYPE, SEARCH_TYPES } from '../../../utils/constants';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { 
  requestCreateCard,
  closeCardModal,
  addCardOwner, removeCardOwner,
  updateCardTags, removeCardTag,
  updateCardKeywords,
  updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups,
} from '../../../actions/cards';

import style from './card-create-modal.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const CardCreateModal = (props) => {

  const renderOwners = () => {
    const { edits: { owners=[] }, addCardOwner, removeCardOwner } = props;
    return (
      <CardSection title="Owner(s)">
        <CardUsers
          isEditable={true}
          users={owners}
          onAdd={addCardOwner}
          onRemoveClick={removeCardOwner}
          showSelect={true}
        />
      </CardSection>
    );
  }

  const renderTags = () => {
    const { edits: { tags=[] }, updateCardTags, removeCardTag } = props;
    return (
      <CardSection className={s("mt-reg")} title="Tags">
        <CardTags
          isEditable={true}
          tags={tags}
          onChange={updateCardTags}
          onRemoveClick={removeCardTag}
          showPlaceholder={true}
          showSelect={true}
        />
      </CardSection>
    )
  }

  const renderKeywords = () => {
    const { edits: { keywords=[] }, updateCardKeywords } = props;
    return (
      <CardSection
        className={s("mt-reg")}
        title="Keywords"
        startExpanded={false}
        preview={
          <div className={s("card-create-modal-keywords-preview")}>
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
          placeholder={"Add keywords..."}
          type="creatable"
          components={{ DropdownIndicator: null }}
          noOptionsMessage={({ inputValue }) => keywords.some(keyword => keyword.value === inputValue) ?
            "Keyword already exists" : "Begin typing to add a keyword"
          }
        />
      </CardSection>
    );
  }

  const renderAdvanced = () => {
    const { edits: { verificationInterval={}, permissions={}, permissionGroups=[] }, updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups } = props;
    return (
      <CardSection
        className={s("mt-reg")}
        title="Advanced"
        showSeparator={false}
        startExpanded={false}
        preview={
          <div className={s("text-xs text-purple-gray-50 flex")}>
            <MdAutorenew />
            <span className={s("ml-xs")}> {verificationInterval.label} </span>
            <div className={s("vertical-separator mx-reg")} />
            <MdLock />
            <span className={s("ml-xs")}> {permissions.label} </span>
          </div>
        }
      >
        <div>
          <div className={s("text-gray-reg text-xs mb-xs")}> Verification Interval </div>
          <Select
            value={verificationInterval}
            onChange={updateCardVerificationInterval}
            options={VERIFICATION_INTERVAL_OPTIONS}
            placeholder="Select verification interval..."
            isSearchable
            menuShouldScrollIntoView
          />
        </div>
        <div className={s("mt-sm")}>
          <div className={s("text-gray-reg text-xs mb-sm")}> Permissions </div>
          <CardPermissions
            selectedPermission={permissions}
            onChangePermission={updateCardPermissions}
            permissionGroups={permissionGroups}
            onChangePermissionGroups={updateCardPermissionGroups}
          />
        </div>
      </CardSection>
    );
  }

  const render = () => {
    const { modalOpen, requestCreateCard, closeCardModal, createError, isCreatingCard, edits: { question, owners=[], verificationInterval={}, permissions={}, permissionGroups=[] } } = props;
    return (
      <Modal
        isOpen={modalOpen[MODAL_TYPE.CREATE]}
        onRequestClose={() => closeCardModal(MODAL_TYPE.CREATE)}
        title={question}
        overlayClassName={s("rounded-b-lg")}
        bodyClassName={s("rounded-b-lg flex flex-col")}
      >
        <div className={s("flex-grow overflow-auto p-lg")}>
          { renderOwners() }
          { renderTags() }
          { renderKeywords() }
          { renderAdvanced() }
          { createError &&
            <div className={s("error-text my-sm")}> {createError} </div>
          }
        </div>
        <Button
          text="Complete Card"
          onClick={requestCreateCard}
          className={s("flex-shrink-0 rounded-t-none")}
          underline
          underlineColor="purple-gray-50"
          color={"primary"}
          iconLeft={false}
          icon={isCreatingCard ? <Loader className={s("ml-sm")} size="sm" color="white" /> : null}
          disabled={
            owners.length === 0 ||
            !verificationInterval ||
            !permissions ||
            (permissions.value === PERMISSION_OPTIONS_MAP.SPECIFIC_GROUPS && permissionGroups.length === 0) ||
            isCreatingCard      
          }
        />
      </Modal>
    );    
  }

  return render();
}

export default connect(
  state => ({
    ...state.cards.activeCard,
  }),
  dispatch => bindActionCreators({
    requestCreateCard,
    closeCardModal,
    addCardOwner, removeCardOwner,
    updateCardTags, removeCardTag,
    updateCardKeywords,
    updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups
  }, dispatch)
)(CardCreateModal);