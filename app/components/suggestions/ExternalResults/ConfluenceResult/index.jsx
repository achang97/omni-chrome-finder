import React from 'react';
import PropTypes from 'prop-types';

import { INTEGRATIONS } from 'appConstants';

import ExternalResult from '../ExternalResult';

const ConfluenceResult = ({ id, title, url, card }) => {
  return (
    <ExternalResult
      id={id}
      url={url}
      logo={INTEGRATIONS.CONFLUENCE.logo}
      type={INTEGRATIONS.CONFLUENCE.type}
      title={title}
      card={card}
    />
  );
};

ConfluenceResult.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  card: PropTypes.shape({})
};

export default ConfluenceResult;
