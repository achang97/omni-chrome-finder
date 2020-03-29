import React from 'react';
import PropTypes from 'prop-types';
import { MdCloudUpload } from 'react-icons/md';

import Button from '../../common/Button';
import Dropzone from '../../common/Dropzone';

import attachmentsStyle from '../styles/attachments.css';
import attachmentDropzoneStyle from './attachment-dropzone.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(attachmentsStyle, attachmentDropzoneStyle);

const AttachmentDropzone = ({ onDrop, className, buttonClassName, showText }) => (
  <Dropzone
    className={s(`attachment-dropzone ${className}`)}
    onDrop={onDrop}
  >
    <Button
      className={s(`attachment-button attachment-dropzone-button ${buttonClassName}`)}
      text={showText ? 'Drag & Drop' : ''}
      textClassName={s('whitespace-no-wrap')}
      icon={<MdCloudUpload className={s(`${showText ? 'ml-sm' : ''} text-purple-reg`)} />}
      iconLeft={false}
    />
  </Dropzone>
);

AttachmentDropzone.propTypes = {
  onDrop: PropTypes.func,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  showText: PropTypes.bool,
}

AttachmentDropzone.defaultProps = {
  className: '',
  buttonClassName: '',
  showText: true,
}

export default AttachmentDropzone;
