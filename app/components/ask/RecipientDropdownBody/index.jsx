import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import Separator from 'components/common/Separator';

import { KEY_CODES } from 'appConstants/window';
import { getStyleApplicationFn } from 'utils/style';
import style from './recipient-dropdown-body.css';

const s = getStyleApplicationFn(style);

const RecipientDropdownBody = ({ mentionOptions, mentions, onAddMention }) => {
  const [mentionInputText, setInputText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const mentionRefs = React.useRef([]);

  React.useEffect(() => {
    mentionRefs.current = new Array(mentionOptions.length);
  }, [mentionOptions.length]);

  const handleChange = (e) => {
    setInputText(e.target.value);
    setSelectedIndex(0);
  };

  const setMentionIndex = (index) => {
    setSelectedIndex(index);
    if (mentionRefs.current[index]) {
      mentionRefs.current[index].scrollIntoView();
    }
  };

  const addMention = (mention) => {
    onAddMention(mention);
    setInputText('');
    setMentionIndex(0);
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    let newSelectedIndex = selectedIndex;
    if (selectedIndex >= mentionOptions.length) {
      newSelectedIndex = 0;
    }

    switch (e.keyCode) {
      case KEY_CODES.ENTER: {
        if (selectedIndex < mentionOptions.length) {
          addMention(mentionOptions[selectedIndex]);
        }
        return;
      }
      case KEY_CODES.UP: {
        newSelectedIndex = (newSelectedIndex + mentionOptions.length - 1) % mentionOptions.length;
        break;
      }
      case KEY_CODES.DOWN: {
        newSelectedIndex = (newSelectedIndex + mentionOptions.length + 1) % mentionOptions.length;
        break;
      }
      default:
        break;
    }

    setMentionIndex(newSelectedIndex);
  };

  const getMentionOptions = () => {
    return mentionOptions.filter(
      (mention) =>
        !mentions.some((currMention) => currMention.id === mention.id) &&
        `@${mention.name.toLowerCase()}`.includes(mentionInputText.trim().toLowerCase())
    );
  };

  const setMentionRef = (el, index) => {
    mentionRefs.current[index] = el;
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
              ref={(el) => setMentionRef(el, i)}
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
