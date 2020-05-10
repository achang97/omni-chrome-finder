import React from 'react';
import PropTypes from 'prop-types';
import BottomScrollListener from 'react-bottom-scroll-listener';

import { getStyleApplicationFn } from 'utils/style';
import ScrollElement from './ScrollElement';

import style from './scroll-container.css';

const s = getStyleApplicationFn(style);

const ScrollContainer = ({
  list,
  getKey,
  placeholder,
  renderScrollElement,
  renderOverflowElement,
  header,
  footer,
  showCondition,
  horizontalMarginAdjust,
  verticalMarginAdjust,
  matchDimensions,
  className,
  scrollContainerClassName,
  scrollElementClassName,
  position,
  onBottom,
  bottomOffset
}) => {
  const renderBody = (ref) => (
    <div className={s(`overflow-x-hidden overflow-y-auto ${scrollContainerClassName}`)} ref={ref}>
      {header}
      {list.map((listElem, i) => (
        <ScrollElement
          key={getKey(listElem)}
          element={listElem}
          index={i}
          renderScrollElement={renderScrollElement}
          renderOverflowElement={renderOverflowElement}
          scrollElementClassName={scrollElementClassName}
          position={position}
          showCondition={showCondition === 'hover' ? 'hover' : showCondition(listElem, i)}
          matchDimensions={matchDimensions}
          horizontalMarginAdjust={horizontalMarginAdjust}
          verticalMarginAdjust={verticalMarginAdjust}
        />
      ))}
      {list.length === 0 && placeholder}
      {footer}
    </div>
  );

  return (
    <div className={s(`relative ${className}`)}>
      {onBottom ? (
        <BottomScrollListener onBottom={onBottom} offset={bottomOffset}>
          {(scrollRef) => renderBody(scrollRef)}
        </BottomScrollListener>
      ) : (
        renderBody()
      )}
    </div>
  );
};

ScrollContainer.propTypes = {
  list: PropTypes.arrayOf(PropTypes.any).isRequired,
  getKey: PropTypes.func.isRequired,
  placeholder: PropTypes.node,
  renderScrollElement: PropTypes.func.isRequired,
  renderOverflowElement: PropTypes.func.isRequired,
  showCondition: PropTypes.oneOfType([PropTypes.oneOf(['hover']), PropTypes.func]),
  className: PropTypes.string,
  scrollContainerClassName: PropTypes.string,
  scrollElementClassName: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  position: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
  matchDimensions: PropTypes.bool,
  horizontalMarginAdjust: PropTypes.bool,
  verticalMarginAdjust: PropTypes.bool,
  onBottom: PropTypes.func,
  bottomOffset: PropTypes.number
};

ScrollContainer.defaultProps = {
  showCondition: 'hover',
  placeholder: null,
  className: '',
  scrollContainerClassName: '',
  scrollElementClassName: '',
  header: null,
  footer: null,
  position: 'left',
  matchDimensions: false,
  horizontalMarginAdjust: false,
  verticalMarginAdjust: false,
  onBottom: null,
  bottomOffset: 0
};

export default ScrollContainer;
