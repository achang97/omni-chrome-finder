import { TASKS, ROUTES } from 'appConstants';

const CHROME_URL_REGEX = /^chrome:\/\/.*/;

export function isChromeUrl(url) {
  return !url || url.match(CHROME_URL_REGEX);
}

export default { isChromeUrl };