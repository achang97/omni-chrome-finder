import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

import CardSection from '../CardSection';
import CardUsers from '../CardUsers';
import CardTags from '../CardTags';
import CardAttachment from '../CardAttachment';

import Select from '../../common/Select';
import Button from '../../common/Button';

import { PERMISSION_OPTIONS, VERIFICATION_INTERVAL_OPTIONS } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/selectHelpers';

import style from './card-side-dock.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const SELECT_PERMISSION_OPTIONS = createSelectOptions(PERMISSION_OPTIONS);
const SELECT_VERIFICATION_INTERVAL_OPTIONS = createSelectOptions(VERIFICATION_INTERVAL_OPTIONS);

class CardSideDock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasBeenToggled: props.isVisible, // If it starts out as visible, then say it's been toggled?
      keywords: [],
      verificationInterval: null,
      permission: null,
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible && !this.state.hasBeenToggled) {
      this.setState({ hasBeenToggled: true });
    }
  }

  closeSideDock = () => {
    const { onClose } = this.props;
    onClose();
  }

  renderHeader = () => (
    <div className={s("flex justify-between text-purple-gray-50 mb-sm")}>
      <div className={s("text-xs")}> Card Information </div>
      <button onClick={this.closeSideDock}>
        <MdClose />
      </button>
    </div>
  );

  renderOwners = () => {
    const users = [{ name: 'Andrew', id: '1', img: 'https://sunrift.com/wp-content/uploads/2014/12/Blake-profile-photo-square-768x769.jpg' }, { name: 'Chetan', id: '5', img: null }];
    return (
      <CardSection className={s("mt-reg")} title="Owner(s)">
        <CardUsers
          users={users}
          onAddClick={() => console.log('User added!')}
          onClick={() => console.log('User clicked!')}
          onRemoveClick={() => console.log('User removed!')}
        />
      </CardSection>
    );
  }

  renderAttachments = () => {
    const attachments = [{ filename: 'User Deletion.mp4', type: 'video' }, { filename: 'deletion.png', type: 'image' }, { filename: 'tests.txt', type: 'file' }]
    return (
      <CardSection className={s("mt-lg")} title="Attachments">
        <div className={s("flex flex-wrap")}>
          { attachments.map(({ filename, type }) => (
            <CardAttachment
              key={filename}
              filename={filename}
              type={type}
              onClick={() => console.log('File clicked!')}
              onRemoveClick={() => console.log('File removed!')}
            />
          ))}
        </div>
      </CardSection>
    );
  }

  renderTags = () => {
    const tags = ['Customer Service Onboarding', 'Sales', 'Pitches'];
    return (
      <CardSection className={s("mt-lg")} title="Tags">
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
      <CardSection className={s("mt-lg")} title="Keywords">
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
      <CardSection className={s("mt-lg")} title="Advanced">
        <div className={s("mb-sm")}>
          <div className={s("text-gray-reg text-xs mb-xs")}> Verification Interval </div>
          <Select
            value={this.state.verificationInterval}
            onChange={(verificationInterval) => this.setState({ verificationInterval })}
            options={SELECT_VERIFICATION_INTERVAL_OPTIONS}
            isSearchable
            menuShouldScrollIntoView
          />
        </div>
        <div>
          <div className={s("text-gray-reg text-xs mb-xs")}> Permissions </div>
          <Select
            value={this.state.permission}
            onChange={(permission) => this.setState({ permission })}
            options={SELECT_PERMISSION_OPTIONS}
            isSearchable
            menuShouldScrollIntoView
          />
        </div>
      </CardSection>
    );
  }

  renderFooter = () => {
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

  render() {
    const { isVisible } = this.props;
    const { hasBeenToggled } = this.state;

    return (
      <div className={s(`${hasBeenToggled ? (isVisible ? 'card-side-dock-slide-in' : 'card-side-dock-slide-out') : ''} overflow-hidden pointer-events-none rounded-b-lg absolute top-0 left-0 right-0 bottom-0 z-10`)}>
        <div className={s("card-side-dock-overlay")} onClick={this.closeSideDock} />
        <div className={s("card-side-dock overflow-auto")}>
          { this.renderHeader() }
          { this.renderOwners() }
          { this.renderAttachments() }
          { this.renderTags() }
          { this.renderKeywords() }
          { this.renderAdvanced() }
          { this.renderFooter() }
        </div>
      </div>
    );
  }
}

CardSideDock.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

CardSideDock.defaultProps = {
};

export default CardSideDock;