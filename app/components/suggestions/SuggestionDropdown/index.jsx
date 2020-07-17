import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdMoreVert } from 'react-icons/md';

import { Dropdown, Button, Separator } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import style from './suggestion-dropdown.css';

const s = getStyleApplicationFn(style);

const SuggestionDropdown = ({ actions }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onOptionClick = (onClick) => {
    if (onClick) onClick();
    setDropdownOpen(false);
  };

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={s('flex-shrink-0 relative')}>
      <Dropdown
        isOpen={dropdownOpen}
        toggler={<MdMoreVert />}
        onToggle={setDropdownOpen}
        body={
          <div className={s('suggestion-dropdown')}>
            {actions.map(({ label, onClick }, i) => (
              <div key={label}>
                <Button
                  key={label}
                  text={label}
                  className={s('shadow-none text-purple-reg justify-start py-xs')}
                  textClassName={s('text-xs')}
                  onClick={() => onOptionClick(onClick)}
                />
                {i !== actions.length - 1 && <Separator horizontal className={s('my-0')} />}
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

SuggestionDropdown.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    })
  ).isRequired
};

export default SuggestionDropdown;
