import React from 'react';
import PropTypes from 'prop-types';
import { MdAttachFile } from 'react-icons/md';

import { Button, Badge, Loader, Dropdown } from 'components/common';
import CardAttachment from 'components/cards/CardAttachment';

import { isAnyLoading } from 'utils/file';

import { getStyleApplicationFn } from 'utils/style';
import style from './attachment-dropdown.css';

const s = getStyleApplicationFn(style);

const AttachmentDropdown = ({ attachments, onFileNameChange, onRemoveClick, className }) => (
  <Dropdown
    className={s(`${className}`)}
    toggler={
      <div className={s('relative')}>
        <Button
          className={s('bg-white py-reg px-sm text-purple-reg')}
          icon={
            isAnyLoading(attachments) ? (
              <Loader size="xs" className="attachment-dropdown-icon" />
            ) : (
              <MdAttachFile className={s('attachment-dropdown-icon')} />
            )
          }
        />
        <Badge count={attachments.length} />
      </div>
    }
    body={
      <div className={s('attachment-dropdown')}>
        {attachments.length === 0 && <div className={s('text-center')}>No current attachments</div>}
        {attachments.map(({ name, key, mimetype, isLoading, error }) => (
          <CardAttachment
            key={key}
            fileKey={key}
            type={mimetype}
            fileName={name}
            isLoading={isLoading}
            error={error}
            textClassName={s('truncate')}
            removeIconClassName={s('ml-auto')}
            isEditable
            onFileNameChange={(fileName) => onFileNameChange({ key, fileName })}
            onRemoveClick={() => onRemoveClick(key)}
          />
        ))}
      </div>
    }
  />
);

AttachmentDropdown.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      mimetype: PropTypes.string.isRequired,
      location: PropTypes.string,
      isLoading: PropTypes.bool,
      error: PropTypes.string
    })
  ).isRequired,
  onFileNameChange: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

AttachmentDropdown.defaultProps = {
  className: ''
};

export default AttachmentDropdown;
