import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import ReactResizeDetector from 'react-resize-detector';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import animate from '../../../utils/animate';

import Tab from './Tab';

import style from './tabs.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const CLASSNAME_PROPS = ['tabContainerClassName', 'rippleClassName', 'tabClassName', 'activeTabClassName', 'inactiveTabClassName'];

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayScroll: {
        start: false,
        end: false
      }
    }

    this.tabsRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { children = [], labels = [] } = this.props;
    const { children: prevChildren = [], labels: prevLabels = [] } = prevProps;

    if (prevChildren.length !== children.length || prevLabels.length !== labels.length) {
      this.handleResize();
    }

    if (prevChildren.length < children.length || prevLabels.length < labels.length) {
      const { scrollWidth, scrollLeft } = this.tabsRef.current;
      this.moveTabsScroll(scrollWidth - scrollLeft);
    }
  }

  moveTabsScroll = delta => {
    const scrollValue = this.tabsRef.current['scrollLeft'] + delta;
    animate('scrollLeft', this.tabsRef.current, scrollValue);
  };

  handleScrollClick = (isStart) => {
    this.moveTabsScroll((isStart ? -1 : 1) * this.tabsRef.current['clientWidth']);
  };

  handleResize = _.debounce(() => {
    const { scrollLeft, scrollWidth, clientWidth } = this.tabsRef.current;
    const { displayScroll } = this.state;

    // use 1 for the potential rounding error with browser zooms.
    const showStartScroll = scrollLeft > 1;
    const showEndScroll = scrollLeft < scrollWidth - clientWidth - 1;

    if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
      this.setState({ displayScroll: { start: showStartScroll, end: showEndScroll } });
    }
  }, 166)

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
        key={typeof (label) === 'string' ? label : i}
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

  renderScrollButton = (isStart) => {
    const { scrollButtonColor } = this.props;
    const { displayScroll: { start: displayScrollStart, end: displayScrollEnd } } = this.state;
    const showScrollButtons = displayScrollStart || displayScrollEnd;

    if (!showScrollButtons) {
      return null;
    }

    const isDisabled = isStart ? !displayScrollStart : !displayScrollEnd;
    const Icon = isStart ? MdChevronLeft : MdChevronRight;

    return (
      <button disabled={isDisabled} className={s(isDisabled ? 'opacity-25' : '')}>
        <Icon onClick={() => this.handleScrollClick(isStart)} color={scrollButtonColor} />
      </button>
    );
  }

  render() {
    const { labels, className, allTabsContainerClassName } = this.props;
    return (
      <div className={s(`tabs-all-container ${className}`)}>
        {this.renderScrollButton(true)}
        <div
          ref={this.tabsRef}
          className={s(`tabs-tab-container hide-scrollbar ${allTabsContainerClassName}`)}
          onScroll={this.handleResize}
        >
          {labels ?
            labels.map((label, i) => this.renderTab(label, i)) :
            this.renderChildren()
          }
          <ReactResizeDetector handleWidth onResize={this.handleResize} />
        </div>
        {this.renderScrollButton(false)}
      </div>
    );
  }
}

Tabs.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.string])),
  activeIndex: PropTypes.number.isRequired,
  onTabClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  allTabsContainerClassName: PropTypes.string,
  rippleClassName: PropTypes.string,
  tabContainerClassName: PropTypes.string,
  tabClassName: PropTypes.string,
  activeTabClassName: PropTypes.string,
  inactiveTabClassName: PropTypes.string,
  color: PropTypes.string,
  indicatorColor: PropTypes.string,
  showIndicator: PropTypes.bool,
  showRipple: PropTypes.bool,
  scrollButtonColor: PropTypes.string,
}

Tabs.defaultProps = {
  className: '',
  allTabsContainerClassName: '',
  tabContainerClassName: '',
  rippleClassName: '',
  tabClassName: '',
  activeTabClassName: '',
  inactiveTabClassName: '',
  showIndicator: true,
  showRipple: true,
}

export default Tabs;
