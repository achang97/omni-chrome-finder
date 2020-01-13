export function combineStyles() {
	let style = '';

	for (var i = 0; i < arguments.length; i++) {
		style += `${arguments[i]} `;
	}

	return style;
}