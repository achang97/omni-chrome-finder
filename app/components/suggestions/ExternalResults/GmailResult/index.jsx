import React from 'react';
import PropTypes from 'prop-types';

import { Timeago } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import style from '../external-results.css';

const s = getStyleApplicationFn(style);

const GmailResult = ({ id, webLink, deliveredTo, date, from, subject, logo, onClick }) => (
  <a target="_blank" rel="noopener noreferrer" href={webLink} key={id} onClick={onClick}>
    <div className={s('external-result flex-col')}>
      <div className={s('flex justify-between mb-xs')}>
        <div className={s('external-result-text font-semibold text-purple-reg mb-xs')}>
          {subject}
        </div>
        <div className={s('external-result-icon ml-xs')}>
          <img src={logo} alt="Gmail Logo" />
        </div>
      </div>
      <div className={s('text-xs flex mb-xs')}>
        <div className={s('font-semibold w-4xl flex-shrink-0 text-xs')}> From: </div>
        <div className={s('external-result-text text-xs')}> {from} </div>
      </div>
      <div className={s('external-result-text flex')}>
        <div className={s('font-semibold w-4xl flex-shrink-0 text-xs')}> To: </div>
        <div className={s('external-result-text text-xs')}> {deliveredTo} </div>
      </div>
      <Timeago date={date} className={s('external-result-date')} />
    </div>
  </a>
);

GmailResult.getKey = ({ id }) => id;

GmailResult.propTypes = {
  id: PropTypes.string.isRequired,
  webLink: PropTypes.string.isRequired,
  deliveredTo: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default GmailResult;
