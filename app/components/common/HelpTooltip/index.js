import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { AiFillQuestionCircle } from 'react-icons/ai';

import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn();

const HelpTooltip = ({ text, id, className, tooltipProps }) => {
  // const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <AiFillQuestionCircle
        className={s(`text-purple-gray-50 ${className}`)}
        data-tip
        data-for={id}
        // onMouseOver={() => { setIsHovering(true) } }
        // onMouseOut={() => setIsHovering(false)}
      />
      {/* { isHovering && */}
        <ReactTooltip
          effect="float"
          id={id}
          {...tooltipProps}
        >
          {text}
        </ReactTooltip>
      {/* } */}
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
