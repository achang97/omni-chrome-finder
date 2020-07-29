import _ from 'lodash';

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
export function updateIndex(array, index, newElement, merge = false) {
  const arrayCopy = array.slice();
  arrayCopy[index] = merge ? { ...array[index], ...newElement } : newElement;
  return arrayCopy;
}

/*
 * Returns a shallow copy of array with element with matching field updated.
 */
export function updateArrayOfObjects(array, matchObj, newInfoObj, merge = true) {
  return array.map((elem) => {
    const isMatch = Object.entries(matchObj).every(([key, value]) => _.get(elem, key) === value);
    if (isMatch) {
      if (merge) {
        return { ...elem, ...newInfoObj };
      }
      return newInfoObj;
    }
    return elem;
  });
}

/*
 * Returns an array of extracted ids.
 */
export function getArrayIds(array) {
  return array.map((elem) => elem._id);
}

/*
 * Returns an array of extracted fields.
 */
export function getArrayField(array, field) {
  return array.map((elem) => elem[field]);
}

export default {
  removeIndex,
  updateIndex,
  updateArrayOfObjects,
  getArrayIds,
  getArrayField
};
