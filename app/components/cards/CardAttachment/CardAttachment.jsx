import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdClose, MdError, MdOpenInNew } from 'react-icons/md';

import { Loader, ToggleableInput, Tooltip } from 'components/common';
import { getAttachmentIconProps, getFileUrl } from 'utils/file';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-attachment.css';

const s = getStyleApplicationFn(style);

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

  const { color, underlineColor, Icon } = getAttachmentIconProps(type);
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
            onChange: (e) => onFileNameChange && onFileNameChange(e.target.value),
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

  // Redux State
  token: PropTypes.string.isRequired
};

CardAttachment.defaultProps = {
  className: '',
  textClassName: '',
  removeIconClassName: '',
  typeIconClassName: '',
  error: null,
  onRemoveClick: null,
  isLoading: false,
  isEditable: false
};

export default CardAttachment;
