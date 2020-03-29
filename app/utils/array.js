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
export function updateArrayOfObjects(array, fieldName, fieldValue, newInfo, merge=true) {
  return array.map(elem => {
    if (elem[fieldName] === fieldValue) {
      if (merge) {
        return { ...elem, ...newInfo }
      } else {
        return newInfo;
      }
    } else {
      return elem;
    }
  });
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

/*
 * Gets array minus the elements in a specified withoutArray and by a specified field.
 */
export function getArrayWithout(array, withoutArray, field) {
  return array.filter(elem => !withoutArray.some(withoutElem => (
    field ? elem[field] === withoutElem[field] : elem === withoutElem
  )));
}
