import React from 'react';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AsyncSelect from 'react-select/async';
import PropTypes from 'prop-types';

import { colors } from 'styles/colors';
import { APP_CLASSNAME } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';
import customStyles from './customStyles';

import style from './select.css';

const s = getStyleApplicationFn(style);

const Select = ({ className, type, styles, ...rest }) => {
  let SelectComponent;
  switch (type) {
    case 'creatable':
      SelectComponent = CreatableSelect;
      break;
    case 'async':
      SelectComponent = AsyncSelect;
      break;
    case 'default':
    default:
      SelectComponent = ReactSelect;
      break;
  }

  return (
    <SelectComponent
      {...rest}
      classNamePrefix="omni-react-select"
      menuPortalTarget={document.querySelector(`.${APP_CLASSNAME}`)}
      menuPosition="fixed"
      className={s(`select ${className}`)}
      styles={styles ? { ...customStyles, ...styles } : customStyles}
      theme={(theme) => ({
        ...theme,
        borderRadius: 8,
        colors: {
          ...theme.colors,
          primary: colors.purple['gray-10'],
          primary75: colors.purple.light,
          primary50: colors.purple.xlight,
          primary25: colors.purple.xlight
        }
      })}
    />
  );
};

Select.propTypes = {
  type: PropTypes.oneOf(['default', 'creatable', 'async']),
  className: PropTypes.string,
  styles: PropTypes.shape({})
};

Select.defaultProps = {
  type: 'default',
  className: '',
  styles: {}
};

export default Select;
