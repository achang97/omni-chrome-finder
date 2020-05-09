import React from 'react';
import PropTypes from 'prop-types';

import { Timeago } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import style from '../external-results.css';

const s = getStyleApplicationFn(style);

const ZendeskResult = ({
  id,
  agentUrl,
  updated_at: updatedAt,
  raw_subject: rawSubject,
  description,
  priority,
  status,
  logo
}) => (
  <a target="_blank" rel="noopener noreferrer" href={agentUrl} key={id}>
    <div className={s('external-result flex-col')}>
      <div className={s('flex justify-between mb-sm')}>
        <div className={s('min-w-0')}>
          <div className={s('external-result-text font-semibold text-purple-reg mb-xs')}>
            {rawSubject}
          </div>
          <div className={s('text-xs text-gray-light')}>
            <span>
              Priority: <span className={s('italic')}> {priority} </span>
            </span>
            <span className={s('ml-sm')}>
              Status: <span className={s('italic')}> {status} </span>
            </span>
          </div>
        </div>
        <div className={s('external-result-icon ml-xs')}>
          <img src={logo} alt="Zendesk Logo" />
        </div>
      </div>
      <div className={s('text-xs line-clamp-3')}> {description} </div>
      <Timeago date={updatedAt} className={s('external-result-date')} />
    </div>
  </a>
);

ZendeskResult.getKey = ({ id }) => id;

ZendeskResult.propTypes = {
  id: PropTypes.string.isRequired,
  agentUrl: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
  raw_subject: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired
};

export default ZendeskResult;
