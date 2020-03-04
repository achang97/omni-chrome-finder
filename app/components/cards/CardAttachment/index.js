import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip'

import CardTag from '../CardTags/CardTag';
import Loader from '../../common/Loader';

import { IoIosVideocam } from 'react-icons/io';
import { AiFillPicture } from 'react-icons/ai';
import { FaFileAlt } from 'react-icons/fa';
import { MdClose, MdError } from 'react-icons/md';
 
import style from './card-attachment.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const getAttachmentProps = (type) => {
  switch (type) {
    case 'video':
      return { color: 'red-500', underlineColor: 'red-200', Icon: IoIosVideocam }
    case 'image':
      return { color: 'purple-reg', underlineColor: 'purple-grey-50', Icon: AiFillPicture }
    default:
      return { color: 'blue-500', underlineColor: 'blue-200', Icon: FaFileAlt }
  }
}

const CardAttachment = ({ fileName, url, onClick, onRemoveClick, className, textClassName, removeIconClassName, fileTypeIconClassName, isLoading, error, ...rest }) => {
  const onRemove = (e) => {
    e.stopPropagation();
    onRemoveClick();
  }

  const { color, underlineColor, Icon } = getAttachmentProps();
  const fileNameClassName = s(`underline-border ${error ? 'border-red-200' : `border-${underlineColor}`} ${textClassName}`);

  let leftIcon;
  if (isLoading) {
    leftIcon = <Loader size={10} />;
  } else if (error) {
    leftIcon = <MdError />;
  } else {
    leftIcon = <Icon />;
  }

  return (
    <div data-tip data-for="card-attachment" onClick={onClick} className={s(`card-attachment button-hover ${error ? 'text-red-500' : `text-${color}`} ${className}`)} {...rest}>
      <div className={s(`card-attachment-file-icon ${fileTypeIconClassName}`)}> { leftIcon } </div>
      { url ?
        <a href={url} download className={fileNameClassName}> {fileName} </a> :
        <div className={fileNameClassName}> {fileName} </div>
      }
      { onRemoveClick &&
        <MdClose onClick={onRemove} className={s(`card-attachment-remove-icon ${removeIconClassName}`)} />
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
  url: PropTypes.string,
  error: PropTypes.string,
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  removeIconClassName: PropTypes.string,
  fileTypeIconClassName: PropTypes.string,
  isLoading: PropTypes.bool,
}

CardAttachment.defaultProps = {
  className: '',
  textClassName: '',
  removeIconClassName: '',
  fileTypeIconClassName: '',
  isLoading: false,
}

export default CardAttachment;