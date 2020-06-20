import React from 'react';
import PropTypes from 'prop-types';
import { FaRegDotCircle } from 'react-icons/fa';
import { IoIosSquare } from 'react-icons/io';

import { Tooltip, Button } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import attachmentsStyle from '../attachments.css';
import screenRecordButtonStyle from './screen-record-button.css';

const s = getStyleApplicationFn(attachmentsStyle, screenRecordButtonStyle);

const ScreenRecordButton = ({
  abbrText,
  showText,
  className,
  id,
  onSuccess,
  activeId,
  isSharingDesktop,
  initScreenRecording,
  endScreenRecording
}) => {
  const isActiveButton = id === activeId;

  let onClick;
  let text;
  let Icon;
  if (!isSharingDesktop || !isActiveButton) {
    onClick = () => initScreenRecording(id, onSuccess);
    text = abbrText ? 'Record' : 'Screen Record';
    Icon = FaRegDotCircle;
  } else {
    onClick = endScreenRecording;
    text = abbrText ? 'End' : 'End Recording';
    Icon = IoIosSquare;
  }

  return (
    <>
      <Tooltip
        show={!navigator.mediaDevices}
        tooltip="Screen recordings are not allowed on insecure websites."
        tooltipProps={{ type: 'error' }}
      >
        <Button
          onClick={onClick}
          className={s(`attachment-button screen-record-button ${className}`)}
          text={showText ? text : ''}
          underline
          underlineColor="red-200"
          icon={<Icon className={s(`${showText ? 'ml-sm' : ''} text-red-500`)} />}
          iconLeft={false}
          disabled={!navigator.mediaDevices || (activeId !== null && !isActiveButton)}
        />
      </Tooltip>
    </>
  );
};

ScreenRecordButton.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  showText: PropTypes.bool,
  abbrText: PropTypes.bool,
  onSuccess: PropTypes.func,

  // Redux State
  activeId: PropTypes.string,
  isSharingDesktop: PropTypes.bool.isRequired,

  // Redux Actions
  initScreenRecording: PropTypes.func.isRequired,
  endScreenRecording: PropTypes.func.isRequired
};

ScreenRecordButton.defaultProps = {
  className: '',
  showText: true,
  abbrText: false
};

export default ScreenRecordButton;
