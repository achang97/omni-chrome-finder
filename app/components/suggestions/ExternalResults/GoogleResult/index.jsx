import React from 'react';
import PropTypes from 'prop-types';

import { INTEGRATIONS } from 'appConstants';

import ExternalResult from '../ExternalResult';

const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

const GoogleResult = ({ id, name, webViewLink, mimeType, iconLink, owners, card }) => {
  return (
    <ExternalResult
      id={id}
      url={webViewLink}
      logo={iconLink}
      type={INTEGRATIONS.GOOGLE.type}
      title={name}
      card={card}
      showDropdown={mimeType !== FOLDER_MIME_TYPE}
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
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  webViewLink: PropTypes.string.isRequired,
  iconLink: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  owners: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      me: PropTypes.bool.isRequired,
      permissionId: PropTypes.string.isRequired
    })
  ).isRequired,
  card: PropTypes.shape({})
};

export default GoogleResult;
