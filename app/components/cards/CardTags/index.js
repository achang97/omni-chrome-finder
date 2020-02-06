import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';
import { MdClose } from 'react-icons/md';

import CardTag from './CardTag';

import style from './card-tags.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

class CardTags extends Component {
	constructor(props) {
		super(props);

		this.state = {
			firstHiddenIndex: props.tags.length,
		}

		this.tagRefs = [];
	}

	componentDidMount() {
		const firstHiddenIndex = this.getFirstHiddenIndex();
		this.setState({ firstHiddenIndex });
	}

	componentDidUpdate(prevProps) {
		if (prevProps.maxWidth !== this.props.maxWidth) {
			const firstHiddenIndex = this.getFirstHiddenIndex();
			this.setState({ firstHiddenIndex });
		}
	}

	getFirstHiddenIndex = () => {
		const { maxWidth, tags } = this.props;

		let totalWidth = 0;

		if (maxWidth) {
			let i;
			for (i = 0; i < tags.length; i++) {
				if (this.tagRefs[i]) {
					const { width } = this.tagRefs[i].getBoundingClientRect();
					totalWidth += width;

					if (totalWidth >= maxWidth) return i;						
				} else {
					break;
				}
			}
		}

		return tags.length;
	}

	getContainerStyle = () => {
		const { maxWidth } = this.props;
		if (!maxWidth) {
			return {};
		} else {
			return { maxWidth };
		}
	}

	renderTag = (tag, i) => {
		const { maxWidth, tags, onTagClick, onRemoveClick } = this.props;
		const { firstHiddenIndex } = this.state;
		return (
			<Fragment key={tag}>
				{i === firstHiddenIndex &&
					<CardTag
						text={`+${tags.length - firstHiddenIndex}`}
						className={s("flex items-center mb-xs")}
						onClick={onTagClick}
					/>
				}
				<CardTag
					key={tag}
					text={tag}
					ref={maxWidth && ((instance)=>{this.tagRefs[i] = instance;})}
					className={s(`flex items-center mr-xs mb-xs ${maxWidth ? `whitespace-no-wrap ${i >= firstHiddenIndex ? 'invisible' : ''}` : ''}`)}
					onClick={onTagClick}
					onRemoveClick={onRemoveClick}
				/>
			</Fragment>
		)
	}

	render() {
		const { className, tags, onTagClick, onAddClick, onRemoveClick, maxWidth } = this.props;
		const { firstHiddenIndex } = this.state;
		const containerStyle = this.getContainerStyle();

		return (	
			<div
				className={s(`card-tags-container ${maxWidth ? 'flex-shrink-1 min-w-0' : 'card-tags-container-wrap'} ${className}`)}
				style={containerStyle}
			>
				{ tags.map((tag, i) => this.renderTag(tag, i)) }
				{ onAddClick &&
					<CardTag
						text={
							<div className={s("flex items-center")}>
								<div> Add Tag </div>
								<IoMdAdd className={s("ml-xs")} />
							</div>
						}
						className={s("mr-xs mb-xs primary-gradient text-white")}
						onClick={onAddClick}
					/>
				}
			</div>
		);		
	}
}

CardTags.propTypes = {
	className: PropTypes.string,
	tags: PropTypes.arrayOf(PropTypes.string).isRequired,
	maxWidth: PropTypes.number,
	onTagClick: PropTypes.func,
	onAddClick: PropTypes.func,
	onRemoveClick: PropTypes.func,
}

CardTags.defaultProps = {
	className: '',
	size: 'md',
}

export default CardTags;