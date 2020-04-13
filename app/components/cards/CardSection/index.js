import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

import { Separator, HelpTooltip } from 'components/common';

import style from './card-section.css';
import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn(style);

const CardSection = ({
  title, hint, startExpanded, isExpandable, showSeparator, className, preview, children
}) => {
  const [isExpanded, setExpanded] = useState(startExpanded);
  const toggleSection = () => setExpanded(!isExpanded);

  return (
    <div className={className}>
      <div className={s('flex mb-lg items-center justify-between')}>
        <div className={s('flex items-center')}>
          <div className={s('font-semibold text-sm text-black button-hover')} onClick={toggleSection}>
            {title}
          </div>
          { hint &&
            <HelpTooltip
              className={s('ml-sm')} 
              id={`tooltip-section-${title}`}
              tooltipProps={{
                place: 'right',
                className: s('card-section-tooltip')  
              }}
              text={hint}
            />
          }
          { isExpandable &&
          <button className={s('text-gray-light flex items-center ml-reg')} onClick={toggleSection}>
            { isExpanded ? <MdExpandLess /> : <MdExpandMore /> }
          </button>
          }
        </div>
        { !isExpanded && preview }
      </div>
      <AnimateHeight height={isExpandable && isExpanded ? 'auto' : 0}>
        { children }
      </AnimateHeight>
      { showSeparator &&
        <Separator horizontal className={s('mt-lg')} />
      }
    </div>
  );
}

CardSection.propTypes = {
  title: PropTypes.string.isRequired,
  hint: PropTypes.string,
  isExpandable: PropTypes.bool,
  startExpanded: PropTypes.bool,
  showSeparator: PropTypes.bool,
  className: PropTypes.string,
  preview: PropTypes.element,
};

CardSection.defaultProps = {
  isExpandable: true,
  startExpanded: true,
  showSeparator: true,
  className: '',
};

export default CardSection;
