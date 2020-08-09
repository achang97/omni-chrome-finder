import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import { getStyleApplicationFn } from 'utils/style';
import style from './tooltip.css';

const s = getStyleApplicationFn(style);

const Tooltip = ({ tooltip, tooltipProps, show, children }) => {
  const [isHovering, setHover] = useState(false);

  const childProps = {
    'data-tip': true,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  };

  const { className, ...restTooltipProps } = tooltipProps;
  return (
    <>
      {React.cloneElement(children, childProps)}
      {show && isHovering && (
        <ReactTooltip effect="float" className={s(`tooltip ${className}`)} {...restTooltipProps}>
          {tooltip}
        </ReactTooltip>
      )}
    </>
  );
};

Tooltip.propTypes = {
  tooltip: PropTypes.node,
  tooltipProps: PropTypes.shape({
    className: PropTypes.string
  }),
  show: PropTypes.bool,
  children: PropTypes.node
};

Tooltip.defaultProps = {
  tooltip: null,
  tooltipProps: {},
  show: true
};

export default Tooltip;
