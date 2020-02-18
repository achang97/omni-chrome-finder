/*
 * Returns a shallow copy of array with element at index removed.
 */
export function removeIndex(array, index) {
	const arrayCopy = array.slice();
	arrayCopy.splice(index, 1);
	return arrayCopy;
}

/*
 * Returns a shallow copy of array with element at index updated.
 */
export function updateIndex(array, index, newElement) {
	const arrayCopy = array.slice();
	arrayCopy[index] = newElement;
	return arrayCopy;
}

/*
 * Returns an array of extracted ids.
 */
export function getArrayIds(array) {
	return array.map(elem => elem._id);
}

/*
 * Returns an array of extracted fields.
 */
export function getArrayField(array, field) {
	return array.map(elem => elem[field]);
}