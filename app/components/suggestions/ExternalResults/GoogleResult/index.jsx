import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import style from '../external-results.css';

const s = getStyleApplicationFn(style);

const GoogleResult = ({ name, id, webViewLink, logo }) => (
  <a target="_blank" rel="noopener noreferrer" href={webViewLink} key={id}>
    <div className={s('external-result items-center')}>
      <div className={s('external-result-text external-result-link')}> {name} </div>
      <div className={s('external-result-icon ml-xs')}>
        <img src={logo} alt="Google Logo" />
      </div>
    </div>
  </a>
);

GoogleResult.getKey = ({ id }) => id;

GoogleResult.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  webViewLink: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired
};

export default GoogleResult;
