import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';

import Separator from '../../common/Separator';

import style from './recipient-dropdown-body.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

class RecipientDropdownBody extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mentionInputText: '',
      selectedIndex: 0,
    };

    this.inputRef = React.createRef();
  }

  handleChange = (e) => {
    this.setState({ mentionInputText: e.target.value, selectedIndex: 0 });
  }

  handleKeyPress = (e, mentionOptions) => {
    const { selectedIndex } = this.state;

    if (e.key === 'Enter') {
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
      this.setState({ selectedIndex: (selectedIndex + mentionOptions.length - 1) % mentionOptions.length });
    } else if (e.keyCode === 40) { // DOWN
      this.setState({ selectedIndex: (selectedIndex + mentionOptions.length + 1) % mentionOptions.length });
    }
  }

  getMentionOptions = () => {
    const { mentions, mentionOptions } = this.props;
    const { mentionInputText } = this.state;

    return mentionOptions
      .filter(mention => (
        !mentions.some(currMention => currMention.id === mention.id) &&
        `@${mention.name.toLowerCase()}`.includes(mentionInputText.trim().toLowerCase())
      ));
  }

  render() {
    const { mentions, isDropdownOpen } = this.props;
    const { mentionInputText, selectedIndex } = this.state;

    const addMentionOptions = this.getMentionOptions();

    return (
      <div className={s('flex flex-col min-h-0')}>
        <div className={s('px-xs')}>
          <input
            ref={this.inputRef}
            autoFocus
            className={s('recipient-dropdown-input w-full')}
            placeholder="@mention"
            onChange={e => this.handleChange(e)}
            value={mentionInputText}
            onKeyPress={e => this.handleKeyPress(e, addMentionOptions)}
            onKeyDown={e => this.handleKeyDown(e, addMentionOptions)}
          />
          <Separator horizontal />
        </div>
        <div className={s('recipient-dropdown-select-options')}>
          { addMentionOptions.length === 0 ?
            <div className={s('px-sm text-center font-normal')}> No mention options </div> :
            addMentionOptions.map((mention, i) => (
              <div
                key={mention.id}
                className={s(`px-sm py-xs button-hover ${selectedIndex === i ? 'bg-purple-gray-10' : ''}`)}
                onClick={() => this.onAddMention(mention)}
                onMouseEnter={() => this.setState({ selectedIndex: i })}
              >
                <div className={s('w-full truncate font-semibold')}> @{mention.name} </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

RecipientDropdownBody.propTypes = {
  mentionOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  mentions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  onAddMention: PropTypes.func.isRequired,
};

RecipientDropdownBody.defaultProps = {

};

export default RecipientDropdownBody;
