export function generateFileKey() {
	return `new-file-${Math.floor(Math.random() * 10001)}`;
}

export function isUploadedFile(key) {
	return !key.startsWith('new-file-');
}