import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { MdClose } from 'react-icons/md';
import { VideoPlayer, ToggleableInput } from 'components/common';
import { CardAttachment } from 'components/cards';
import { isVideo, isImage, isUploadedFile, getFileUrl } from 'utils/file';

import style from './card-attachments.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);


const CardAttachments = ({
  isEditable, attachments, onRemoveClick, onFileNameChange,
  token
}) => {
  const [isLightboxOpen, setLightboxOpenState] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const splitAttachments = (attachments) => {
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
    return (isEditable &&
      <div
        className={s('card-attachments-media-remove')}
        onClick={() => onRemoveClick(key)}
      >
        <MdClose />
      </div>
    );
  }

  const renderMediaToggleableInput = ({ name, key, url }) => {
    return (isEditable ?
      <ToggleableInput
        isEditable={isEditable}
        value={name}
        inputProps={{
          placeholder: 'File Name',
          onChange: e => onFileNameChange({ key, name: e.target.value }),
        }}
        className={s('truncate text-xs font-semibold text-center')}
      /> :
      <a
        href={url}
        target="_blank"
        className={s('block truncate text-xs font-semibold text-center')}
      >
        {name}
      </a>   
    );
  };

  const getAttachmentUrl = ({ key, mimetype }) => {
    return getFileUrl(key, token, mimetype);
  }

  const renderImageAttachment = ({ name, key, mimetype, isLoading, error }, i) => {
    const onClick = () => {
      setLightboxIndex(i);
      setLightboxOpenState(true);
    }

    const url = getAttachmentUrl({ key, mimetype });
    return (
      <div className={s('card-attachments-media-wrapper')} key={key}>
        { renderRemoveMediaButton(key) }
        <img
          src={url}
          className={s('w-full mb-xs cursor-pointer')}
          onClick={onClick}
        />
        { renderMediaToggleableInput({ name, key, url }) }
      </div>
    );
  };

  const renderVideoPlayer = ({ name, key, mimetype, isLoading, error }) => {
    const url = getAttachmentUrl({ key, mimetype });
    return (
      <div className={s('card-attachments-media-wrapper')} key={key}>
        { renderRemoveMediaButton(key) }
        <VideoPlayer
          url={url}
          className={s('w-full mb-xs')}
        />
        { renderMediaToggleableInput({ name, key, url }) }
      </div>
    );
  };

  const renderFiles = (files) => (
    <div className={s('flex flex-wrap')}>
      { files.map(({ name, mimetype, key, isLoading, error }, i) => (
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
          onFileNameChange={name => onFileNameChange({ key, name })}
          onRemoveClick={() => onRemoveClick(key)}
        />
      ))}
    </div>
  );

  const renderImages = (images) => (
    <>
      { images.length !== 0 &&
        <React.Fragment>
          <div className={s('card-attachments-subtitle')}> Images </div>
          { isLightboxOpen &&
            <Lightbox
              reactModalStyle={{ overlay: { zIndex: 100000000000 } }}
              mainSrc={getAttachmentUrl(images[lightboxIndex])}
              nextSrc={getAttachmentUrl(images[(lightboxIndex + 1) % images.length])}
              prevSrc={getAttachmentUrl(images[(lightboxIndex + images.length - 1) % images.length])}
              onCloseRequest={() => setLightboxOpenState(false)}
              onMovePrevRequest={() => setLightboxIndex((lightboxIndex + images.length - 1) % images.length)}
              onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
            />
          }
        </React.Fragment>
      }
      <div className={s('flex flex-wrap')}>
        { images.map(renderImageAttachment)}
      </div>
    </>
  );

  const renderScreenRecordings = (screenRecordings) => (
    <>
      { screenRecordings.length !== 0 &&
        <div className={s('card-attachments-subtitle')}> Screen Recordings </div>
      }
      <div className={s('flex flex-wrap')}>
        { screenRecordings.map(renderVideoPlayer)}
      </div>
    </>
  );

  const render = () => {
    const { files, images, screenRecordings } = splitAttachments(attachments);
    return (
      <>
        { attachments.length === 0 &&
          <div className={s('text-sm text-gray-light')}>
            No current attachments
          </div>
        }
        { renderFiles(files) }
        { renderImages(images) }
        { renderScreenRecordings(screenRecordings) }
      </>
    );    
  }

  return render();
}

CardAttachments.propTypes = {
  isEditable: PropTypes.bool,
  attachments: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    mimetype: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string   
  })).isRequired,
  onRemoveClick: PropTypes.func,
  onFileNameChange: PropTypes.func,
}

CardAttachments.defaultProps = {
  isEditable: false,
}

export default CardAttachments;

