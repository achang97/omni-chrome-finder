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