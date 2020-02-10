import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  closeCardSideDock,
  removeCardAttachment,
  addCardTag, removeCardTag,
  updateCardKeywords,
  updateCardVerificationInterval, updateCardPermissions,
} from '../../../actions/cards';

import { MdClose } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

import CardSection from '../CardSection';
import CardUsers from '../CardUsers';
import CardTags from '../CardTags';
import CardAttachment from '../CardAttachment';

import Select from '../../common/Select';
import Button from '../../common/Button';

import { getBaseAnimationStyle } from '../../../utils/animateHelpers';
import { PERMISSION_OPTIONS, VERIFICATION_INTERVAL_OPTIONS, FADE_IN_TRANSITIONS, CARD_STATUS_OPTIONS } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/selectHelpers';

import style from './card-side-dock.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const SELECT_PERMISSION_OPTIONS = createSelectOptions(PERMISSION_OPTIONS);
const SELECT_VERIFICATION_INTERVAL_OPTIONS = createSelectOptions(VERIFICATION_INTERVAL_OPTIONS);

const SIDE_DOCK_TRANSITION_MS = 300;

@connect(
  state => ({
    ...state.cards.activeCard,
  }),
  dispatch => bindActionCreators({
    closeCardSideDock,
    removeCardAttachment,
    addCardTag, removeCardTag,
    updateCardKeywords,
    updateCardVerificationInterval, updateCardPermissions,
  }, dispatch)
)

class CardSideDock extends Component {
  closeSideDock = () => {
    this.props.closeCardSideDock();
  }

  getAttribute = (attribute) => {
    const { isEditing, edits } = this.props;
    return isEditing ? edits[attribute] : this.props[attribute];
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
    const currOwners = this.getAttribute('owners');
    return (
      <CardSection className={s("mt-reg")} title="Owner(s)">
        <CardUsers
          users={currOwners}
          onAddClick={() => console.log('User added!')}
          onClick={() => console.log('User clicked!')}
          onRemoveClick={() => console.log('User removed!')}
        />
      </CardSection>
    );
  }

  renderAttachments = () => {
    const { removeCardAttachment } = this.props; 
    const currAttachments = this.getAttribute('attachments');

    return (
      <CardSection className={s("mt-lg")} title="Attachments">
        { currAttachments.length === 0 &&
          <div className={s("text-xs text-gray-light")}>
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
              onRemoveClick={() => removeCardAttachment(i)}
            />
          ))}
        </div>
      </CardSection>
    );
  }

  renderTags = () => {
    const currTags = this.getAttribute('tags');
    return (
      <CardSection className={s("mt-lg")} title="Tags">
        <CardTags
          tags={currTags}
          onTagClick={() => console.log('Tag clicked')}
          onAddClick={() => console.log('Tag added')}
          onRemoveClick={() => console.log('Tag removed')}
        />
      </CardSection>
    )
  }

  renderKeywords = () => {
    const { isEditing, updateCardKeywords } = this.props;
    const currKeywords = this.getAttribute('keywords');
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
            creatable={true}
            components={{ DropdownIndicator: null }}
            noOptionsMessage={({ inputValue }) => currKeywords.some(keyword => keyword.value === inputValue) ?
              "Keyword already exists" : "Begin typing to add a keyword"
            }
          /> :
          <div>
            { !currKeywords.length === 0 &&
              <div className={s("text-xs text-gray-light")}>
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

  renderAdvanced = () => {
    const { isEditing, updateCardPermissions, updateCardVerificationInterval } = this.props;
    const currVerificationInterval = this.getAttribute('verificationInterval');
    const currPermissions = this.getAttribute('permissions');

    return (
      <CardSection className={s("mt-lg")} title="Advanced">
        <div className={s("mb-sm")}>
          <div className={s("text-gray-reg text-xs mb-xs")}> Verification Interval </div>
          <Select
            value={currVerificationInterval}
            onChange={updateCardVerificationInterval}
            options={SELECT_VERIFICATION_INTERVAL_OPTIONS}
            placeholder="Select verification interval..."
            isSearchable
            menuShouldScrollIntoView
            isDisabled={!isEditing}
          />
        </div>
        <div>
          <div className={s("text-gray-reg text-xs mb-xs")}> Permissions </div>
          <Select
            value={currPermissions}
            onChange={updateCardPermissions}
            placeholder="Select permissions..."
            options={SELECT_PERMISSION_OPTIONS}
            isSearchable
            menuShouldScrollIntoView
            isDisabled={!isEditing}
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

  renderOverlay = () => {
    const { sideDockOpen } = this.props;

    const baseStyle = getBaseAnimationStyle(SIDE_DOCK_TRANSITION_MS);

    return (
      <Transition
        in={sideDockOpen}
        timeout={SIDE_DOCK_TRANSITION_MS}
        mountOnEnter
        unmountOnExit
      >
        {state => (  
          <div className={s("card-side-dock-overlay")} style={{ ...baseStyle, ...FADE_IN_TRANSITIONS[state] }} onClick={this.closeSideDock} />
        )}
      </Transition>
    );
  }

  render() {
    const { sideDockOpen, cardStatus } = this.props;

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
        { this.renderOverlay() }
        <Transition
          in={sideDockOpen}
          timeout={SIDE_DOCK_TRANSITION_MS}
          mountOnEnter
          unmountOnExit
        >
          {state => (
            <div className={s("card-side-dock overflow-auto")} style={{ ...baseStyle, ...transitionStyles[state] }}>
              { this.renderHeader() }
              { !isNewCard && this.renderOwners() }
              { this.renderAttachments() }
              { !isNewCard && this.renderTags() }
              { !isNewCard && this.renderKeywords() }
              { !isNewCard && this.renderAdvanced() }
              { !isNewCard && this.renderFooter() }
            </div>
          )}
        </Transition>
      </div>
    );
  }
}

export default CardSideDock;