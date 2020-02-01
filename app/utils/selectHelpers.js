export const createSelectOptions = (options) => {
	console.log(options)
	return options.map(option => ({ label: option, value: option }));
}