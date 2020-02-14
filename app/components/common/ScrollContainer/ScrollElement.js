import React, { Component } from 'react';
import PropTypes from 'prop-types';

import style from './scroll-container.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

class HoverableScrollElement extends Component {
	constructor(props) {
		super(props);

		this.elemRef = React.createRef();
		this.overflowElemRef = React.createRef();
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
		const { position, marginAdjust } = this.props;

		if (!marginAdjust) {
			return { marginTop: 0, marginLeft: 0, marginBottom: 0, marginRight: 0 };
		}

		const { marginTop, marginLeft, marginBottom, marginRight } = window.getComputedStyle(this.elemRef.current.children[0]);
		return {
			marginTop: this.getMarginNumber(marginTop),
			marginLeft: this.getMarginNumber(marginLeft),
			marginBottom: this.getMarginNumber(marginBottom),
			marginRight: this.getMarginNumber(marginRight)
		};
	}

	showOverflowElement = () => {
		const { position, matchDimensions } = this.props;

		const overflowElem = this.overflowElemRef.current;
		const shownElem = this.elemRef.current;

		const { top, bottom, left, right, height, width } = shownElem.getBoundingClientRect();
		const { top: parentTop, bottom: parentBottom, left: parentLeft, right: parentRight } = this.elemRef.current.offsetParent.getBoundingClientRect();

		// Show element to get proper measurements		
		overflowElem.style.display = 'block';
		const { top: overflowTop, bottom: overflowBottom, left: overflowLeft, right: overflowRight, height: overflowHeight, width: overflowWidth } = overflowElem.getBoundingClientRect();

		// Get margin of child
		const { marginTop, marginLeft, marginBottom, marginRight } = this.getMarginAdjustment();

		switch (position) {
			case "left": {
				overflowElem.style.right = `${parentRight - right + width - marginLeft}px`;
				overflowElem.style.top = `${(top < 0 ? 0 : top - parentTop) + marginTop}px`;
				break;
			}
			case "right": {
				overflowElem.style.left = `${left - parentLeft + width - marginRight}px`;
				overflowElem.style.top = `${(top < 0 ? 0 : top - parentTop) + marginTop}px`;
				break;
			}
			case "top": {
				overflowElem.style.right = `${parentRight - right + marginRight}px`;
				overflowElem.style.bottom = `${parentBottom - bottom + height - marginTop}px`;
				break;				
			}
			case "bottom": {
				overflowElem.style.right = `${parentRight - right + marginRight}px`;
				overflowElem.style.top = `${top - parentTop + height - marginBottom}px`;
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
	}

	hideOverflowElement = () => {
		const overflowElem = this.overflowElemRef.current;
		overflowElem.style.display = 'none';
	}

	render() {
		const { scrollElement, scrollElementClassName, overflowElement, marginAdjust, showCondition, matchDimensions, position, ...rest } = this.props;

		return (
			<div
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}
				className={s(`scroll-container-elem ${scrollElementClassName}`)}
				ref={this.elemRef}
				{...rest}
			>
				{ scrollElement }
				<div
					className={s("scroll-container-overflow-elem")}
					style={{ display: 'none' }}
					ref={this.overflowElemRef}
				>
					{ overflowElement }
				</div>
			</div> 
		)
	}
}

HoverableScrollElement.propTypes = {
	scrollElementClassName: PropTypes.string,
	scrollElement: PropTypes.element.isRequired,
	overflowElement: PropTypes.element.isRequired,
	showCondition: PropTypes.oneOfType([
		PropTypes.oneOf(["hover"]),
		PropTypes.bool
	]).isRequired,
	position: PropTypes.oneOf(["top", "left", "bottom", "right"]).isRequired,
	matchDimensions: PropTypes.bool.isRequired,
	marginAdjust: PropTypes.bool.isRequired,
}

HoverableScrollElement.defaultProps = {
}

export default HoverableScrollElement;