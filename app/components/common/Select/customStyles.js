import { colors } from 'styles/colors';

const customStyles = {
  container: (provided) => ({
    ...provided,
    color: 'black',
    fontSize: '14px',
    letterSpacing: '0.3px',
    lineHeight: '22px',
    boxSizing: 'border-box',
    fontWeight: '400'
  }),
  control: (provided, state) => ({
    ...provided,
    background: state.isDisabled ? 'transparent' : provided.background,
    border: '1px solid rgba(0,2,95,0.10) !important'
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    display: state.isDisabled ? 'none' : provided.display
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0px 8px'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: colors.gray.dark
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: colors.gray.dark
  }),
  option: (provided, state) => {
    let background = 'white';
    if (state.isSelected) background = colors.purple['gray-50'];
    if (state.isFocused) background = colors.purple.light;

    return {
      ...provided,
      background,
      color: state.isSelected && !state.isFocused ? 'white' : 'black'
    };
  },
  input: () => ({
    visibility: 'visible'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: colors.purple.reg,
    borderWidth: '0 0 2px 0',
    borderStyle: 'solid',
    borderColor: colors.purple['gray-10'],
    fontWeight: 500
  }),
  multiValue: (provided) => ({
    ...provided,
    background: colors.purple.light,
    borderRadius: '16px',
    fontWeight: 600
  }),
  multiValueLabel: (provided) => ({
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
    display: state.isDisabled ? 'none' : provided.display
  }),
  menu: (provided) => ({
    ...provided,
    overflow: 'hidden',
    zIndex: 100000
  })
};

export default customStyles;
