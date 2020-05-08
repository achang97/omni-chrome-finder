import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const CardKeywords = ({ isEditable, keywords, onChange }) =>
  isEditable ? (
    <Select
      value={keywords}
      onChange={onChange}
      isSearchable
      isMulti
      menuShouldScrollIntoView
      isClearable={false}
      placeholder="Add keywords..."
      type="creatable"
      components={{ DropdownIndicator: null }}
      noOptionsMessage={({ inputValue }) =>
        keywords.some((keyword) => keyword.value === inputValue)
          ? 'Keyword already exists'
          : 'Begin typing to add a keyword'
      }
    />
  ) : (
    <div>
      {keywords.length === 0 && (
        <div className={s('text-sm text-gray-light')}>No current keywords</div>
      )}
      <div className={s('flex flex-wrap')}>
        {keywords.map(({ label, value }, i) => (
          <div
            key={value}
            className={s(
              'text-sm mr-sm mb-sm truncate text-purple-reg underline-border border-purple-gray-10'
            )}
          >
            {value}
            {i !== keywords.length - 1 && ','}
          </div>
        ))}
      </div>
    </div>
  );

CardKeywords.propTypes = {
  isEditable: PropTypes.bool,
  keywords: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.isRequired,
      value: PropTypes.isRequired
    })
  ),
  onChange: PropTypes.func
};

CardKeywords.defaultProps = {
  isEditable: false
};

export default CardKeywords;
