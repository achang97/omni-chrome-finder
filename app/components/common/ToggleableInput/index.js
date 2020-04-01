import React, { useState } from 'react';
import PropTypes from 'prop-types';

import style from './toggleable-input.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);

const ToggleableInput = ({ value, isEditable, disabled, inputProps, className }) => {
  const [isEditing, toggleEdit] = useState(false);
  const isInputToggleable = isEditable && !disabled;

  if (isEditing && isEditable) {
    const { className: inputClassName, ...rest } = inputProps;
    return (
      <input
        autoFocus
        onBlur={() => toggleEdit(false)}
        value={value}
        className={s(`toggleable-input ${inputClassName}`)}
        {...rest}
      />
    );
  } else {
    return (
      <div
        className={s(`${isInputToggleable ? 'button-hover' : ''} ${className}`)}
        onClick={() => isInputToggleable && toggleEdit(true)}
      >
        {value}
      </div>
    );
  }
}

ToggleableInput.propTypes = {
  value: PropTypes.string,
  inputProps: PropTypes.shape({
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  }).isRequired,
  isEditable: PropTypes.bool,
  disabled: PropTypes.bool,
  inputClassName: PropTypes.string,
  className: PropTypes.string,
}

ToggleableInput.defaultProps = {
  isEditable: true,
  disabled: false,
  inputClassName: '',
  className: '',
}

export default ToggleableInput;