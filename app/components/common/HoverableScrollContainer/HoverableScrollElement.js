import React, { Component } from 'react';
import PropTypes from 'prop-types';

import style from './hoverable-scroll-container.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

class HoverableScrollElement extends Component {
	constructor(props) {
		super(props);

		this.elemRef = React.createRef();
		this.hoverElemRef = React.createRef();
	}

	onMouseOver = (e) => {
		const { top, bottom, left, right, height, width } = e.currentTarget.getBoundingClientRect();
		const { top: parentTop, bottom: parentBottom, left: parentLeft, right: parentRight } = e.currentTarget.offsetParent.getBoundingClientRect();
		const { position, offset } = this.props;

		const hoverElem = this.hoverElemRef.current;

		switch (position) {
			case "top": {
				hoverElem.style.right = `${offset.right}px`;
				hoverElem.style.top = `${top - parentTop + offset.top - hoverElem.getBoundingClientRect().height}px`;
				// console.log(top - parentTop + offset.top)
				break;				
			}
			case "bottom": {
				hoverElem.style.right = `${offset.right}px`;
				hoverElem.style.top = `${top - parentTop + offset.top + height}px`;
				break;				
			}
			case "left": {
				hoverElem.style.right = `${width + offset.right}px`;
				hoverElem.style.top = `${top - parentTop + offset.top}px`;
				break;
			}
			case "right": {
				hoverElem.style.left = `${width + offset.left}px`;
				hoverElem.style.top = `${top - parentTop + offset.top}px`;
				break;
			}
		}
	}

	render() {
		const { scrollElement, hoverElement, position, positionOffset, ...rest } = this.props;

		return (
			<div
				onMouseOver={this.onMouseOver}
				className={s("hoverable-scroll-container-elem")}
				ref={this.elemRef}
				{...rest}
			>
				{ scrollElement }
				<div
					className={s("hoverable-scroll-container-hover-elem")}
					ref={this.hoverElemRef}
				>
					{ hoverElement }
				</div>
			</div> 
		)
	}
}

HoverableScrollElement.propTypes = {
	scrollElement: PropTypes.element.isRequired,
	hoverElement: PropTypes.element.isRequired,
	position: PropTypes.oneOf(["top", "left", "bottom", "right"]).isRequired,
	positionOffset: PropTypes.shape({
		top: PropTypes.number,
		left: PropTypes.number,
		bottom: PropTypes.number,
		right: PropTypes.number,
	}).isRequired,
}

HoverableScrollElement.defaultProps = {
}

export default HoverableScrollElement;