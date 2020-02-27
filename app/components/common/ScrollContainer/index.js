import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ScrollElement from './ScrollElement';

import style from './scroll-container.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const ScrollContainer = ({ list, renderScrollElement, renderOverflowElement, footer, showCondition, positionAdjust, horizontalMarginAdjust, verticalMarginAdjust, matchDimensions, scrollY, className, scrollContainerClassName, scrollElementClassName, children, position, relative }) => {
	return (
		<div className={s(`relative ${className}`)}>
			<div className={s(`overflow-x-hidden overflow-y-auto ${scrollContainerClassName}`)}>
				{ list.map((listElem, i) => (
					<ScrollElement
						key={i}
						scrollElement={renderScrollElement(listElem, i)}
						overflowElement={renderOverflowElement(listElem, i)}
						scrollElementClassName={scrollElementClassName}
						position={position}
						showCondition={showCondition === 'hover' ? 'hover' : showCondition(listElem, i)}
						matchDimensions={matchDimensions}
						horizontalMarginAdjust={horizontalMarginAdjust}
						verticalMarginAdjust={verticalMarginAdjust}
					/>
				))}
				{ footer }
			</div>
		</div>
	)
}

ScrollContainer.propTypes = {
	list: PropTypes.arrayOf(PropTypes.any).isRequired,
	renderScrollElement: PropTypes.func.isRequired,
	renderOverflowElement: PropTypes.func.isRequired,
	showCondition: PropTypes.oneOfType([
		PropTypes.oneOf(["hover"]),
		PropTypes.func
	]),
	className: PropTypes.string,
	scrollContainerClassName: PropTypes.string,
	scrollElementClassName: PropTypes.string,
	footer: PropTypes.element,
	position: PropTypes.oneOf(["top", "left", "bottom", "right"]),
	matchDimensions: PropTypes.bool,
	horizontalMarginAdjust: PropTypes.bool,
	verticalMarginAdjust: PropTypes.bool,
	positionAdjust: PropTypes.shape({
		top: PropTypes.number,
		bottom: PropTypes.number,
		left: PropTypes.number,
		right: PropTypes.number,
	})
}

ScrollContainer.defaultProps = {
	showCondition: "hover",
	className: '',
	scrollContainerClassName: '',
	scrollElementClassName: '',
	position: 'left',
	matchDimensions: false,
	horizontalMarginAdjust: false,
	verticalMarginAdjust: false,
}

export default ScrollContainer;