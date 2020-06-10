import React from 'react';
import PropTypes from 'prop-types';

import { INTEGRATIONS } from 'appConstants';

import ExternalResult from '../ExternalResult';

const ConfluenceResult = ({ id, title, url, card, onClick }) => {
  return (
    <ExternalResult
      id={id}
      url={url}
      onClick={onClick}
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
  onClick: PropTypes.func.isRequired,
  card: PropTypes.shape({})
};

export default ConfluenceResult;
