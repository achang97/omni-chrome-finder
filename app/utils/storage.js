import { NODE_ENV } from 'appConstants';

export const getStorageName = (name) =>
  `OMNI_EXTENSION_${process.env.NODE_ENV === NODE_ENV.DEV ? 'DEV' : 'PROD'}_${name}`;

export function setStorage(key, value) {
  if (chrome.storage) {
    return chrome.storage.local.set(
      {
        [getStorageName(key)]: JSON.stringify(value)
      },
      () => {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        }
      }
    );
  }

  return null;
}

export function getStorage(key) {
  return new Promise((resolve, reject) => {
    if (chrome.storage) {
      const keyName = getStorageName(key);
      return chrome.storage.local.get(keyName, (obj) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          const value = obj[keyName];
          resolve(value ? JSON.parse(value) : null);
        }
      });
    }

    reject('The variable `chrome.storage` does not exist');
  });
}

export function addStorageListener(storageKey, callback) {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    Object.entries(changes).forEach(([key, change]) => {
      const { oldValue, newValue } = change;
      if (namespace === 'local' && key === getStorageName(storageKey)) {
        const oldValueJSON = oldValue ? JSON.parse(oldValue) : oldValue;
        const newValueJSON = newValue ? JSON.parse(newValue) : newValue;
        callback({ oldValue: oldValueJSON, newValue: newValueJSON });
      }
    });
  });
}

export default { getStorageName, setStorage, getStorage, addStorageListener };
