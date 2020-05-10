import React from 'react';
import PropTypes from 'prop-types';
import { AiFillQuestionCircle } from 'react-icons/ai';

import { getStyleApplicationFn } from 'utils/style';

import Tooltip from '../Tooltip';
import style from './help-tooltip.css';

const s = getStyleApplicationFn(style);

const HelpTooltip = ({ tooltip, className, tooltipProps }) => {
  return (
    <Tooltip tooltip={tooltip} tooltipProps={tooltipProps}>
      <AiFillQuestionCircle className={s(`help-tooltip ${className}`)} />
    </Tooltip>
  );
};

HelpTooltip.propTypes = {
  tooltip: PropTypes.string.isRequired,
  className: PropTypes.string,
  tooltipProps: PropTypes.shape({})
};

HelpTooltip.defaultProps = {
  className: '',
  tooltipProps: {}
};

export default HelpTooltip;
