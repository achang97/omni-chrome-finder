import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './button.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);
const editIcon = require('../../../assets/images/Icons/edit.svg');


//const CLASSNAME_PROPS = ["tabContainerClassName", "rippleClassName", "tabClassName", "activeTabClassName", "inactiveTabClassName"];

class Button extends Component {
	constructor(props) {
		super(props);
	}

/*
	onTabClick = (i) => {
		const { onTabClick } = this.props;
		if (onTabClick) {
			onTabClick(i);
		}
	}

	getBaseTabProps = (i) => {
		const {
			activeIndex,
			rippleClassName, tabContainerClassName, tabClassName, activeTabClassName, inactiveTabClassName,
			color, indicatorColor, showIndicator,
			showRipple,
		} = this.props;
		const isActive = activeIndex === i;

		return {
			isActive,
			onTabClick: () => this.onTabClick(i),
			rippleClassName, tabContainerClassName, tabClassName, activeTabClassName, inactiveTabClassName,
			color, indicatorColor, showIndicator,
			showRipple,
		}
	}

	renderTab = (label, i) => {
		const baseTabProps = this.getBaseTabProps(i);
		return (
			<Tab
				key={typeof(label) === 'string' ? label : i}
				label={label}
				{...baseTabProps}
			/>
		)
	}

	mergeProps = (baseProps, childProps) => {
		const mergedProps = baseProps;

		Object.entries(childProps).forEach(([propKey, childPropValue]) => {
			if (childPropValue !== undefined && childPropValue !== null & childPropValue !== '') {
				if (CLASSNAME_PROPS.includes(propKey)) {
					mergedProps[propKey] += ` ${childPropValue}`;
				} else {
					mergedProps[propKey] = childPropValue;
				}
			}			
		});

		return mergedProps;
	}

	renderChildren = () => {
		const { children } = this.props;
		return (
			children.map((child, i) => (
				React.cloneElement(child, this.mergeProps(this.getBaseTabProps(i), child.props))
			))
		)
	}

	render() {
		const { labels, className } = this.props;
		return (
			<div className={s(`${className} flex overflow-x-scroll hide-scrollbar max-w-full`)}>
				{ labels ? 
					labels.map((label, i) => this.renderTab(label, i)) :
					this.renderChildren() 
				}
			</div>
		);
	}
*/
	onClickButton = () => {
		if (this.props.onClickButton) this.props.onClickButton();
	}

	render() {
		const { text, textClassName, icon, buttonClassName } = this.props;
		return (
			<div>
				<div className={s(` ${buttonClassName} flex button-container`)} onClick={() => this.onClickButton()}>
					{ icon }
					<div className={s(`button-text button-text-underline ${textClassName}`)}>{text}</div>
				</div>
				
			</div>
		);
	}
}

Button.propTypes = {
	text: PropTypes.string,
	buttonClassName: PropTypes.string,
	textClassName: PropTypes.string,
	underline: PropTypes.bool,
	onClickButton: PropTypes.func,
	icon: PropTypes.element,
}


Button.defaultProps = {
	text: '',
	buttonClassName: '',
	textClassName: '',
	underline: false,
	icon: null,
}
/*
Tabs.propTypes = {
	labels: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.string])),
	activeIndex: PropTypes.number.isRequired,
	onTabClick: PropTypes.func.isRequired,
	className: PropTypes.string,
	rippleClassName: PropTypes.string,
	tabContainerClassName: PropTypes.string,
	tabClassName: PropTypes.string,
	activeTabClassName: PropTypes.string,
	inactiveTabClassName: PropTypes.string,
	color: PropTypes.string,
	indicatorColor: PropTypes.string,
	showIndicator: PropTypes.bool,
	showRipple: PropTypes.bool,
}

Tabs.defaultProps = {
	className: '',
	tabContainerClassName: '',
	rippleClassName: '',
	tabClassName: '',
	activeTabClassName: '',
	inactiveTabClassName: '',
	showIndicator: true,
	showRipple: true,
}*/

export default Button;