import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip'

import CardTag from '../CardTags/CardTag';
import Loader from '../../common/Loader';
import {
  FaFileImage, FaFileAudio, FaFileVideo,
  FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint,
  FaFileAlt, FaFileCode, FaFileArchive,
} from 'react-icons/fa';
import { MdClose, MdError, MdFileDownload } from 'react-icons/md';

import { NOOP } from '../../../utils/constants';
 
import style from './card-attachment.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const COLORS = {
  IMAGE: { color: 'purple-reg', underlineColor: 'purple-grey-50' },
  AUDIO_VIDEO: { color: 'red-500', underlineColor: 'red-200' },
  EXCEL_CODE: { color: 'green-500', underlineColor: 'green-200' },
  POWERPOINT_PDF: { color: 'orange-500', underlineColor: 'orange-200' },
  ARCHIVE: { color: 'gray-500', underlineColor: 'gray-200' },
  DEFAULT: { color: 'blue-500', underlineColor: 'blue-200' }
}

function getAttachmentProps(type) {
  if (type && type.startsWith('image')) {
    return { ...COLORS.IMAGE, Icon: FaFileImage };
  } else if (type && type.startsWith('audio')) {
    return { ...COLORS.AUDIO_VIDEO, Icon: FaFileAudio };
  } else if (type && type.startsWith('video')) {
    return { ...COLORS.AUDIO_VIDEO, Icon: FaFileVideo };
  } else {
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
      case 'application/zip':
      case 'application/octet-stream': {
        return { ...COLORS.ARCHIVE, Icon: FaFileArchive };
      }
      case 'text/plain':
      default: {
        return { ...COLORS.DEFAULT, Icon: FaFileAlt }
      }
    }
  }
}

const CardAttachment = ({ fileName, type, url, onClick, onRemoveClick, className, textClassName, removeIconClassName, typeIconClassName, isEditable, onFileNameChange, isLoading, error, ...rest }) => {
  const [isHoveringIcon, setHoverIcon] = useState(false);
  const [isEditingFileName, toggleEditFileName] = useState(false);

  const onRemove = (e) => {
    e.stopPropagation();
    onRemoveClick();
  }

  const { color, underlineColor, Icon } = getAttachmentProps(type);
  const fileNameClassName = s(`underline-border ${error ? 'border-red-200' : `border-${underlineColor}`} ${textClassName}`);

  const isDownloadable = isHoveringIcon && url;
  const isInputTogglable = isEditable && !isLoading;

  let leftIcon;
  if (isLoading) {
    leftIcon = <Loader size={10} />;
  } else if (error) {
    leftIcon = <MdError />;
  } else if (isDownloadable) {
    leftIcon = <MdFileDownload />;
  } else {
    leftIcon = <Icon />;
  }

  return (
    <div data-tip data-for="card-attachment" onClick={onClick} className={s(`card-attachment ${error ? 'text-red-500' : `text-${color}`} ${className}`)} {...rest}>
      <div
        className={s(`card-attachment-file-icon ${isDownloadable ? 'button-hover' : ''} ${typeIconClassName}`)}
        onMouseEnter={() => setHoverIcon(true)}
        onMouseLeave={() => setHoverIcon(false)}
      >
        { isDownloadable ? 
          <a href={url} download> {leftIcon} </a> :
          leftIcon
        }
      </div>
      <div className={s('card-attachment-filename-wrapper')}>
        { isEditingFileName && isEditable ?
          <input
            placeholder="File Name"
            value={fileName}
            autoFocus
            onChange={e => onFileNameChange(e.target.value)}
            onBlur={() => toggleEditFileName(false)}
          /> :
          <div className={s(`card-attachment-filename ${isInputTogglable ? 'button-hover' : ''} ${fileNameClassName}`)} onClick={() => isInputTogglable && toggleEditFileName(true)}>
            {fileName}
          </div>
        }
      </div>
      { isEditable && onRemoveClick && !isLoading &&
        <MdClose onClick={onRemove} className={s(`card-attachment-remove-icon button-hover ${removeIconClassName}`)} />
      }
      { error &&
        <ReactTooltip id="card-attachment" type="error" effect="float">
          <span className={s("font-normal text-xs")}> {error} </span>
        </ReactTooltip>
      }
    </div> 
  )
}

CardAttachment.propTypes = {
  fileName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  url: PropTypes.string,
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
}

CardAttachment.defaultProps = {
  className: '',
  textClassName: '',
  removeIconClassName: '',
  typeIconClassName: '',
  isLoading: false,
  isEditable: false,
  onFileNameChange: NOOP,
}

export default CardAttachment;