import React from 'react';
import PropTypes from 'prop-types';
import { MdPriorityHigh } from 'react-icons/md';

import { Separator, Button } from 'components/common';
import { URL, WEB_APP_ROUTES } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';

import style from './disabled-alert.css';

const s = getStyleApplicationFn(style);

const DisabledAlert = ({ disabled, hasPaymentMethod, isAdmin, logout }) => {
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
    <div className={s('flex flex-col px-lg py-sm')}>
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
            <div className={s('flex justify-end')}>
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
      <Button text="Logout" onClick={logout} color="transparent" className={s('py-sm mt-sm')} />
    </div>
  );
};

DisabledAlert.propTypes = {
  // Redux State
  disabled: PropTypes.bool,
  hasPaymentMethod: PropTypes.bool,
  isAdmin: PropTypes.bool,

  // Redux Actions
  logout: PropTypes.func.isRequired
};

export default DisabledAlert;
