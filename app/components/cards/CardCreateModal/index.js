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

import { PERMISSION_OPTION, VERIFICATION_INTERVAL_OPTIONS, CARD_STATUS, MODAL_TYPE, SEARCH_TYPE } from '../../../utils/constants';
import { hasValidEdits, isExistingCard } from '../../../utils/card';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  requestCreateCard, requestUpdateCard,
  closeCardModal,
  addCardOwner, removeCardOwner,
  updateCardTags, removeCardTag,
  updateCardKeywords,
  updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups,
} from '../../../actions/cards';

import style from './card-create-modal.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

@connect(
  state => ({
    ...state.cards.activeCard,
  }),
  dispatch => bindActionCreators({
    requestCreateCard,
    requestUpdateCard,
    closeCardModal,
    addCardOwner,
    removeCardOwner,
    updateCardTags,
    removeCardTag,
    updateCardKeywords,
    updateCardVerificationInterval,
    updateCardPermissions,
    updateCardPermissionGroups
  }, dispatch)
)

class CardCreateModal extends Component {
  constructor(props) {
    super(props);

    this.bottomRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createError && this.props.createError) {
      this.bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  renderOwners = () => {
    const { edits: { owners = [] }, addCardOwner, removeCardOwner } = this.props;
    return (
      <CardSection title="Owner(s)">
        <CardUsers
          isEditable
          users={owners}
          onAdd={addCardOwner}
          onRemoveClick={removeCardOwner}
          showSelect
        />
      </CardSection>
    );
  }

  renderTags = () => {
    const { edits: { tags = [] }, updateCardTags, removeCardTag } = this.props;
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

  renderKeywords = () => {
    const { edits: { keywords = [] }, updateCardKeywords } = this.props;
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

  renderAdvanced = () => {
    const { edits: { verificationInterval = {}, permissions = {}, permissionGroups = [] }, updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups } = this.props;
    console.log(VERIFICATION_INTERVAL_OPTIONS[0])
    return (
      <CardSection
        className={s('mt-reg')}
        title="Advanced"
        showSeparator={false}
        startExpanded={false}
        preview={
          <div className={s('text-xs text-purple-gray-50 flex')}>
            <MdAutorenew />
            <span className={s('ml-xs')}> {verificationInterval.label} </span>
            <div className={s('vertical-separator mx-reg')} />
            <MdLock />
            <span className={s('ml-xs')}> {permissions.label} </span>
          </div>
        }
      >
        <div>
          <div className={s('text-gray-reg text-xs mb-xs')}> Verification Interval </div>
          <Select
            value={verificationInterval}
            onChange={updateCardVerificationInterval}
            options={VERIFICATION_INTERVAL_OPTIONS}
            placeholder="Select verification interval..."
            isSearchable
            menuShouldScrollIntoView
          />
        </div>
        <div className={s('mt-sm')}>
          <div className={s('text-gray-reg text-xs mb-sm')}> Permissions </div>
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

  render() {
    const { modalOpen, requestCreateCard, requestUpdateCard, closeCardModal, createError, isCreatingCard, isUpdatingCard, edits, _id } = this.props;

    const isExisting = isExistingCard(_id);
    const isLoading = isExisting ? isUpdatingCard : isCreatingCard;
    const onClick = isExisting ?
      () => requestUpdateCard({ isUndocumented: true }) :
      requestCreateCard;

    return (
      <Modal
        isOpen={modalOpen[MODAL_TYPE.CREATE]}
        onRequestClose={() => closeCardModal(MODAL_TYPE.CREATE)}
        title={edits.question}
        overlayClassName={s('rounded-b-lg')}
        bodyClassName={s('rounded-b-lg flex flex-col')}
      >
        <div className={s('flex-grow overflow-auto p-lg')}>
          { this.renderOwners() }
          { this.renderTags() }
          { this.renderKeywords() }
          { this.renderAdvanced() }
          { createError &&
            <div className={s('error-text my-sm')}> {createError} </div>
          }
          <div ref={this.bottomRef} />
        </div>
        <Button
          text="Complete Card"
          onClick={onClick}
          className={s('flex-shrink-0 rounded-t-none')}
          underline
          underlineColor="purple-gray-50"
          color={'primary'}
          iconLeft={false}
          icon={isLoading ? <Loader className={s('ml-sm')} size="sm" color="white" /> : null}
          disabled={!hasValidEdits(edits) || isLoading}
        />
      </Modal>
    );
  }
}

export default CardCreateModal;
