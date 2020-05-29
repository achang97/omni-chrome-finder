import React from 'react';
import PropTypes from 'prop-types';

import ExternalResult from '../ExternalResult';

const GoogleResult = ({ name, webViewLink, iconLink, owners, onClick }) => {
  return (
    <ExternalResult
      url={webViewLink}
      onClick={onClick}
      logo={iconLink}
      title={name}
      body={
        owners.length !== 0 && (
          <>
            {owners.map(({ displayName, permissionId, me }, i) => (
              <React.Fragment key={permissionId}>
                <span>{me ? 'You' : displayName}</span>
                {i !== owners.length - 1 && <span>, </span>}
              </React.Fragment>
            ))}
          </>
        )
      }
    />
  );
};

GoogleResult.propTypes = {
  name: PropTypes.string.isRequired,
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
