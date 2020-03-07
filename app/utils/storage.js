export const getStorageName = (name) => `OMNI_EXTENSION_${name}`;

export const setStorage = (key, value) => {
	if (chrome.storage) {
		return chrome.storage.sync.set({
			[getStorageName(key)]: JSON.stringify(value)
		});  		
	}

	return null;
}

export const getStorage = (key, callback) => {
	if (chrome.storage) {
		return chrome.storage.sync.get(getStorageName(key), callback);
	}

	return null;
}