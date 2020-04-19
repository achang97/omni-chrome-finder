import React, { useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import { Dropzone } from 'components/common';

const ProfilePicture = ({ }) => {
  const [upImg, setUpImg] = useState();
  const [imgRef, setImgRef] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
  const [previewUrl, setPreviewUrl] = useState();

  const onSelectFile = (files) => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(files[0]);
    }
  };

  const onLoad = useCallback(img => {
    setImgRef(img);
  }, []);

  const makeClientCrop = async crop => {
    if (imgRef && crop.width && crop.height) {
      createCropPreview(imgRef, crop, 'newFile.jpeg');
    }
  };

  const createCropPreview = async (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(previewUrl);
        setPreviewUrl(window.URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };



  return (
    <>
      <Dropzone
        accept="image/*"
        onDrop={onSelectFile}
      >
        test
      </Dropzone>
      <ReactCrop
        src={upImg}
        onImageLoaded={onLoad}
        crop={crop}
        circularCrop
        onChange={c => setCrop(c)}
        onComplete={makeClientCrop}
      />
    </>
  );
};

// <PlaceholderImg name={`${user.firstname} ${user.lastname}`} src={user.img} className={s(`profile-profile-picture rounded-full ${isEditingAbout ? 'opacity-50' : ''}`)} />
// {
//   isEditingAbout ?
//     <div className={s('absolute profile-edit-photo-icon bg-purple-light rounded-full profile-edit-container flex cursor-pointer')}>
//       <IoMdCamera className={s('text-purple-reg m-auto')} />
//     </div> :
//     <div
//       className={s('absolute bottom-0 right-0 bg-purple-light rounded-full profile-edit-container flex cursor-pointer')}
//       onClick={() => editUser()}
//     >
//       <MdEdit className={s('text-purple-reg m-auto')} />
//     </div>
// }

export default ProfilePicture;
