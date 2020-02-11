import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardSection from '../CardSection';
import CardUsers from '../CardUsers';
import CardTags from '../CardTags';
import CardAttachment from '../CardAttachment';

import Select from '../../common/Select';
import Button from '../../common/Button';
import Modal from '../../common/Modal';

import { PERMISSION_OPTIONS, VERIFICATION_INTERVAL_OPTIONS, CARD_STATUS_OPTIONS, MODAL_TYPE } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/selectHelpers';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { 
  saveCard, updateCardStatus, closeCardModal,
  addCardOwner, removeCardOwner,
  updateCardTags, removeCardTag,
  updateCardKeywords,
  updateCardVerificationInterval, updateCardPermissions,
} from '../../../actions/cards';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const SELECT_PERMISSION_OPTIONS = createSelectOptions(PERMISSION_OPTIONS);
const SELECT_VERIFICATION_INTERVAL_OPTIONS = createSelectOptions(VERIFICATION_INTERVAL_OPTIONS);

@connect(
  state => ({
    ...state.cards.activeCard,
  }),
  dispatch => bindActionCreators({
    saveCard, updateCardStatus, closeCardModal,
    addCardOwner, removeCardOwner,
    updateCardTags, removeCardTag,
    updateCardKeywords,
    updateCardVerificationInterval, updateCardPermissions,
  }, dispatch)
)

class CardCreateModal extends Component {
  constructor(props) {
    super(props);
  }

  renderOwners = () => {
    const { edits: { owners }, addCardOwner, removeCardOwner } = this.props;
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

  renderTags = () => {
    const { edits: { tags }, updateCardTags, removeCardTag } = this.props;
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

  renderKeywords = () => {
    const { edits: { keywords }, updateCardKeywords } = this.props;
    return (
      <CardSection className={s("mt-reg")} title="Keywords" startExpanded={false}>
        <Select
          value={keywords}
          onChange={updateCardKeywords}
          isSearchable
          isMulti
          menuShouldScrollIntoView
          isClearable={false}
          placeholder={"Add keywords..."}
          creatable={true}
          components={{ DropdownIndicator: null }}
          noOptionsMessage={({ inputValue }) => keywords.some(keyword => keyword.value === inputValue) ?
            "Keyword already exists" : "Begin typing to add a keyword"
          }
        />
      </CardSection>
    );
  }

  renderAdvanced = () => {
    const { edits: { verificationInterval, permissions }, updateCardVerificationInterval, updateCardPermissions } = this.props;
    return (
      <CardSection className={s("mt-reg")} title="Advanced" showSeparator={false} startExpanded={false}>
        <div className={s("flex")}>
          <div className={s("flex-1 mr-xs")}>
            <div className={s("text-gray-reg text-xs mb-xs")}> Verification Interval </div>
            <Select
              value={verificationInterval}
              onChange={updateCardVerificationInterval}
              options={SELECT_VERIFICATION_INTERVAL_OPTIONS}
              placeholder="Select verification interval..."
              isSearchable
              menuShouldScrollIntoView
            />
          </div>
          <div className={s("flex-1 ml-xs")}>
            <div className={s("text-gray-reg text-xs mb-xs")}> Permissions </div>
            <Select
              value={permissions}
              onChange={updateCardPermissions}
              placeholder="Select permissions..."
              options={SELECT_PERMISSION_OPTIONS}
              isSearchable
              menuShouldScrollIntoView
            />
          </div>
        </div>
      </CardSection>
    );
  }

  completeCard = () => {
    const { saveCard, updateCardStatus, closeCardModal } = this.props;
    saveCard();
    updateCardStatus(CARD_STATUS_OPTIONS.UP_TO_DATE);
    closeCardModal(MODAL_TYPE.CREATE);
  }

  render() {
    const { modalOpen, closeCardModal, edits: { question } } = this.props;

    return (
      <Modal
        isOpen={modalOpen[MODAL_TYPE.CREATE]}
        onRequestClose={() => closeCardModal(MODAL_TYPE.CREATE)}
        title={question}
        overlayClassName={s("rounded-b-lg")}
        bodyClassName={s("rounded-b-lg flex flex-col")}
      >
        <div className={s("flex-grow overflow-auto p-lg")}>
          { this.renderOwners() }
          { this.renderTags() }
          { this.renderKeywords() }
          { this.renderAdvanced() }
        </div>
        <Button
          text="Complete Card"
          onClick={() => this.completeCard()}
          className={s("flex-shrink-0 rounded-t-none")}
          underline
          underlineColor="purple-gray-50"
          color={"primary"}
        />
      </Modal>
    );
  }
}

export default CardCreateModal;