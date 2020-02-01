import React from 'react';
import PropTypes from 'prop-types';

import CardTag from '../CardTags/CardTag';

import { IoIosVideocam } from 'react-icons/io';
import { AiOutlinePicture } from 'react-icons/ai';
import { FaFileAlt } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

import style from './card-attachment.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const getAttachmentProps = (type) => {
  switch (type) {
    case 'video':
      return { color: 'red-500', underlineColor: 'red-200', Icon: IoIosVideocam }
    case 'image':
      return { color: 'purple-reg', underlineColor: 'purple-grey-50', Icon: AiOutlinePicture }
    case 'file':
      return { color: 'blue-500', underlineColor: 'blue-200', Icon: FaFileAlt }
    default:
      return {}
  }
}

const CardAttachment = ({ filename, type, onClick, onRemoveClick, className, ...rest }) => {
  const onRemove = (e) => {
    e.stopPropagation();
    onRemoveClick();
  }

  const { color, underlineColor, Icon } = getAttachmentProps(type);

  return (
    <div onClick={onClick} {...rest} className={s(`card-attachment button-hover text-${color} ${className}`)}>
      <Icon className={s("mr-xs")} />
      <div className={s(`underline-border border-${underlineColor}`)}> {filename} </div>
      { onRemoveClick &&
        <MdClose onClick={onRemove} className={s("ml-xs")} />
      }
    </div> 
  )
}

CardAttachment.propTypes = {
  filename: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["video", "image", "file"]),
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  className: PropTypes.string,
}

CardAttachment.defaultProps = {
  className: '',
}

export default CardAttachment;