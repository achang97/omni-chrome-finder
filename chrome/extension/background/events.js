import { URL, WEB_APP_ROUTES } from 'appConstants';

chrome.runtime.onUpdateAvailable.addListener(() => {
  // Automatically update
  chrome.runtime.reload();
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    window.open(`${URL.WEB_APP}${WEB_APP_ROUTES.SIGNUP}`);
  }
});
