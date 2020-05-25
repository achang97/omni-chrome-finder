import React from 'react';
import PropTypes from 'prop-types';
import { HomePage, AskTeammate } from 'components/ask';

const Ask = ({ showAskTeammate }) => (showAskTeammate ? <AskTeammate /> : <HomePage />);

Ask.propTypes = {
  showAskTeammate: PropTypes.bool.isRequired
};

export default Ask;
