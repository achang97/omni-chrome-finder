import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardSection from '../CardSection';
import CardUsers from '../CardUsers';
import CardTags from '../CardTags';
import CardAttachment from '../CardAttachment';
import CardPermissions from '../CardPermissions';

import Select from '../../common/Select';
import Button from '../../common/Button';
import Modal from '../../common/Modal';

import { MdLock, MdAutorenew } from 'react-icons/md';

import { PERMISSION_OPTIONS, VERIFICATION_INTERVAL_OPTIONS, CARD_STATUS_OPTIONS, MODAL_TYPE, SEARCH_TYPES } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/selectHelpers';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { 
  saveCard, updateCardStatus, closeCardModal,
  addCardOwner, removeCardOwner,
  updateCardTags, removeCardTag,
  updateCardKeywords,
  updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups,
} from '../../../actions/cards';

import style from './card-create-modal.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const SELECT_PERMISSION_OPTIONS = createSelectOptions(PERMISSION_OPTIONS);

const CardCreateModal = (props) => {

  const renderOwners = () => {
    const { edits: { owners }, addCardOwner, removeCardOwner } = props;
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
    const { edits: { tags }, updateCardTags, removeCardTag } = props;
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
    const { edits: { keywords }, updateCardKeywords } = props;
    return (
      <CardSection
        className={s("mt-reg")}
        title="Keywords"
        startExpanded={false}
        preview={
          <div className={s("card-create-modal-keywords-preview")}>
            { keywords.map(({ label }, i) => (
              <div className={i !== keywords.length - 1 ? s('mr-xs') : ''}> {label}{i !== keywords.length - 1 && ','} </div>
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
    const { edits: { verificationInterval, permissions, permissionGroups }, updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups } = props;
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
        <div className={s("flex")}>
          <div className={s("flex-1 mr-xs")}>
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
          <div className={s("flex-1 ml-xs")}>
            <div className={s("text-gray-reg text-xs mb-xs")}> Permissions </div>
            <CardPermissions
              selectedPermission={permissions}
              onChangePermission={updateCardPermissions}
              permissionGroups={permissionGroups}
              onChangePermissionGroups={updateCardPermissionGroups}
            />
          </div>
        </div>
      </CardSection>
    );
  }

  const completeCard = () => {
    const { saveCard, updateCardStatus, closeCardModal } = props;
    saveCard();
    updateCardStatus(CARD_STATUS_OPTIONS.UP_TO_DATE);
    closeCardModal(MODAL_TYPE.CREATE);
  }

  const render = () => {
    const { modalOpen, closeCardModal, edits: { question, owners, verificationInterval, permissions, permissionGroups } } = props;
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
        </div>
        <Button
          text="Complete Card"
          onClick={() => completeCard()}
          className={s("flex-shrink-0 rounded-t-none")}
          underline
          underlineColor="purple-gray-50"
          color={"primary"}
          disabled={
            owners.length === 0 ||
            !verificationInterval ||
            !permissions ||
            (permissions.value === PERMISSION_OPTIONS[2] && permissionGroups.length === 0)          
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
    saveCard, updateCardStatus, closeCardModal,
    addCardOwner, removeCardOwner,
    updateCardTags, removeCardTag,
    updateCardKeywords,
    updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups
  }, dispatch)
)(CardCreateModal);