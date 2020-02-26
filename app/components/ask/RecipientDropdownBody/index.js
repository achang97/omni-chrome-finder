import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';

import style from './recipient-dropdown-body.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const PLACEHOLDER_MENTION_OPTIONS = [
  { id: 'u1', name: 'Akshay' },
  { id: 'u2', name: 'Chetan' },
  { id: 'u3', name: 'Andrew' },
]

class RecipientDropdownBody extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mentionInputText: '',
      selectedIndex: 0,
    }

    this.inputRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      // NOTE: HACKY SOLUTION. Should not have to use setTimeout.
      setTimeout(() => this.inputRef.current.focus(), 0);
    }
  }

  handleChange = (e) => {
    this.setState({ mentionInputText: e.target.value, selectedIndex: 0 })
  }

  handleKeyPress = (e, mentionOptions) => {
    const { selectedIndex } = this.state;

    if (e.key === 'Enter'){
      if (selectedIndex < mentionOptions.length) {
        this.onAddMention(mentionOptions[selectedIndex]);
      }
    }
  }

  onAddMention = (mention) => {
    this.props.onAddMention(mention);
    this.setState({ selectedIndex: 0, mentionInputText: '' });
    this.inputRef.current.focus();
  }

  handleKeyDown = (e, mentionOptions) => {
    let { selectedIndex } = this.state;

    if (selectedIndex >= mentionOptions.length) {
      selectedIndex = 0;
    }

    if (e.keyCode === 38) { // UP
      this.setState({ selectedIndex: (selectedIndex + mentionOptions.length - 1) % mentionOptions.length })
    } else if (e.keyCode === 40) { // DOWN
      this.setState({ selectedIndex: (selectedIndex + mentionOptions.length + 1) % mentionOptions.length })
    }
  }

  getMentionOptions = () => {
    const { mentions } = this.props;
    const { mentionInputText } = this.state;

    return PLACEHOLDER_MENTION_OPTIONS
      .filter(mention => (
        !mentions.some(currMention => currMention.id === mention.id) &&
        mention.name.toLowerCase().includes(mentionInputText.trim().toLowerCase())
      ));
  }

  render() {
    const { mentions, isDropdownOpen, isOpen, onRemoveMention } = this.props;
    const { mentionInputText, selectedIndex } = this.state;

    const addMentionOptions = this.getMentionOptions();

    return (
      <div className={s("recipient-dropdown-select")}>
        <div className={s("px-xs")}>
          <input 
            ref={this.inputRef}
            className={s("recipient-dropdown-input w-full")}
            placeholder="@mention"
            onChange={e => this.handleChange(e)}
            value={mentionInputText}
            onKeyPress={e => this.handleKeyPress(e, addMentionOptions)}
            onKeyDown={e => this.handleKeyDown(e, addMentionOptions)}
          />
          <div className={s("horizontal-separator")} />
        </div>
        <div className={s("overflow-auto my-xs text-purple-reg")}>
          { addMentionOptions.length === 0 ?
            <div className={s("px-sm text-center font-normal")}> No mention options </div> :
            addMentionOptions.map((mention, i) => (
              <div
                key={mention.id}
                className={s(`px-sm py-xs button-hover ${selectedIndex === i ? 'bg-purple-gray-10' : ''}`)}
                onClick={() => this.onAddMention(mention)}
                onMouseOver={() => this.setState({ selectedIndex: i })}
              >
                <div className={s("w-full truncate font-semibold")}> @{mention.name} </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

RecipientDropdownBody.propTypes = {
  mentions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  onAddMention: PropTypes.func.isRequired,
  onRemoveMention: PropTypes.func.isRequired,
}

RecipientDropdownBody.defaultProps = {

}

export default RecipientDropdownBody;