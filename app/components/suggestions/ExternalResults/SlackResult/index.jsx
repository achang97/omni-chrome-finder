import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import style from '../external-results.css';

const s = getStyleApplicationFn(style);

const SlackResult = ({ text, link, sender, channel, logo, onClick }) => (
  <a target="_blank" rel="noopener noreferrer" href={link} onClick={onClick}>
    <div className={s('external-result flex-col')}>
      <div className={s('flex justify-between mb-sm')}>
        <div>
          <div className={s('external-result-text font-semibold text-purple-reg mb-xs')}>
            {channel === 'Personal Message' ? 'Direct Message' : `#${channel}`}
          </div>
          <div className={s('external-result-text external-result-sender')}> @{sender} </div>
        </div>
        <div className={s('external-result-icon ml-xs')}>
          <img src={logo} alt="Slack Logo" />
        </div>
      </div>
      <div className={s('text-xs line-clamp-3')}> {text} </div>
    </div>
  </a>
);

SlackResult.getKey = ({ link }) => link;

SlackResult.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
  channel: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default SlackResult;
