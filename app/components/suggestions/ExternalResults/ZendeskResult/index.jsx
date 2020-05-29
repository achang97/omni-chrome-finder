import React from 'react';
import PropTypes from 'prop-types';

import { Timeago } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import ExternalResult from '../ExternalResult';

const s = getStyleApplicationFn();

const ZendeskResult = ({
  agentUrl,
  updated_at: updatedAt,
  raw_subject: rawSubject,
  description,
  priority,
  status,
  logo,
  onClick
}) => (
  <ExternalResult
    url={agentUrl}
    onClick={onClick}
    title={rawSubject}
    logo={logo}
    body={
      <>
        <div className={s('mb-xs')}>
          <span>
            Priority: <span className={s('italic')}> {priority} </span>
          </span>
          <span className={s('ml-sm')}>
            Status: <span className={s('italic')}> {status} </span>
          </span>
        </div>
        <div className={s('text-xs line-clamp-3 mb-xs')}> {description} </div>
        <Timeago date={updatedAt} className={s('text-gray-light text-right')} />
      </>
    }
  />
);

ZendeskResult.propTypes = {
  agentUrl: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
  raw_subject: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ZendeskResult;
