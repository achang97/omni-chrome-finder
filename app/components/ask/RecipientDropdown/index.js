import React, { Component } from 'react';
import PropTypes from 'prop-types';

import onClickOutside from "react-onclickoutside";
import { MdClose } from 'react-icons/md';

import style from './recipient-dropdown.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const PLACEHOLDER_MENTION_OPTIONS = [
  { id: 'u1', name: 'Akshay' },
  { id: 'u2', name: 'Chetan' },
  { id: 'u3', name: 'Andrew' },
]

class RecipientDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mentionInputText: '',
    }
  }

  handleClickOutside = evt => {
    this.props.onClose();
  }

  render() {
    const { name, mentions, isDropdownOpen, isDropdownSelectOpen, onAddMention, onRemoveMention, onClose } = this.props;
    const { mentionInputText } = this.state;

    if (!isDropdownOpen && !isDropdownSelectOpen) {
      return null;
    }

    const addMentionOptions = PLACEHOLDER_MENTION_OPTIONS
      .filter(mention => (
        !mentions.find(currMention => currMention.id === mention.id) &&
        mention.name.includes(mentionInputText.trim())
      ));

    return (
      <div className={s(`recipient-dropdown ${isDropdownSelectOpen ? 'recipient-dropdown-select' : ''}`)}>
        { isDropdownOpen && (mentions.length === 0 ?
          <div className={s("text-center text-purple-reg font-normal")}> No current mentions </div> :
          <div className={s("overflow-auto px-sm")}>
            { mentions.map((mention) => (
              <div key={mention.id} className={s("flex justify-between items-center py-xs")}>
                <div className={s("min-w-0 truncate")}> @{mention.name} </div>
                <button onClick={() => onRemoveMention(mention)}>
                  <MdClose className={s("text-purple-reg")} />
                </button>
              </div>
            ))}
          </div>
        )}
        { isDropdownSelectOpen &&
          <div>
            <div className={s("px-xs")}>
              <input 
                className={s("recipient-dropdown-input w-full")}
                placeholder="@ mention"
                onChange={e => this.setState({ mentionInputText: e.target.value })}
              />
              <div className={s("horizontal-separator")} />
            </div>
            <div className={s("overflow-auto px-sm my-xs")}>
              { addMentionOptions.length === 0 ?
                <div className={s("text-center text-purple-reg font-normal")}> No mention options </div> :
                addMentionOptions.map(mention => (
                  <div key={mention.id} className={s("py-xs button-hover")} onClick={() => onAddMention(mention)}>
                    <div className={s("w-full truncate")}> @{mention.name} </div>
                  </div>
                ))
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

RecipientDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  mentions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  isDropdownOpen: PropTypes.bool.isRequired,
  isDropdownSelectOpen: PropTypes.bool.isRequired,
  onAddMention: PropTypes.func.isRequired,
  onRemoveMention: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

RecipientDropdown.defaultProps = {

}

export default onClickOutside(RecipientDropdown);