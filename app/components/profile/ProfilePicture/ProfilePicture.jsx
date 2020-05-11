import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import { IoMdCamera } from 'react-icons/io';
import { Dropzone, Modal, PlaceholderImg, Loader } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import style from './profile-picture.css';

const s = getStyleApplicationFn(style);

const ProfilePicture = ({
  isEditable,
  user,
  isUpdatingPicture,
  requestUpdateProfilePicture,
  requestDeleteProfilePicture
}) => {
  const [uploadedImg, setUploadedImg] = useState();
  const [imgRef, setImgRef] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
  const [croppedImg, setCroppedImg] = useState(null);

  useEffect(() => {
    setUploadedImg(null);
  }, [user.profilePicture]);

  const onSelectFile = (files) => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUploadedImg(reader.result));
      reader.readAsDataURL(files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

  const createCropPreview = (image, newCrop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = newCrop.width;
    canvas.height = newCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      newCrop.x * scaleX,
      newCrop.y * scaleY,
      newCrop.width * scaleX,
      newCrop.height * scaleY,
      0,
      0,
      newCrop.width,
      newCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const makeClientCrop = (newCrop) => {
    if (imgRef && newCrop.width && newCrop.height) {
      createCropPreview(imgRef, newCrop, 'newFile.jpeg')
        .then((blob) => {
          setCroppedImg(blob);
        })
        .catch();
    }
  };

  const wrapDropzone = (children) => {
    if (!isEditable || isUpdatingPicture) {
      return children;
    }

    return (
      <Dropzone
        accept="image/*"
        onDrop={onSelectFile}
        useBaseStyle={false}
        style={{ outline: 'none' }}
      >
        {children}
      </Dropzone>
    );
  };

  const saveProfilePicture = () => {
    requestUpdateProfilePicture(croppedImg);
  };

  const render = () => {
    return (
      <>
        <div>
          {wrapDropzone(
            <div className={s('relative flex justify-center')}>
              <PlaceholderImg
                name={`${user.firstname} ${user.lastname}`}
                src={user.profilePicture}
                className={s(`profile-picture ${isEditable ? 'opacity-50 cursor-pointer' : ''}`)}
              />
              {isEditable &&
                (isUpdatingPicture ? (
                  <Loader size="xs" className={s('profile-picture-icon')} />
                ) : (
                  <IoMdCamera className={s('profile-picture-icon text-purple-reg')} />
                ))}
            </div>
          )}
          {isEditable && user.profilePicture && (
            <div
              className={s('mt-xs text-gray-light text-xs cursor-pointer')}
              onClick={requestDeleteProfilePicture}
            >
              Remove Picture
            </div>
          )}
        </div>
        <Modal
          isOpen={!!uploadedImg}
          onRequestClose={() => setUploadedImg(null)}
          title="Crop Profile Picture"
          primaryButtonProps={{
            text: 'Save Profile Picture',
            onClick: saveProfilePicture,
            isLoading: isUpdatingPicture
          }}
        >
          <div className={s('flex flex-col items-center')}>
            <ReactCrop
              src={uploadedImg}
              onImageLoaded={onLoad}
              crop={crop}
              circularCrop
              onChange={(c) => setCrop(c)}
              onComplete={makeClientCrop}
              imageStyle={{ maxHeight: 'none' }}
            />
          </div>
        </Modal>
      </>
    );
  };

  return render();
};

PropTypes.propTypes = {
  isEditable: PropTypes.bool,
  imageKey: PropTypes.string
};

PropTypes.defaultProps = {
  isEditable: false
};

export default ProfilePicture;
