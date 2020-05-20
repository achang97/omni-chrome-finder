import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

import { Separator, HelpTooltip } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-section.css';

const s = getStyleApplicationFn(style);

const CardSection = ({
  title,
  hint,
  startExpanded,
  isVertical,
  isExpandable,
  showSeparator,
  className,
  preview,
  children,
  headerEnd
}) => {
  const [isExpanded, setExpanded] = useState(startExpanded);
  const toggleSection = () => setExpanded(!isExpanded);

  return (
    <div className={s(className)}>
      <div className={`flex items-start ${isVertical ? 'flex-col' : ''}`}>
        <div
          className={s(
            `flex mb-lg items-center justify-between ${
              !isVertical ? 'card-section-horizontal-header' : 'self-stretch'
            }`
          )}
        >
          <div className={s('flex items-center')}>
            <div
              className={s('font-semibold text-sm text-black button-hover')}
              onClick={toggleSection}
            >
              {title}
            </div>
            {hint && (
              <HelpTooltip
                className={s('ml-sm')}
                tooltip={hint}
                tooltipProps={{
                  place: 'right',
                  className: s('card-section-tooltip')
                }}
              />
            )}
            {isExpandable && (
              <button
                className={s('text-gray-light flex items-center ml-sm')}
                onClick={toggleSection}
                type="button"
              >
                {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
              </button>
            )}
          </div>
          {!isExpanded && isVertical && preview}
          {headerEnd}
        </div>
        <div className={s('flex-1 self-stretch')}>
          {preview && (
            <AnimateHeight height={isExpandable && !isExpanded && !isVertical ? 'auto' : 0}>
              {preview}
            </AnimateHeight>
          )}
          <AnimateHeight height={!isExpandable || isExpanded ? 'auto' : 0}>
            {children}
          </AnimateHeight>
        </div>
      </div>
      {showSeparator && <Separator horizontal className={s('mt-sm')} />}
    </div>
  );
};

CardSection.propTypes = {
  title: PropTypes.string.isRequired,
  hint: PropTypes.string,
  isExpandable: PropTypes.bool,
  isVertical: PropTypes.bool,
  startExpanded: PropTypes.bool,
  showSeparator: PropTypes.bool,
  className: PropTypes.string,
  preview: PropTypes.node,
  headerEnd: PropTypes.node,
  children: PropTypes.node.isRequired
};

CardSection.defaultProps = {
  isExpandable: true,
  startExpanded: true,
  isVertical: true,
  showSeparator: true,
  hint: null,
  preview: null,
  headerEnd: null,
  className: ''
};

export default CardSection;
