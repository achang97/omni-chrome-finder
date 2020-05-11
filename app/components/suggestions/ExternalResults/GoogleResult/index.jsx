import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import style from '../external-results.css';

const s = getStyleApplicationFn(style);

const GoogleResult = ({ name, id, webViewLink, iconLink, onClick }) => {
  return (
    <a target="_blank" rel="noopener noreferrer" href={webViewLink} key={id} onClick={onClick}>
      <div className={s('external-result items-center')}>
        <div className={s('external-result-text external-result-link')}> {name} </div>
        <div className={s('external-result-icon ml-xs')}>
          <img src={iconLink} alt="Google Logo" />
        </div>
      </div>
    </a>
  );
};

GoogleResult.getKey = ({ id }) => id;

GoogleResult.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  webViewLink: PropTypes.string.isRequired,
  iconLink: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default GoogleResult;
