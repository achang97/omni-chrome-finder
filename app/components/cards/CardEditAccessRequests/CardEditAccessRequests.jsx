import React from 'react';
import PropTypes from 'prop-types';

import { CardUser } from 'components/cards';
import { HelpTooltip, Message, Loader } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const CardEditAccessRequests = ({
  requests,
  className,
  error,
  isLoading,
  requestApproveEditAccess,
  requestRejectEditAccess
}) => {
  if (!requests || requests.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className={s('flex items-center justify-between')}>
        <div className={s('text-xs mb-sm text-gray-reg')}>
          {requests.length} Pending Request(s) to Edit
        </div>
        {isLoading && <Loader size="xs" />}
      </div>
      {requests.map(({ _id, notifier, data }) => (
        <div className={s('flex items-center text-xs')} key={_id}>
          <CardUser
            name={`${notifier.firstname} ${notifier.lastname}`}
            src={notifier.profilePicture}
            showName={false}
            showTooltip
            size="xs"
          />
          <div className={s('ml-sm truncate')}> {notifier.firstname} </div>
          {data.reason && <HelpTooltip tooltip={data.reason} className={s('ml-sm')} />}
          <div className={s('ml-auto flex items-center')}>
            <div
              className={s('underline-border border-red-100 text-red-500 cursor-pointer')}
              onClick={() => requestRejectEditAccess(notifier._id)}
            >
              Deny
            </div>
            <div
              className={s('ml-sm underline-border border-green-100 text-green-500 cursor-pointer')}
              onClick={() => requestApproveEditAccess(notifier)}
            >
              Approve
            </div>
          </div>
        </div>
      ))}
      <Message type="error" message={error} className={s('mt-sm text-xs')} />
    </div>
  );
};

CardEditAccessRequests.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      card: PropTypes.object.isRequired,
      notifier: PropTypes.object.isRequired,
      data: PropTypes.shape({
        reason: PropTypes.string
      })
    })
  ),
  className: PropTypes.string,
  error: PropTypes.string,
  isLoading: PropTypes.bool,

  // Redux Actions
  requestApproveEditAccess: PropTypes.func.isRequired,
  requestRejectEditAccess: PropTypes.func.isRequired
};

CardEditAccessRequests.defaultProps = {
  className: ''
};

export default CardEditAccessRequests;
