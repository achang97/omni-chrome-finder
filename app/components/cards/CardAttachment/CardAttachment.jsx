import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
import { MdClose, MdError, MdOpenInNew } from 'react-icons/md';

import { Loader, ToggleableInput, Tooltip } from 'components/common';
import { isVideo, isImage, isAudio, getFileUrl } from 'utils/file';
import { NOOP } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-attachment.css';

const s = getStyleApplicationFn(style);

const COLORS = {
  IMAGE: { color: 'purple-reg', underlineColor: 'purple-grey-50' },
  AUDIO_VIDEO: { color: 'red-500', underlineColor: 'red-200' },
  EXCEL_CODE: { color: 'green-500', underlineColor: 'green-200' },
  POWERPOINT_PDF: { color: 'orange-500', underlineColor: 'orange-200' },
  ARCHIVE: { color: 'gray-500', underlineColor: 'gray-200' },
  DEFAULT: { color: 'blue-500', underlineColor: 'blue-200' }
};

function getAttachmentProps(type) {
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

const CardAttachment = ({
  fileName,
  fileKey,
  type,
  onClick,
  onRemoveClick,
  className,
  textClassName,
  removeIconClassName,
  typeIconClassName,
  isEditable,
  onFileNameChange,
  isLoading,
  error,
  token
}) => {
  const [isHoveringIcon, setHoverIcon] = useState(false);

  const onRemove = (e) => {
    e.stopPropagation();
    onRemoveClick();
  };

  const { color, underlineColor, Icon } = getAttachmentProps(type);
  const fileNameClassName = s(
    `underline-border ${error ? 'border-red-200' : `border-${underlineColor}`} ${textClassName}`
  );

  const url = getFileUrl(fileKey, token, type);
  const isDownloadable = isHoveringIcon && !isLoading && url;

  let leftIcon;
  if (isLoading) {
    leftIcon = <Loader size="xs" />;
  } else if (error) {
    leftIcon = <MdError />;
  } else if (isDownloadable) {
    leftIcon = <MdOpenInNew />;
  } else {
    leftIcon = <Icon />;
  }

  return (
    <Tooltip show={error} tooltip={error} tooltipProps={{ type: 'error' }}>
      <div
        onClick={onClick}
        className={s(`card-attachment ${error ? 'text-red-500' : `text-${color}`} ${className}`)}
      >
        <div
          className={s(
            `card-attachment-file-icon ${isDownloadable ? 'button-hover' : ''} ${typeIconClassName}`
          )}
          onMouseEnter={() => setHoverIcon(true)}
          onMouseLeave={() => setHoverIcon(false)}
        >
          {isDownloadable ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {leftIcon}
            </a>
          ) : (
            leftIcon
          )}
        </div>
        <ToggleableInput
          isEditable={isEditable}
          disabled={isLoading}
          value={fileName}
          inputProps={{
            placeholder: 'File Name',
            onChange: (e) => onFileNameChange(e.target.value),
            className: s('flex-1')
          }}
          className={fileNameClassName}
          placeholder="No file name"
        />
        {isEditable && onRemoveClick && !isLoading && (
          <MdClose
            onClick={onRemove}
            className={s(`card-attachment-remove-icon button-hover ${removeIconClassName}`)}
          />
        )}
      </div>
    </Tooltip>
  );
};

CardAttachment.propTypes = {
  fileKey: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  error: PropTypes.string,
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  removeIconClassName: PropTypes.string,
  typeIconClassName: PropTypes.string,
  isLoading: PropTypes.bool,
  isEditable: PropTypes.bool,
  onFileNameChange: PropTypes.func,
  token: PropTypes.string.isRequired
};

CardAttachment.defaultProps = {
  className: '',
  textClassName: '',
  removeIconClassName: '',
  typeIconClassName: '',
  error: null,
  onClick: NOOP,
  onRemoveClick: null,
  isLoading: false,
  isEditable: false,
  onFileNameChange: NOOP
};

export default CardAttachment;
