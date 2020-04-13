import React from 'react';
import PropTypes from 'prop-types';
import BottomScrollListener from 'react-bottom-scroll-listener';

import ScrollElement from './ScrollElement';

import style from './scroll-container.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const ScrollContainer = ({
  list, placeholder, renderScrollElement, renderOverflowElement, header,
  footer, showCondition, positionAdjust, horizontalMarginAdjust, verticalMarginAdjust,
  matchDimensions, scrollY, className, scrollContainerClassName, scrollElementClassName,
  children, position, relative, onBottom, bottomOffset
}) => {
  const renderBody = ref => (
    <div className={s(`overflow-x-hidden overflow-y-auto ${scrollContainerClassName}`)} ref={ref}>
      { header }
      { list.map((listElem, i) => (
        <ScrollElement
          key={`scroll-element-${i}`}
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
      { list.length === 0 && placeholder }
      { footer }
    </div>
    );

  return (
    <div className={s(`relative ${className}`)}>
      { onBottom ?
        <BottomScrollListener onBottom={onBottom} offset={bottomOffset}>
          {scrollRef => renderBody(scrollRef)}
        </BottomScrollListener> :
        renderBody()
      }
    </div>
  );
};

ScrollContainer.propTypes = {
  list: PropTypes.arrayOf(PropTypes.any).isRequired,
  placeholder: PropTypes.element,
  renderScrollElement: PropTypes.func.isRequired,
  renderOverflowElement: PropTypes.func.isRequired,
  showCondition: PropTypes.oneOfType([
    PropTypes.oneOf(['hover']),
    PropTypes.func
  ]),
  className: PropTypes.string,
  scrollContainerClassName: PropTypes.string,
  scrollElementClassName: PropTypes.string,
  header: PropTypes.element,
  footer: PropTypes.element,
  position: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
  matchDimensions: PropTypes.bool,
  horizontalMarginAdjust: PropTypes.bool,
  verticalMarginAdjust: PropTypes.bool,
  positionAdjust: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),
  onBottom: PropTypes.func,
  bottomOffset: PropTypes.number,
};

ScrollContainer.defaultProps = {
  showCondition: 'hover',
  className: '',
  scrollContainerClassName: '',
  scrollElementClassName: '',
  position: 'left',
  matchDimensions: false,
  horizontalMarginAdjust: false,
  verticalMarginAdjust: false,
  bottomOffset: 0,
};

export default ScrollContainer;
