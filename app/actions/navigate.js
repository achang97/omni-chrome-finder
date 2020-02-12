import * as types from './actionTypes';

/* Create behavior */
export function updateNavigateTab(tabIndex) {
  return { type: types.UPDATE_NAVIGATE_TAB, payload: { tabIndex } };
}

export function updateFilterTags(newTags) {
	return { type: types.UPDATE_FILTER_TAGS, payload: { newTags } };
}

export function removeFilterTag(index) {
	return { type: types.REMOVE_FILTER_TAG, payload: { index } };
}