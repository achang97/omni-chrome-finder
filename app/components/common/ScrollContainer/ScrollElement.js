import React, { Component } from 'react';
import PropTypes from 'prop-types';

import style from './scroll-container.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);

class HoverableScrollElement extends Component {
	constructor(props) {
		super(props);

		this.elemRef = React.createRef();
		this.overflowElemRef = React.createRef();

		this.state = {
			positions: {
				scroll: {},
				overflow: {},
			},
		}

	}

	componentDidMount() {
		const { showCondition } = this.props;
		if (showCondition !== 'hover' && showCondition) {
			this.showOverflowElement();
		}
	}

	componentDidUpdate(prevProps) {
		const { showCondition } = this.props;
		if (showCondition !== 'hover') {
			if (!prevProps.showCondition && showCondition) {
				this.showOverflowElement();
			} else if (prevProps.showCondition && !showCondition) {
				this.hideOverflowElement();
			}
		}
	}

	onMouseOver = (e) => {
		const { showCondition } = this.props;
		if (showCondition === 'hover') {
			this.showOverflowElement(e);
		}
	}

	onMouseOut = (e) => {
		const { showCondition } = this.props;		
		if (showCondition === 'hover') {
			this.hideOverflowElement();
		}		
	}

	getMarginNumber = (px) => {
		return parseInt(px.substring(0, px.length - 2));
	}

	getMarginAdjustment = () => {
		const { position, horizontalMarginAdjust, verticalMarginAdjust } = this.props;

		const { marginTop, marginLeft, marginBottom, marginRight } = window.getComputedStyle(this.elemRef.current.children[0]);
		return {
			marginTop: verticalMarginAdjust ? this.getMarginNumber(marginTop) : 0,
			marginLeft: horizontalMarginAdjust ? this.getMarginNumber(marginLeft) : 0,
			marginBottom: verticalMarginAdjust ? this.getMarginNumber(marginBottom) : 0,
			marginRight: horizontalMarginAdjust ? this.getMarginNumber(marginRight) : 0
		};
	}

	getPositionAdjustment = () => {
		const { positionAdjust } = this.props;
		return { top: 0, left: 0, right: 0, bottom: 0, ...positionAdjust };
	}

	showOverflowElement = () => {
		const { position, matchDimensions } = this.props;

		const overflowElem = this.overflowElemRef.current;
		const shownElem = this.elemRef.current;

		const shownElemPosition = shownElem.getBoundingClientRect();
		const { top, bottom, left, right, height, width } = shownElemPosition;

		const { top: parentTop, bottom: parentBottom, left: parentLeft, right: parentRight } = this.elemRef.current.offsetParent.getBoundingClientRect();
		const { top: adjustTop, bottom: adjustBottom, left: adjustLeft, right: adjustRight } = this.getPositionAdjustment();

		// Show element to get proper measurements		
		overflowElem.style.display = 'block';
		const overflowElemPosition = overflowElem.getBoundingClientRect();
		const { top: overflowTop, bottom: overflowBottom, left: overflowLeft, right: overflowRight, height: overflowHeight, width: overflowWidth } = overflowElemPosition;

		// Get margin of child
		const { marginTop, marginLeft, marginBottom, marginRight } = this.getMarginAdjustment();
		const maxTop = window.innerHeight - overflowHeight - parentTop;

		switch (position) {
			case "left": {
				overflowElem.style.right = `${parentRight - right + width - marginLeft + adjustRight}px`;
				overflowElem.style.top = `${Math.min((top < parentTop ? 0 : top - parentTop) + marginTop + adjustTop, maxTop)}px`;
				break;
			}
			case "right": {
				overflowElem.style.left = `${left - parentLeft + width - marginRight + adjustLeft}px`;
				overflowElem.style.top = `${Math.min((top < parentTop ? 0 : top - parentTop) + marginTop + adjustTop, maxTop)}px`;
				break;
			}
			case "top": {
				overflowElem.style.right = `${parentRight - right + marginRight + adjustRight}px`;
				overflowElem.style.bottom = `${parentBottom - bottom + height - marginTop + adjustBottom}px`;
				break;				
			}
			case "bottom": {
				overflowElem.style.right = `${parentRight - right + marginRight + adjustRight}px`;
				overflowElem.style.top = `${top - parentTop + height - marginBottom + adjustTop}px`;
				break;				
			}
		}

		if (matchDimensions) {
			if (position === 'left' || position === 'right') {
				overflowElem.style.height = `${height - marginTop - marginBottom}px`;
			} else if (position === 'top' || position === 'bottom') {
				overflowElem.style.width = `${width - marginLeft - marginRight}px`;
			}
		}

		this.setState({ position: { scroll: shownElemPosition, overflow: overflowElemPosition } })
	}

	hideOverflowElement = () => {
		const overflowElem = this.overflowElemRef.current;
		overflowElem.style.display = 'none';
	}

	render() {
		const { element, index, renderScrollElement, renderOverflowElement, scrollElementClassName, overflowElement, horizontalMarginAdjust, verticalMarginAdjust, showCondition, matchDimensions, position, ...rest } = this.props;

		return (
			<div
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}
				className={s(`scroll-container-elem ${scrollElementClassName}`)}
				ref={this.elemRef}
				{...rest}
			>
				{ renderScrollElement(element, index) }
				<div
					className={s("scroll-container-overflow-elem")}
					style={{ display: 'none' }}
					ref={this.overflowElemRef}
				>
					{ renderOverflowElement(element, index, {
						scroll: this.elemRef.current ? this.elemRef.current.getBoundingClientRect() : {},
						overflow: this.overflowElemRef.current ? this.overflowElemRef.current.getBoundingClientRect() : {}
					})}
				</div>
			</div> 
		)
	}
}

HoverableScrollElement.propTypes = {
	scrollElementClassName: PropTypes.string,
	element: PropTypes.any.isRequired,
	index: PropTypes.number.isRequired,
	renderScrollElement: PropTypes.func.isRequired,
	renderOverflowElement: PropTypes.func.isRequired,
	showCondition: PropTypes.oneOfType([
		PropTypes.oneOf(["hover"]),
		PropTypes.bool
	]).isRequired,
	position: PropTypes.oneOf(["top", "left", "bottom", "right"]).isRequired,
	matchDimensions: PropTypes.bool.isRequired,
	horizontalMarginAdjust: PropTypes.bool.isRequired,
	verticalMarginAdjust: PropTypes.bool.isRequired,
	positionAdjust: PropTypes.shape({
		top: PropTypes.number,
		bottom: PropTypes.number,
		left: PropTypes.number,
		right: PropTypes.number,
	})
}

HoverableScrollElement.defaultProps = {
}

export default HoverableScrollElement;