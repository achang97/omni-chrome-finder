export const createSelectOptions = (options, transform) => {
  if (transform) {
    return options.map((option) => transform(option));
  }
  return options.map(createSelectOption);
};

export const createSelectOption = (option) => {
  if (option) {
    return { label: option, value: option };
  }

  return option;
};

export default { createSelectOptions, createSelectOption };
