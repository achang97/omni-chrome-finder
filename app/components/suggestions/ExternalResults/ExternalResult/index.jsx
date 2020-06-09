import React from 'react';
import PropTypes from 'prop-types';

import { Timeago } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import style from './external-result.css';

const s = getStyleApplicationFn(style);

const ExternalResult = ({ url, onClick, logo, title, body, timestamp, bodyClassName }) => {
  return (
    <a target="_blank" rel="noopener noreferrer" href={url} onClick={onClick}>
      <div className={s('external-result flex-col')}>
        <div className={s('flex items-center justify-between')}>
          <div className={s('external-result-text external-result-link')}> {title} </div>
          <div className={s('external-result-icon ml-xs')}>
            <img src={logo} alt="" />
          </div>
        </div>
        <div className={s(`external-result-body ${bodyClassName}`)}>
          {body}
          {timestamp && (
            <Timeago
              date={timestamp}
              live={false}
              className={s('text-gray-light flex justify-end mt-xs')}
            />
          )}
        </div>
      </div>
    </a>
  );
};

ExternalResult.propTypes = {
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.string,
  body: PropTypes.node,
  bodyClassName: PropTypes.string
};

ExternalResult.defaultProps = {
  bodyClassName: ''
};

export default ExternalResult;
