import React from 'react';
import PropTypes from 'prop-types';
import { MdCheck } from 'react-icons/md';
import { getStyleApplicationFn } from 'utils/style';
import style from './checkbox.css';

const s = getStyleApplicationFn(style);

const CheckBox = ({
  className,
  isSelected,
  toggleCheckbox,
  selectedClassName,
  unselectedClassName
}) => (
  <div
    className={s(
      `checkbox-container ${
        isSelected
          ? `checkbox-container-selected ${selectedClassName}`
          : `bg-white ${unselectedClassName}`
      } ${className}`
    )}
    onClick={toggleCheckbox}
  >
    {isSelected && <MdCheck />}
  </div>
);

CheckBox.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  toggleCheckbox: PropTypes.func,
  className: PropTypes.string,
  selectedClassName: PropTypes.string,
  unselectedClassName: PropTypes.string
};

CheckBox.defaultProps = {
  className: '',
  selectedClassName: '',
  unselectedClassName: ''
};

export default CheckBox;
