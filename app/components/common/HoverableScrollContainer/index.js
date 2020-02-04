import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HoverableScrollElement from './HoverableScrollElement';

import style from './hoverable-scroll-container.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const HoverableScrollContainer = ({ list, renderScrollElement, renderHoverElement, footer, scrollY, scrollContainerClassName, children, position, positionOffset }) => {
	return (
		<div className={s("relative")}>
			<div className={s(`${scrollY ? 'overflow-x-hidden overflow-y-auto' : 'overflow-y-hidden overflow-x-auto'} ${scrollContainerClassName}`)}>
				{ list.map((listElem, i) => (
					<HoverableScrollElement
						key={i}
						scrollElement={renderScrollElement(listElem, i)}
						hoverElement={renderHoverElement(listElem, i)}
						position={position}
						offset={{ top: 0, bottom: 0, left: 0, right: 0, ...positionOffset}}
					/>
				))}
				{ footer }
			</div>
		</div>
	)
}

HoverableScrollContainer.propTypes = {
	list: PropTypes.arrayOf(PropTypes.any).isRequired,
	renderScrollElement: PropTypes.func.isRequired,
	renderHoverElement: PropTypes.func.isRequired,
	scrollY: PropTypes.bool,
	scrollContainerClassName: PropTypes.string,
	footer: PropTypes.element,
	position: PropTypes.oneOf(["top", "left", "bottom", "right"]),
	positionOffset: PropTypes.shape({
		top: PropTypes.number,
		left: PropTypes.number,
		bottom: PropTypes.number,
		right: PropTypes.number,
	})
}

HoverableScrollContainer.defaultProps = {
	scrollY: true,
	scrollContainerClassName: '',
	position: 'left',
	positionOffset: {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	}
}

export default HoverableScrollContainer;