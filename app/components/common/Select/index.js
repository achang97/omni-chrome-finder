import React from 'react';
import ReactSelect from 'react-select';

import { colors } from '../../../styles/colors';

import style from './select.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    color: 'black',
    fontSize: '14px',
    letterSpacing: '0.3px',
    lineHeight: '22px',
    boxSizing: 'border-box',
  }),
  control: (provided, state) => ({
    ...provided,
    border: '1px solid rgba(0,2,95,0.10) !important',
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: '0px 8px',
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: colors.gray.dark,
  }),
  noOptionsMessage: (provided, state) => ({
    ...provided,
    color: colors.gray.dark,
  }),
  option: (provided, state) => {
    let background = 'white';
    if (state.isSelected) background = colors.purple['gray-50'];
    if (state.isFocused) background = colors.purple.light;

    return {
      ...provided,
      background,
      color: state.isSelected && !state.isFocused ? 'white' : 'black',
    }
  },
  input: (provided, state) => ({
    visibility: 'visible',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: colors.purple.reg,
    borderWidth: '0 0 2px 0',
    borderStyle: 'solid',
    borderColor: colors.purple['gray-10'],
    fontWeight: 500,
  }),
  multiValue: (provided, state) => ({
    ...provided,
    background: colors.purple.light
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: colors.purple.reg,
    textDecorationColor: `${colors.purple['gray-50']} !important`,
    textDecoration: 'underline'    
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: colors.purple['gray-50'],
    background: 'transparent !important',
    cursor: 'pointer',
  }),
  menu: (provided, state) => ({
    ...provided,
    overflow: 'hidden',
  })
}

const Select = (props) => {
  return (
    <ReactSelect
      {...props}
      classNamePrefix="omni-react-select"
      className={s("select")}
      styles={customStyles}
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

export default Select;