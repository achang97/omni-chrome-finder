import React from 'react';
import PropTypes from 'prop-types';
import { MdPriorityHigh } from 'react-icons/md';

import { Separator } from 'components/common';
import { URL, WEB_APP_ROUTES } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';

import style from './disabled-alert.css';

const s = getStyleApplicationFn(style);

const DisabledAlert = ({ disabled, hasPaymentMethod, isAdmin }) => {
  if (!disabled) {
    return null;
  }

  let reason;
  if (!hasPaymentMethod) {
    reason = 'Missing Payment Method';
  } else {
    reason = 'Failed Payment';
  }

  return (
    <div className={s('disabled-alert')}>
      <div className={s('flex items-center')}>
        <div className={s('disabled-alert-icon')}>
          <MdPriorityHigh />
        </div>
        <div className={s('flex-1')}>
          Your Omni account has been disabled for the following reason: <b>{reason}</b>
        </div>
      </div>
      {isAdmin && (
        <>
          <Separator horizontal className={s('my-lg')} />
          <div className="flex justify-end">
            <a
              href={`${URL.WEB_APP}${WEB_APP_ROUTES.BILLING}`}
              target="_blank"
              rel="noopener noreferrer"
              className={s('text-blue-500 underline')}
            >
              Update Billing
            </a>
          </div>
        </>
      )}
    </div>
  );
};

DisabledAlert.propTypes = {
  // Redux State
  disabled: PropTypes.bool,
  hasPaymentMethod: PropTypes.bool,
  isAdmin: PropTypes.bool
};

export default DisabledAlert;
