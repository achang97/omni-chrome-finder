import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn();

const Tooltip = ({ tooltip, tooltipProps, show, children }) => {
  const [isHovering, setHover] = useState(false);
  const childProps = {
    'data-tip': true,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  };

  return (
    <>
      { React.cloneElement(children, childProps) }
      { show && isHovering &&
        <ReactTooltip
          effect="float"
          {...tooltipProps}
        >
          {tooltip}
        </ReactTooltip>
      }
    </> 
  );
}

Tooltip.propTypes = {
  tooltip: PropTypes.node.isRequired,
  tooltipProps: PropTypes.object,
  show: PropTypes.bool,
}

Tooltip.defaultProps = {
  tooltipProps: {},
  show: true,
}

export default Tooltip;
