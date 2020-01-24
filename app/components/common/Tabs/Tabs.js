import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tab from './Tab';

import style from './tabs.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const CLASSNAME_PROPS = ["tabContainerClassName", "rippleClassName", "tabClassName", "activeTabClassName", "inactiveTabClassName"];

class Tabs extends Component {
	constructor(props) {
		super(props);
	}

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
}

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
}

export default Tabs;