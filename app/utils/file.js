import queryString from 'query-string';
import { SERVER_URL } from './request';

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

export function isVideo(type) {
  return type.startsWith('video');
}

export function isAudio(type) {
  return type.startsWith('audio');
}

export function isImage(type) {
  return type.startsWith('image');
}

export function isAnyLoading(files) {
  return files.some(({ isLoading }) => isLoading);
}

export function getFileUrl(key, contentType, token) {
  if (!isUploadedFile(key) || !contentType) return null;

  const authToken = token.match(/Bearer (.+)/)[1];
  const queryParams = queryString.stringify({ auth: authToken, contentType });
  return `${SERVER_URL}/files/${key}?${queryParams}`;
}