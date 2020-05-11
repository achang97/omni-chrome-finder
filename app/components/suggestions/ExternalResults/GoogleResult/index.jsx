import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import style from '../external-results.css';

const s = getStyleApplicationFn(style);

const GoogleResult = ({ name, id, webViewLink, iconLink, owners, onClick }) => {
  return (
    <a target="_blank" rel="noopener noreferrer" href={webViewLink} key={id} onClick={onClick}>
      <div className={s('external-result flex-col')}>
        <div className={s('flex items-center justify-between')}>
          <div className={s('external-result-text external-result-link')}> {name} </div>
          <div className={s('external-result-icon ml-xs')}>
            <img src={iconLink} alt="Google Logo" />
          </div>
        </div>
        {owners.length !== 0 && (
          <div className={s('mt-xs text-xs text-gray-reg')}>
            {owners.map(({ displayName, permissionId, me }, i) => (
              <React.Fragment key={permissionId}>
                <span>{me ? 'You' : displayName}</span>
                {i !== owners.length - 1 && <span>, </span>}
              </React.Fragment>
            ))}
          </div>
        )}
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
  owners: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      me: PropTypes.bool.isRequired,
      permissionId: PropTypes.string.isRequired
    })
  ).isRequired,
  onClick: PropTypes.func.isRequired
};

export default GoogleResult;
