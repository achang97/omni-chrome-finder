export function generateFileKey() {
  return `new-file-${Math.floor(Math.random() * 10001)}`;
}

export function isUploadedFile(key) {
  return !key.startsWith('new-file-');
}

export function convertAttachmentsToBackendFormat(attachments) {
  return attachments
    .filter(({ key }) => isUploadedFile(key))
    .map(({ key, location, name, mimetype }) => ({ key, location, name, mimetype }));
}
