import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillQuestionCircle } from 'react-icons/ai';

import { Tooltip } from 'components/common';

import style from './help-tooltip.css';
import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn(style);

const HelpTooltip = ({ tooltip, className, tooltipProps }) => {
  return (
    <Tooltip tooltip={tooltip} tooltipProps={tooltipProps}>
      <AiFillQuestionCircle
        className={s(`help-tooltip ${className}`)}
      />
    </Tooltip> 
  );
 
}

HelpTooltip.propTypes = {
  tooltip: PropTypes.string,
  className: PropTypes.string,
  tooltipProps: PropTypes.object,
}

HelpTooltip.defaultProps = {
  className: '',
  tooltipProps: {}
}

export default HelpTooltip;
