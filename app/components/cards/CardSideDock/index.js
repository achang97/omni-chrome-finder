import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import Lightbox from 'react-image-lightbox';
import AnimateHeight from 'react-animate-height';
import moment from 'moment';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  closeCardSideDock,
  openCardModal,
  removeCardAttachment, updateCardAttachmentName,
  addCardOwner, removeCardOwner,
  updateCardTags, removeCardTag,
  updateCardKeywords,
  updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups,
} from '../../../actions/cards';

import { MdClose } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

import CardSection from '../CardSection';
import CardUsers from '../CardUsers';
import CardTags from '../CardTags';
import CardAttachment from '../CardAttachment';
import CardPermissions from '../CardPermissions';

import Select from '../../common/Select';
import Button from '../../common/Button';
import Loader from '../../common/Loader';
import VideoPlayer from '../../common/VideoPlayer';
import ToggleableInput from '../../common/ToggleableInput';

import { getBaseAnimationStyle } from '../../../utils/animate';
import { MODAL_TYPE, PERMISSION_OPTION, PERMISSION_OPTIONS, VERIFICATION_INTERVAL_OPTIONS, FADE_IN_TRANSITIONS, CARD_STATUS } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/select';
import { isJustMe } from '../../../utils/card';
import { isVideo, isImage, isUploadedFile, getFileUrl } from '../../../utils/file';

import style from './card-side-dock.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const SELECT_PERMISSION_OPTIONS = createSelectOptions(PERMISSION_OPTIONS);
const DATE_FORMAT = 'MMM DD, YYYY';
const SIDE_DOCK_TRANSITION_MS = 300;

const CardSideDock = (props) => {
  const permissionRef = useRef(null);
  const [isLightboxOpen, setLightboxOpenState] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const closeSideDock = () => {
    props.closeCardSideDock();
  };

  const getAttribute = (attribute) => {
    const { isEditing, edits } = props;
    return isEditing ? edits[attribute] : props[attribute];
  };

  const renderHeader = () => (
    <div className={s('flex justify-between text-purple-gray-50 mb-sm')}>
      <div className={s('text-xs')}> Card Information </div>
      <button onClick={closeSideDock}>
        <MdClose />
      </button>
    </div>
  );

  const renderOwners = (onlyShowPermissions) => {
    const { isEditing, addCardOwner, removeCardOwner } = props;
    const currOwners = getAttribute('owners');
    return (
      <AnimateHeight height={onlyShowPermissions ? 0 : 'auto'}>
        <CardSection className={s('mt-reg')} title="Owner(s)">
          <CardUsers
            isEditable={isEditing}
            users={currOwners}
            onAdd={addCardOwner}
            onRemoveClick={removeCardOwner}
            showTooltips
          />
        </CardSection>
      </AnimateHeight>
    );
  };

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
    const { isEditing, removeCardAttachment } = props;
    
    if (!isEditing) return null;
    
    return (
      <div
        className={s('card-side-dock-media-remove')}
        onClick={() => removeCardAttachment(key)}
      >
        <MdClose />
      </div>
    );
  }

  const renderMediaToggleableInput = ({ name, key, location }) => {
    const { isEditing, updateCardAttachmentName } = props;

    return ( isEditing ?
      <ToggleableInput
        isEditable={isEditing}
        value={name}
        inputProps={{
          placeholder: 'File Name',
          onChange: e => updateCardAttachmentName(key, e.target.value),
        }}
        className={s('truncate text-xs font-semibold text-center')}
      /> :
      <a
        href={location}
        target="_blank"
        className={s('block truncate text-xs font-semibold text-center')}
      >
        {name}
      </a>   
    );
  };

  const renderImageAttachment = ({ name, key, mimetype, isLoading, error }, i) => {
    const { isEditing, updateCardAttachmentName, token } = props;

    const onClick = () => {
      setLightboxIndex(i);
      setLightboxOpenState(true);
    }

    const url = getFileUrl(key, mimetype, token);
    return (
      <div className={s('card-side-dock-media-wrapper')} key={key}>
        { renderRemoveMediaButton(key) }
        <img
          src={url}
          className={s('w-full mb-xs cursor-pointer')}
          onClick={onClick}
        />
        { renderMediaToggleableInput({ name, key, location }) }
      </div>
    );
  };

  const renderVideoPlayer = ({ name, key, mimetype, isLoading, error }) => {
    const { isEditing, updateCardAttachmentName, token } = props;

    const url = getFileUrl(key, mimetype, token);
    return (
      <div className={s('card-side-dock-media-wrapper')} key={key}>
        { renderRemoveMediaButton(key) }
        <VideoPlayer
          url={url}
          className={s('w-full mb-xs')}
        />
        { renderMediaToggleableInput({ name, key, location }) }
      </div>
    );
  };

  const renderAttachments = () => {
    const { removeCardAttachment, updateCardAttachmentName, isEditing } = props;
    const currAttachments = getAttribute('attachments');

    const { files, screenRecordings, images } = splitAttachments(currAttachments);

    return (
      <CardSection className={s('mt-lg')} title="Attachments">
        { currAttachments.length === 0 &&
          <div className={s('text-sm text-gray-light')}>
            No current attachments
          </div>
        }
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
              isEditable={isEditing}
              onFileNameChange={fileName => updateCardAttachmentName(key, fileName)}
              onRemoveClick={() => removeCardAttachment(key)}
            />
          ))}
        </div>

        { images.length !== 0 &&
          <React.Fragment>
            <div className={s('card-side-dock-subtitle')}> Images </div>
            { isLightboxOpen &&
              <Lightbox
                reactModalStyle={{ overlay: { zIndex: 100000000000 } }}
                mainSrc={images[lightboxIndex].location}
                nextSrc={images[(lightboxIndex + 1) % images.length].location}
                prevSrc={images[(lightboxIndex + images.length - 1) % images.length].location}
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

        { screenRecordings.length !== 0 &&
          <div className={s('card-side-dock-subtitle')}> Screen Recordings </div>
        }
        <div className={s('flex flex-wrap')}>
          { screenRecordings.map(renderVideoPlayer)}
        </div>
      </CardSection>
    );
  };

  const renderTags = (onlyShowPermissions) => {
    const { isEditing, updateCardTags, removeCardTag } = props;
    const currTags = getAttribute('tags');

    return (
      <AnimateHeight height={onlyShowPermissions ? 0 : 'auto'}>
        <CardSection className={s('mt-lg')} title="Tags">
          <CardTags
            isEditable={isEditing}
            tags={currTags}
            onChange={updateCardTags}
            onRemoveClick={removeCardTag}
            showPlaceholder
          />
        </CardSection>
      </AnimateHeight>
    );
  };

  const renderKeywords = () => {
    const { isEditing, updateCardKeywords } = props;
    const currKeywords = getAttribute('keywords');
    return (
      <CardSection className={s('mt-lg')} title="Keywords">
        { isEditing ?
          <Select
            value={currKeywords}
            onChange={updateCardKeywords}
            isSearchable
            isMulti
            menuShouldScrollIntoView
            isClearable={false}
            placeholder={'Add keywords...'}
            type="creatable"
            components={{ DropdownIndicator: null }}
            noOptionsMessage={({ inputValue }) => currKeywords.some(keyword => keyword.value === inputValue) ?
              'Keyword already exists' : 'Begin typing to add a keyword'
            }
          /> :
          <div>
            { currKeywords.length === 0 &&
              <div className={s('text-sm text-gray-light')}>
                No current keywords
              </div>
            }
            <div className={s('flex flex-wrap')}>
              { currKeywords.map(({ label, value }, i) => (
                <div key={value} className={s('text-sm mr-sm mb-sm truncate text-purple-reg underline-border border-purple-gray-10')}>
                  {value}{i !== currKeywords.length - 1 && ','}
                </div>
              ))}
            </div>
          </div>
        }
      </CardSection>
    );
  };

  const handleHideSections = ({ newHeight }) => {
    if (newHeight !== 0) {
      permissionRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const renderAdvanced = (onlyShowPermissions) => {
    const { isEditing, permissions, updateCardPermissions, updateCardPermissionGroups, updateCardVerificationInterval } = props;
    const currVerificationInterval = getAttribute('verificationInterval');
    const currPermissions = getAttribute('permissions');
    const currPermissionGroups = getAttribute('permissionGroups');

    return (
      <CardSection className={s('mt-lg')} title="Advanced">
        <AnimateHeight
          height={onlyShowPermissions ? 0 : 'auto'}
          onAnimationEnd={handleHideSections}
        >
          <div className={s('mb-sm')}>
            <div className={s('text-gray-reg text-xs mb-sm')}> Verification Interval </div>
            { isEditing ?
              <Select
                value={currVerificationInterval}
                onChange={updateCardVerificationInterval}
                options={VERIFICATION_INTERVAL_OPTIONS}
                placeholder="Select verification interval..."
                isSearchable
                menuShouldScrollIntoView
              /> :
              <div className={s('underline-border border-purple-gray-20 mb-sm text-purple-reg text-sm inline-block')}>
                {currVerificationInterval.label}
              </div>
            }
          </div>
        </AnimateHeight>
        <div ref={permissionRef}>
          <div className={s('text-gray-reg text-xs mb-sm')}>
            Permissions
          </div>
          <CardPermissions
            selectedPermission={currPermissions}
            onChangePermission={updateCardPermissions}
            permissionGroups={currPermissionGroups}
            onChangePermissionGroups={updateCardPermissionGroups}
            isDisabled={!isEditing}
            showJustMe={permissions.value === PERMISSION_OPTION.JUST_ME}
          />
        </div>
      </CardSection>
    );
  };

  const renderFooter = () => {
    const { isDeletingCard, openCardModal, createdAt, updatedAt } = props;
    return (
      <div className={s('pt-lg')}>
        <div className={s('text-sm font-medium')}>
          <div className={s('flex justify-between items-center')}>
            <div className={s('text-gray-reg')}> Created on: </div>
            <div className={s('text-purple-gray-50')}> {moment(createdAt).format(DATE_FORMAT)} </div>
          </div>
          <div className={s('flex justify-between items-center mt-sm')}>
            <div className={s('text-gray-reg')}> Last edited: </div>
            <div className={s('text-purple-gray-50')}> {moment(updatedAt).format(DATE_FORMAT)} </div>
          </div>
        </div>
        <Button
          className={s('justify-between mt-lg bg-white text-red-500')}
          text="Delete This Card"
          underline
          onClick={() => openCardModal(MODAL_TYPE.CONFIRM_DELETE)}
          underlineColor="red-200"
          disabled={isDeletingCard}
          icon={<FaRegTrashAlt />}
          iconLeft={false}
        />
      </div>
    );
  };

  const renderOverlay = () => {
    const { sideDockOpen } = props;

    const baseStyle = getBaseAnimationStyle(SIDE_DOCK_TRANSITION_MS);

    return (
      <Transition
        in={sideDockOpen}
        timeout={SIDE_DOCK_TRANSITION_MS}
        mountOnEnter
        unmountOnExit
      >
        {state => (
          <div className={s('card-side-dock-overlay')} style={{ ...baseStyle, ...FADE_IN_TRANSITIONS[state] }} onClick={closeSideDock} />
        )}
      </Transition>
    );
  };

  const render = () => {
    const { sideDockOpen, status, edits } = props;

    const baseStyle = getBaseAnimationStyle(SIDE_DOCK_TRANSITION_MS);
    const transitionStyles = {
      entering: { transform: 'translateX(0%)' },
      entered: { transform: 'translateX(0%)' },
      exiting: { transform: 'translateX(100%)' },
      exited: { transform: 'translateX(100%)' },
    };

    const isNewCard = status === CARD_STATUS.NOT_DOCUMENTED;
    const onlyShowPermissions = isJustMe(getAttribute('permissions'));

    return (
      <div className={s('card-side-dock-container')}>
        { renderOverlay() }
        <Transition
          in={sideDockOpen}
          timeout={SIDE_DOCK_TRANSITION_MS}
          mountOnEnter
          unmountOnExit
        >
          {state => (
            <div className={s('card-side-dock overflow-auto')} style={{ ...baseStyle, ...transitionStyles[state] }}>
              { renderHeader() }
              { !isNewCard && renderOwners(onlyShowPermissions) }
              { renderAttachments() }
              { !isNewCard && renderTags(onlyShowPermissions) }
              { !isNewCard && renderKeywords() }
              { !isNewCard && renderAdvanced(onlyShowPermissions) }
              { !isNewCard && renderFooter() }
            </div>
          )}
        </Transition>
      </div>
    );
  };

  return render();
};

export default connect(
  state => ({
    ...state.cards.activeCard,
    token: state.auth.token,
  }),
  dispatch => bindActionCreators({
    closeCardSideDock,
    openCardModal,
    addCardOwner,
    removeCardOwner,
    removeCardAttachment,
    updateCardAttachmentName,
    updateCardTags,
    removeCardTag,
    updateCardKeywords,
    updateCardVerificationInterval,
    updateCardPermissions,
    updateCardPermissionGroups,
  }, dispatch)
)(CardSideDock);
