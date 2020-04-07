import { NEW_TAB_URL } from './constants';

export function isNewTab(url) {
  return !url || url === NEW_TAB_URL;
}
