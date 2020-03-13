export const getStorageName = name => `OMNI_EXTENSION_${name}`;

export const setStorage = (key, value) => {
  if (chrome.storage) {
    return chrome.storage.sync.set({
      [getStorageName(key)]: JSON.stringify(value)
    });
  }

  return null;
};

export const getStorage = (key) => {
  return new Promise((resolve, reject) => {
    if (chrome.storage) {
      const keyName = getStorageName(key);
      return chrome.storage.sync.get(keyName, (obj) => {
        const value = obj[keyName];
        resolve(value ? JSON.parse(value) : null);
      });
    }

    reject('The variable `chrome.storage` does not exist');
  })
};
