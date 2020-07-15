import _ from 'lodash';
import queryString from 'query-string';
import {
  FaFileImage,
  FaFileAudio,
  FaFileVideo,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAlt,
  FaFileCode,
  FaFileArchive
} from 'react-icons/fa';
import { URL } from 'appConstants/request';

const COLORS = {
  IMAGE: { color: 'purple-reg', underlineColor: 'purple-grey-50' },
  AUDIO_VIDEO: { color: 'red-500', underlineColor: 'red-200' },
  EXCEL_CODE: { color: 'green-500', underlineColor: 'green-200' },
  POWERPOINT_PDF: { color: 'orange-500', underlineColor: 'orange-200' },
  ARCHIVE: { color: 'gray-500', underlineColor: 'gray-200' },
  DEFAULT: { color: 'blue-500', underlineColor: 'blue-200' }
};

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

export function getAttachmentIconProps(type) {
  if (!type) {
    return { ...COLORS.DEFAULT, Icon: FaFileAlt };
  }

  if (isImage(type)) {
    return { ...COLORS.IMAGE, Icon: FaFileImage };
  }
  if (isAudio(type)) {
    return { ...COLORS.AUDIO_VIDEO, Icon: FaFileAudio };
  }
  if (isVideo(type)) {
    return { ...COLORS.AUDIO_VIDEO, Icon: FaFileVideo };
  }

  switch (type) {
    case 'application/msword':
    case 'application/vnd.ms-word':
    case 'application/vnd.oasis.opendocument.text':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      return { ...COLORS.DEFAULT, Icon: FaFileWord };
    }
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml':
    case 'application/vnd.oasis.opendocument.spreadsheet':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      return { ...COLORS.EXCEL_CODE, Icon: FaFileExcel };
    }
    case 'text/html':
    case 'application/json': {
      return { ...COLORS.EXCEL_CODE, Icon: FaFileCode };
    }
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml':
    case 'application/vnd.oasis.opendocument.presentation':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
      return { ...COLORS.POWERPOINT_PDF, Icon: FaFilePowerpoint };
    }
    case 'application/pdf': {
      return { ...COLORS.POWERPOINT_PDF, Icon: FaFilePdf };
    }
    case 'application/gzip':
    case 'application/zip':
    case 'application/x-zip-compressed':
    case 'application/octet-stream': {
      return { ...COLORS.ARCHIVE, Icon: FaFileArchive };
    }
    case 'text/plain':
    default: {
      return { ...COLORS.DEFAULT, Icon: FaFileAlt };
    }
  }
}

export default {
  generateFileKey,
  isUploadedFile,
  convertAttachmentsToBackendFormat,
  isVideo,
  isAudio,
  isImage,
  isAnyLoading,
  getFileUrl,
  getAttachmentIconProps
};
