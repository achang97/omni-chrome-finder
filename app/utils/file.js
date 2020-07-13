import _ from 'lodash';
import queryString from 'query-string';
import { URL } from 'appConstants/request';

export function generateFileKey() {
  return `new-file-${Math.floor(Math.random() * 10001)}`;
}

export function isUploadedFile(key) {
  return !key.startsWith('new-file-');
}

export function convertAttachmentsToBackendFormat(attachments) {
  return attachments
    .filter(({ key }) => isUploadedFile(key))
    .map((file) => _.pick(file, ['key', 'location', 'name', 'mimetype', 'inline']));
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

export function getFileUrl(key, token, contentType) {
  if (!key || !token || !isUploadedFile(key)) return null;

  const authToken = token.match(/Bearer (.+)/)[1];
  const queryParams = queryString.stringify({ auth: authToken, contentType });
  return `${URL.SERVER}/files/${key}?${queryParams}`;
}

export default {
  generateFileKey,
  isUploadedFile,
  convertAttachmentsToBackendFormat,
  isVideo,
  isAudio,
  isImage,
  isAnyLoading,
  getFileUrl
};
