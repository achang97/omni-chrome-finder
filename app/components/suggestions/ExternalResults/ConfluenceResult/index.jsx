import React from 'react';
import PropTypes from 'prop-types';

import ExternalResult from '../ExternalResult';

const ConfluenceResult = ({ logo, title, url, card, onClick }) => {
  return <ExternalResult url={url} onClick={onClick} logo={logo} title={title} card={card} />;
};

ConfluenceResult.propTypes = {
  title: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  card: PropTypes.shape({})
};

export default ConfluenceResult;
