import React from 'react';
import PropTypes from 'prop-types';

import { INTEGRATIONS } from 'appConstants';

import ExternalResult from '../ExternalResult';

const JiraResult = ({ id, title, url, card }) => {
  return (
    <ExternalResult
      id={id}
      url={url}
      logo={INTEGRATIONS.JIRA.logo}
      type={INTEGRATIONS.JIRA.type}
      title={title}
      card={card}
      showDropdown={false}
    />
  );
};

JiraResult.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  card: PropTypes.shape({})
};

export default JiraResult;
