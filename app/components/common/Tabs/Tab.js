import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ripples from 'react-ripples';

import style from './tabs.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

class Tab extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			isActive, label,
			onTabClick,
			rippleClassName, tabContainerClassName, tabClassName, activeTabClassName, inactiveTabClassName,
			color, indicatorColor, showIndicator,
			children,
			...rest
		} = this.props;

		const activeTabStyle = {
			color,
			borderBottom: (color || indicatorColor) ? `2px solid ${indicatorColor || color}` : null,
		}

		return (
			<div className={s(tabContainerClassName)} style={(isActive && showIndicator) ? activeTabStyle : null}>
				<Ripples className={s(`rounded h-full ${rippleClassName}`)}>
					<button
						{...rest}
						onClick={onTabClick}
						className={s(`
							tab p-reg ${tabClassName}
							${isActive ?
								`${activeTabClassName}`:
								`opacity-50 ${inactiveTabClassName}`}
						`)}
					>
						{label ? label : children}
					</button>
				</Ripples>
			</div>
		);
	}
}

Tab.propTypes = {
	label: PropTypes.oneOf([PropTypes.element, PropTypes.string]),
	isActive: PropTypes.bool.isRequired,
	onTabClick: PropTypes.func.isRequired,
	rippleClassName: PropTypes.string,
	tabContainerClassName: PropTypes.string,
	tabClassName: PropTypes.string,
	activeTabClassName: PropTypes.string,
	inactiveTabClassName: PropTypes.string,
	color: PropTypes.string,
	indicatorColor: PropTypes.string,
	showIndicator: PropTypes.bool,
}

Tab.defaultProps = {
	tabContainerClassName: '',
	rippleClassName: '',
	tabClassName: '',
	activeTabClassName: '',
	inactiveTabClassName: '',
	showIndicator: true,
}

export default Tab;