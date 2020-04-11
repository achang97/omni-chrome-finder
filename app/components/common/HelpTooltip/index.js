import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { AiFillQuestionCircle } from 'react-icons/ai';

import style from './help-tooltip.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);

const HelpTooltip = ({ text, id, className, tooltipProps }) => {
  return (
    <>
      <AiFillQuestionCircle
        className={s(`help-tooltip ${className}`)}
        data-tip
        data-for={id}
      />
      <ReactTooltip
        effect="float"
        id={id}
        {...tooltipProps}
      >
        {text}
      </ReactTooltip>
    </> 
  );
 
}

HelpTooltip.propTypes = {
  text: PropTypes.string,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  tooltipProps: PropTypes.object,
}

HelpTooltip.defaultProps = {
  className: '',
  tooltipProps: {}
}

export default HelpTooltip;
