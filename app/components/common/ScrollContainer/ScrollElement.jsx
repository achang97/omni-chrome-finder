import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { NOOP } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';
import style from './scroll-container.css';

const s = getStyleApplicationFn(style);

const ScrollElement = ({
  scrollElementClassName,
  element,
  index,
  renderScrollElement,
  renderOverflowElement,
  showCondition,
  position,
  matchDimensions,
  horizontalMarginAdjust,
  verticalMarginAdjust
}) => {
  const elemRef = useRef(null);
  const overflowElemRef = useRef(null);

  // This is used purely for a forced re-render
  const setPosition = useState({ scroll: {}, overflow: {} })[1];

  const getMarginNumber = (px) => parseInt(px.substring(0, px.length - 2));

  const getPositionAdjustment = () => {
    return { top: 0, left: 0, right: 0, bottom: 0 };
  };

  const showOverflowElement = useCallback(() => {
    const getMarginAdjustment = () => {
      const { marginTop, marginLeft, marginBottom, marginRight } = window.getComputedStyle(
        elemRef.current.children[0]
      );
      return {
        marginTop: verticalMarginAdjust ? getMarginNumber(marginTop) : 0,
        marginLeft: horizontalMarginAdjust ? getMarginNumber(marginLeft) : 0,
        marginBottom: verticalMarginAdjust ? getMarginNumber(marginBottom) : 0,
        marginRight: horizontalMarginAdjust ? getMarginNumber(marginRight) : 0
      };
    };

    const overflowElem = overflowElemRef.current;
    const shownElem = elemRef.current;

    const shownElemPosition = shownElem.getBoundingClientRect();
    const { top, bottom, left, right, height, width } = shownElemPosition;

    const {
      top: parentTop,
      bottom: parentBottom,
      left: parentLeft,
      right: parentRight
    } = elemRef.current.offsetParent.getBoundingClientRect();
    const {
      top: adjustTop,
      bottom: adjustBottom,
      left: adjustLeft,
      right: adjustRight
    } = getPositionAdjustment();

    // Show element to get proper measurements
    overflowElem.style.display = 'block';
    const overflowElemPosition = overflowElem.getBoundingClientRect();
    const { height: overflowHeight } = overflowElemPosition;

    // Get margin of child
    const { marginTop, marginLeft, marginBottom, marginRight } = getMarginAdjustment();
    const maxTop = window.innerHeight - overflowHeight - parentTop;

    switch (position) {
      case 'left': {
        overflowElem.style.right = `${parentRight - right + width - marginLeft + adjustRight}px`;
        overflowElem.style.top = `${Math.min(
          (top < parentTop ? 0 : top - parentTop) + marginTop + adjustTop,
          maxTop
        )}px`;
        break;
      }
      case 'right': {
        overflowElem.style.left = `${left - parentLeft + width - marginRight + adjustLeft}px`;
        overflowElem.style.top = `${Math.min(
          (top < parentTop ? 0 : top - parentTop) + marginTop + adjustTop,
          maxTop
        )}px`;
        break;
      }
      case 'top': {
        overflowElem.style.right = `${parentRight - right + marginRight + adjustRight}px`;
        overflowElem.style.bottom = `${
          parentBottom - bottom + height - marginTop + adjustBottom
        }px`;
        break;
      }
      case 'bottom': {
        overflowElem.style.right = `${parentRight - right + marginRight + adjustRight}px`;
        overflowElem.style.top = `${top - parentTop + height - marginBottom + adjustTop}px`;
        break;
      }
      default:
        break;
    }

    if (matchDimensions) {
      if (position === 'left' || position === 'right') {
        overflowElem.style.height = `${height - marginTop - marginBottom}px`;
      } else if (position === 'top' || position === 'bottom') {
        overflowElem.style.width = `${width - marginLeft - marginRight}px`;
      }
    }

    setPosition({ position: { scroll: shownElemPosition, overflow: overflowElemPosition } });
  }, [horizontalMarginAdjust, verticalMarginAdjust, matchDimensions, position, setPosition]);

  const hideOverflowElement = () => {
    const overflowElem = overflowElemRef.current;
    overflowElem.style.display = 'none';
  };

  useEffect(() => {
    if (showCondition !== 'hover') {
      if (showCondition) {
        showOverflowElement();
      } else {
        hideOverflowElement();
      }
    }
  }, [showCondition, showOverflowElement]);

  const onMouseOver = (e) => {
    if (showCondition === 'hover') {
      showOverflowElement(e);
    }
  };

  const onMouseOut = () => {
    if (showCondition === 'hover') {
      hideOverflowElement();
    }
  };

  return (
    <div
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onFocus={NOOP}
      onBlur={NOOP}
      className={s(`scroll-container-elem ${scrollElementClassName}`)}
      ref={elemRef}
    >
      {renderScrollElement(element, index)}
      <div
        className={s('scroll-container-overflow-elem')}
        style={{ display: 'none' }}
        ref={overflowElemRef}
      >
        {renderOverflowElement(element, index, {
          scroll: elemRef.current ? elemRef.current.getBoundingClientRect() : {},
          overflow: overflowElemRef.current ? overflowElemRef.current.getBoundingClientRect() : {}
        })}
      </div>
    </div>
  );
};

ScrollElement.propTypes = {
  scrollElementClassName: PropTypes.string,
  element: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  index: PropTypes.number.isRequired,
  renderScrollElement: PropTypes.func.isRequired,
  renderOverflowElement: PropTypes.func.isRequired,
  showCondition: PropTypes.oneOfType([PropTypes.oneOf(['hover']), PropTypes.bool]).isRequired,
  position: PropTypes.oneOf(['top', 'left', 'bottom', 'right']).isRequired,
  matchDimensions: PropTypes.bool.isRequired,
  horizontalMarginAdjust: PropTypes.bool.isRequired,
  verticalMarginAdjust: PropTypes.bool.isRequired
};

ScrollElement.defaultProps = {
  scrollElementClassName: ''
};

export default ScrollElement;
