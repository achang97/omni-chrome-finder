import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import Separator from 'components/common/Separator';

import { getStyleApplicationFn } from 'utils/style';
import style from './recipient-dropdown-body.css';

const s = getStyleApplicationFn(style);

const RecipientDropdownBody = ({ mentionOptions, mentions, onAddMention }) => {
  const [mentionInputText, setInputText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const mentionRefs = mentionOptions.map(() => useRef(null));

  const handleChange = (e) => {
    setInputText(e.target.value);
    setSelectedIndex(0);
  };

  const addMention = (mention) => {
    onAddMention(mention);
    setInputText('');
    setSelectedIndex(0);
    inputRef.current.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (selectedIndex < mentionOptions.length) {
        addMention(mentionOptions[selectedIndex]);
      }
    }
  };

  const handleKeyDown = (e) => {
    let newSelectedIndex = selectedIndex;
    if (selectedIndex >= mentionOptions.length) {
      newSelectedIndex = 0;
    }

    if (e.keyCode === 38) {
      // UP
      newSelectedIndex = (newSelectedIndex + mentionOptions.length - 1) % mentionOptions.length;
    } else if (e.keyCode === 40) {
      // DOWN
      newSelectedIndex = (newSelectedIndex + mentionOptions.length + 1) % mentionOptions.length;
    }

    setSelectedIndex(newSelectedIndex);
    if (mentionRefs[newSelectedIndex].current) {
      mentionRefs[newSelectedIndex].current.scrollIntoView();
    }
  };

  const getMentionOptions = () => {
    return mentionOptions.filter(
      (mention) =>
        !mentions.some((currMention) => currMention.id === mention.id) &&
        `@${mention.name.toLowerCase()}`.includes(mentionInputText.trim().toLowerCase())
    );
  };

  const addMentionOptions = getMentionOptions();
  return (
    <div className={s('flex flex-col min-h-0')}>
      <div className={s('px-xs')}>
        <input
          ref={inputRef}
          autoFocus
          className={s('recipient-dropdown-input w-full')}
          placeholder="@mention"
          onChange={(e) => handleChange(e)}
          value={mentionInputText}
          onKeyPress={(e) => handleKeyPress(e, addMentionOptions)}
          onKeyDown={(e) => handleKeyDown(e, addMentionOptions)}
        />
        <Separator horizontal />
      </div>
      <div className={s('recipient-dropdown-select-options')}>
        {addMentionOptions.length === 0 ? (
          <div className={s('px-sm text-center font-normal')}> No mention options </div>
        ) : (
          addMentionOptions.map((mention, i) => (
            <div
              key={mention.id}
              className={s(
                `px-sm py-xs button-hover ${selectedIndex === i ? 'bg-purple-gray-10' : ''}`
              )}
              onClick={() => addMention(mention)}
              onMouseEnter={() => setSelectedIndex(i)}
              ref={mentionRefs[i]}
            >
              <div className={s('w-full truncate font-semibold')}> @{mention.name} </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

RecipientDropdownBody.propTypes = {
  mentionOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  mentions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  onAddMention: PropTypes.func.isRequired
};

RecipientDropdownBody.defaultProps = {};

export default RecipientDropdownBody;
