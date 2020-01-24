import _ from 'underscore';
import globalStyle from '../styles/global.css';

export function getStyleApplicationFn() {
	const hashedClassNameMap = _.extend(globalStyle, ...arguments);
	return function(classNameString) {
		return classNameString.split(/\s+/).map(className => hashedClassNameMap[className] || className).join(' ');
	} 
}