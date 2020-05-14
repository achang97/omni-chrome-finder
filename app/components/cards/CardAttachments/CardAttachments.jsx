import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { MdClose } from 'react-icons/md';
import { VideoPlayer, ToggleableInput } from 'components/common';
import { isVideo, isImage, isUploadedFile, getFileUrl } from 'utils/file';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-attachments.css';

import CardAttachment from '../CardAttachment';

const s = getStyleApplicationFn(style);

const CardAttachments = ({ isEditable, attachments, onRemoveClick, onFileNameChange, token }) => {
  const [isLightboxOpen, setLightboxOpenState] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const splitAttachments = () => {
    const files = [];
    const screenRecordings = [];
    const images = [];

    attachments.forEach((attachment) => {
      const isUploaded = isUploadedFile(attachment.key);
      if (isUploaded && isVideo(attachment.mimetype)) {
        screenRecordings.push(attachment);
      } else if (isUploaded && isImage(attachment.mimetype)) {
        images.push(attachment);
      } else {
        files.push(attachment);
      }
    });

    return { files, screenRecordings, images };
  };

  const renderRemoveMediaButton = (key) => {
    return (
      isEditable && (
        <div className={s('card-attachments-media-remove')} onClick={() => onRemoveClick(key)}>
          <MdClose />
        </div>
      )
    );
  };

  const renderMediaToggleableInput = (attachment) => {
    const { name, key, url } = attachment;

    return isEditable ? (
      <ToggleableInput
        isEditable={isEditable}
        value={name}
        inputProps={{
          placeholder: 'File Name',
          onChange: (e) => onFileNameChange({ key, name: e.target.value })
        }}
        className={s('truncate text-xs font-semibold text-center')}
        placeholder="No file name"
      />
    ) : (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={s('block truncate text-xs font-semibold text-center')}
      >
        {name || 'No file name'}
      </a>
    );
  };

  const getAttachmentUrl = ({ key, mimetype }) => {
    return getFileUrl(key, token, mimetype);
  };

  const renderImageAttachment = (attachment, i) => {
    const { name, key, mimetype } = attachment;
    const onClick = () => {
      setLightboxIndex(i);
      setLightboxOpenState(true);
    };

    const url = getAttachmentUrl({ key, mimetype });
    return (
      <div className={s('card-attachments-media-wrapper')} key={key}>
        {renderRemoveMediaButton(key)}
        <div className={s('w-full mb-xs cursor-pointer')} onClick={onClick}>
          <img src={url} className={s('w-full')} alt={name} />
        </div>
        {renderMediaToggleableInput({ name, key, url })}
      </div>
    );
  };

  const renderVideoPlayer = (attachment) => {
    const { name, key, mimetype } = attachment;
    const url = getAttachmentUrl({ key, mimetype });
    return (
      <div className={s('card-attachments-media-wrapper')} key={key}>
        {renderRemoveMediaButton(key)}
        <VideoPlayer url={url} className={s('w-full mb-xs')} />
        {renderMediaToggleableInput({ name, key, url })}
      </div>
    );
  };

  const renderFiles = (files) => (
    <div className={s('flex flex-wrap')}>
      {files.map(({ name, mimetype, key, isLoading, error }) => (
        <CardAttachment
          key={key}
          fileKey={key}
          type={mimetype}
          fileName={name}
          isLoading={isLoading}
          error={error}
          className={s('min-w-0')}
          textClassName={s('truncate')}
          isEditable={isEditable}
          onFileNameChange={(newName) => onFileNameChange({ key, name: newName })}
          onRemoveClick={() => onRemoveClick(key)}
        />
      ))}
    </div>
  );

  const renderImages = (images) => (
    <>
      {images.length !== 0 && (
        <>
          <div className={s('card-attachments-subtitle')}> Images </div>
          {isLightboxOpen && (
            <Lightbox
              reactModalStyle={{ overlay: { zIndex: 100000000000 } }}
              mainSrc={getAttachmentUrl(images[lightboxIndex])}
              nextSrc={getAttachmentUrl(images[(lightboxIndex + 1) % images.length])}
              prevSrc={getAttachmentUrl(
                images[(lightboxIndex + images.length - 1) % images.length]
              )}
              onCloseRequest={() => setLightboxOpenState(false)}
              onMovePrevRequest={() =>
                setLightboxIndex((lightboxIndex + images.length - 1) % images.length)
              }
              onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
            />
          )}
        </>
      )}
      <div className={s('flex flex-wrap')}>{images.map(renderImageAttachment)}</div>
    </>
  );

  const renderScreenRecordings = (screenRecordings) => (
    <>
      {screenRecordings.length !== 0 && (
        <div className={s('card-attachments-subtitle')}> Screen Recordings </div>
      )}
      <div className={s('flex flex-wrap')}>{screenRecordings.map(renderVideoPlayer)}</div>
    </>
  );

  const render = () => {
    const { files, images, screenRecordings } = splitAttachments();
    return (
      <>
        {attachments.length === 0 && (
          <div className={s('text-sm text-gray-light')}>No current attachments</div>
        )}
        {renderFiles(files)}
        {renderImages(images)}
        {renderScreenRecordings(screenRecordings)}
      </>
    );
  };

  return render();
};

CardAttachments.propTypes = {
  isEditable: PropTypes.bool,
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      mimetype: PropTypes.string.isRequired,
      isLoading: PropTypes.bool,
      error: PropTypes.string
    })
  ).isRequired,
  onRemoveClick: PropTypes.func,
  onFileNameChange: PropTypes.func
};

CardAttachments.defaultProps = {
  isEditable: false
};

export default CardAttachments;
