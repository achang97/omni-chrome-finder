import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

class CardSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isExpanded: props.startExpanded,
		}
	}

	toggleSection = () => {
		this.setState({ isExpanded: !this.state.isExpanded });
	}

	render() {
		const { title, isExpandable, showSeparator, className, children } = this.props;
		const { isExpanded } = this.state;

		return (
			<div className={className}>
				<div className={s("flex mb-lg items-center")}>
					<div className={s("font-semibold mr-reg text-sm text-black button-hover")} onClick={this.toggleSection}>
						{title}
					</div>
					{ isExpandable &&
						<button className={s("text-gray-light flex items-center")} onClick={this.toggleSection}>
							{ isExpanded ? <MdExpandLess /> : <MdExpandMore /> }
						</button>
					}
				</div>
				<AnimateHeight height={isExpandable && isExpanded ? 'auto' : 0}>
					{ children }
				</AnimateHeight>
				{ showSeparator &&
					<div className={s("horizontal-separator mt-lg")} />
				}
			</div>
		);
	}
}

CardSection.propTypes = {
	title: PropTypes.string.isRequired,
	isExpandable: PropTypes.bool,
	startExpanded: PropTypes.bool,
	showSeparator: PropTypes.bool,
	className: PropTypes.string,
}

CardSection.defaultProps = {
	isExpandable: true,
	startExpanded: true,
	showSeparator: true,
	className: '',
}

export default CardSection;