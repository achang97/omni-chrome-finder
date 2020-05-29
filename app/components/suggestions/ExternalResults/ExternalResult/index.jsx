import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';

import style from './external-result.css';

const s = getStyleApplicationFn(style);

const ExternalResult = ({ url, onClick, logo, title, body }) => {
  return (
    <a target="_blank" rel="noopener noreferrer" href={url} onClick={onClick}>
      <div className={s('external-result flex-col')}>
        <div className={s('flex items-center justify-between')}>
          <div className={s('external-result-text external-result-link')}> {title} </div>
          <div className={s('external-result-icon ml-xs')}>
            <img src={logo} alt="" />
          </div>
        </div>
        <div className={s('external-result-body')}>{body}</div>
      </div>
    </a>
  );
};

ExternalResult.propTypes = {
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.node
};

export default ExternalResult;
