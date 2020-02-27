import * as types from './actionTypes';

export function updateNavigateSearchText(text) {
	return { type: types.UPDATE_NAVIGATE_SEARCH_TEXT, payload: { text } }
}

export function updateNavigateTab(activeTab) {
  return { type: types.UPDATE_NAVIGATE_TAB, payload: { activeTab } };
}

export function updateFilterTags(newTags) {
	return { type: types.UPDATE_FILTER_TAGS, payload: { newTags } };
}

export function removeFilterTag(index) {
	return { type: types.REMOVE_FILTER_TAG, payload: { index } };
}