import browser from 'webextension-polyfill';
import { NODE_ENV } from 'appConstants';

export const getStorageName = (name) =>
  `OMNI_EXTENSION_${process.env.NODE_ENV === NODE_ENV.DEV ? 'DEV' : 'PROD'}_${name}`;

export function setStorage(key, value) {
  if (browser.storage) {
    return browser.storage.local.set({
      [getStorageName(key)]: JSON.stringify(value)
    });
  }

  return null;
}

export function getStorage(key) {
  return new Promise((resolve, reject) => {
    if (browser.storage) {
      const keyName = getStorageName(key);
      browser.storage.local.get(keyName).then((obj) => {
        if (browser.runtime.lastError) {
          reject(browser.runtime.lastError);
        } else {
          const value = obj[keyName];
          resolve(value ? JSON.parse(value) : null);
        }
      });
    } else {
      reject(new Error('The variable `browser.storage` does not exist'));
    }
  });
}

export function addStorageListener(storageKey, callback) {
  if (browser.storage) {
    const listener = (changes, namespace) => {
      Object.entries(changes).forEach(([key, change]) => {
        const { oldValue, newValue } = change;
        if (namespace === 'local' && key === getStorageName(storageKey)) {
          const oldValueJSON = oldValue ? JSON.parse(oldValue) : oldValue;
          const newValueJSON = newValue ? JSON.parse(newValue) : newValue;
          callback({ oldValue: oldValueJSON, newValue: newValueJSON });
        }
      });
    };

    browser.storage.onChanged.addListener(listener);

    return listener;
  }

  return null;
}

export function removeStorageListener(callback) {
  browser.storage.onChanged.removeListener(callback);
}

export default {
  getStorageName,
  setStorage,
  getStorage,
  addStorageListener,
  removeStorageListener
};
