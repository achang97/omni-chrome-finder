export const createSelectOptions = (options, transform) => {
	if (transform) {
		return options.map(option => transform(option));
	} else {
		return options.map(option => ({ label: option, value: option }));
	}
}