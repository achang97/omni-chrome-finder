export const createSelectOptions = (options, transform) => {
  if (transform) {
    return options.map(option => transform(option));
  }
  return options.map(option => ({ label: option, value: option }));
};

export const createSelectValue = (value, transform) => {
  if (transform) {
    return transform(value);
  }
  return { label: value, value };
};

export default { createSelectValue, createSelectOptions };