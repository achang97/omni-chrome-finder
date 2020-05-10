import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import style from './toggleable-input.css';

const s = getStyleApplicationFn(style);

const ToggleableInput = ({ value, isEditable, disabled, inputProps, className, placeholder }) => {
  const [isEditing, toggleEdit] = useState(false);
  const isInputToggleable = isEditable && !disabled;

  if (isEditing && isEditable) {
    const { className: inputClassName, ...restInputProps } = inputProps;
    return (
      <input
        autoFocus
        onBlur={() => toggleEdit(false)}
        value={value}
        className={s(`toggleable-input ${inputClassName}`)}
        {...restInputProps}
      />
    );
  }
  return (
    <div
      className={s(`${isInputToggleable ? 'button-hover' : ''} ${className}`)}
      onClick={() => isInputToggleable && toggleEdit(true)}
    >
      {value || (
        <span className={s('italic')}>{placeholder || inputProps.placeholder || 'No text...'}</span>
      )}
    </div>
  );
};

ToggleableInput.propTypes = {
  value: PropTypes.string,
  inputProps: PropTypes.shape({
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string
  }).isRequired,
  isEditable: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string
};

ToggleableInput.defaultProps = {
  value: null,
  placeholder: null,
  isEditable: true,
  disabled: false,
  className: ''
};

export default ToggleableInput;
