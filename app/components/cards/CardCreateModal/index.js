import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardSection from '../CardSection';
import CardUsers from '../CardUsers';
import CardTags from '../CardTags';
import CardAttachment from '../CardAttachment';

import Select from '../../common/Select';
import Button from '../../common/Button';
import Modal from '../../common/Modal';

import { PERMISSION_OPTIONS, VERIFICATION_INTERVAL_OPTIONS } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/selectHelpers';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const SELECT_PERMISSION_OPTIONS = createSelectOptions(PERMISSION_OPTIONS);
const SELECT_VERIFICATION_INTERVAL_OPTIONS = createSelectOptions(VERIFICATION_INTERVAL_OPTIONS);

class CardCreateModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: [],
      verificationInterval: null,
      permission: null,
    }
  }

  renderOwners = () => {
    const users = [{ name: 'Andrew', id: 1, img: 'https://sunrift.com/wp-content/uploads/2014/12/Blake-profile-photo-square-768x769.jpg' }, { name: 'Chetan', id: 5, img: null }];
    return (
      <CardSection title="Owner(s)">
        <CardUsers
          users={users}
          onAddClick={() => console.log('User added!')}
          onClick={() => console.log('User clicked!')}
          onRemoveClick={() => console.log('User removed!')}
        />
      </CardSection>
    );
  }

  renderTags = () => {
    const tags = ['Customer Service Onboarding', 'Sales', 'Pitches'];
    return (
      <CardSection className={s("mt-reg")} title="Tags">
        <CardTags
          tags={tags}
          onTagClick={() => console.log('Tag clicked')}
          onAddClick={() => console.log('Tag added')}
          onRemoveClick={() => console.log('Tag removed')}
        />
      </CardSection>
    )
  }

  renderKeywords = () => {
    return (
      <CardSection className={s("mt-reg")} title="Keywords" startExpanded={false}>
        <Select
          value={this.state.keywords}
          onChange={(keywords) => this.setState({ keywords })}
          options={SELECT_VERIFICATION_INTERVAL_OPTIONS}
          isSearchable
          isMulti
          menuShouldScrollIntoView
          isClearable={false}
        />
      </CardSection>
    );
  }

  renderAdvanced = () => {
    return (
      <CardSection className={s("mt-reg")} title="Advanced" showSeparator={false} startExpanded={false}>
        <div className={s("flex")}>
          <div className={s("flex-1 mr-xs")}>
            <div className={s("text-gray-reg text-xs mb-xs")}> Verification Interval </div>
            <Select
              value={this.state.verificationInterval}
              onChange={(verificationInterval) => this.setState({ verificationInterval })}
              options={SELECT_VERIFICATION_INTERVAL_OPTIONS}
              isSearchable
              menuShouldScrollIntoView
            />
          </div>
          <div className={s("flex-1 ml-xs")}>
            <div className={s("text-gray-reg text-xs mb-xs")}> Permissions </div>
            <Select
              value={this.state.permission}
              onChange={(permission) => this.setState({ permission })}
              options={SELECT_PERMISSION_OPTIONS}
              isSearchable
              menuShouldScrollIntoView
            />
          </div>
        </div>
      </CardSection>
    );
  }

  render() {
    const { isOpen, onRequestClose, question } = this.props;
    const { hasBeenToggled } = this.state;

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
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
          className={s("flex-shrink-0 rounded-t-none")}
          underline
          underlineColor="purple-gray-50"
          color={"primary"}
        />
      </Modal>
    );
  }
}

CardCreateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
};

CardCreateModal.defaultProps = {
};

export default CardCreateModal;