export const createSelectOptions = (options, transform) => {
	if (transform) {
		return options.map(option => transform(option));
	} else {
		return options.map(option => ({ label: option, value: option }));
	}
}

export const createSelectValue = (value, transform) => {
	if (transform) {
		return transform(value);
	} else {
		return { label: value, value: value };
	}
}