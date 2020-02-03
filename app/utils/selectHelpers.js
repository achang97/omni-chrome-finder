export const createSelectOptions = (options) => {
	return options.map(option => ({ label: option, value: option }));
}