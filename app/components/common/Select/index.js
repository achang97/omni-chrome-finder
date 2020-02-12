import React from 'react';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';

import { colors } from '../../../styles/colors';
import customStyles from './customStyles';

import style from './select.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const Select = ({ className, creatable, styles, ...rest }) => {
  const SelectComponent = creatable ? CreatableSelect : ReactSelect;

  return (
    <SelectComponent
      {...rest}
      classNamePrefix="omni-react-select"
      className={s(`select ${className}`)}
      styles={styles ? { ...customStyles, ...styles } : customStyles}
      theme={theme => ({
        ...theme,
        borderRadius: 8,
        colors: {
          ...theme.colors,
          primary: colors.purple['gray-10'],
          primary75: colors.purple.light,
          primary50: colors.purple.xlight,
          primary25: colors.purple.xlight,
        },
        })}
    />
  );
}

Select.propTypes = {
  creatable: PropTypes.bool,
}

Select.defaultProps = {
  creatable: false,
  className: '',
  styles: {},
}

export default Select;