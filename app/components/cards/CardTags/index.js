import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';
import { MdClose, MdLock } from 'react-icons/md';

import CardTag from './CardTag';
import Select from '../../common/Select';

import { NOOP, TAG_OPTIONS } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/selectHelpers';

import style from './card-tags.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const SELECT_TAG_OPTIONS = createSelectOptions(TAG_OPTIONS, ({ tag, id, isLocked }) => ({
	label: (
		<div className={s("flex items-center")}>
			<div> {tag} </div>
			{ isLocked && <MdLock className={s("ml-xs")} /> }
		</div>
	),
	value: { tag, id, isLocked }
}));

class CardTags extends Component {
	constructor(props) {
		super(props);

		this.state = {
			firstHiddenIndex: props.tags.length,
			showSelect: false,
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

	renderTag = ({ label, value }, i) => {
		const { tag, id, isLocked } = value;
		const { maxWidth, tags, onTagClick, onRemoveClick, isEditable } = this.props;
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
					text={label}
					ref={maxWidth && ((instance)=>{this.tagRefs[i] = instance;})}
					className={s(`flex items-center mr-xs mb-xs ${maxWidth ? `whitespace-no-wrap ${i >= firstHiddenIndex ? 'invisible' : ''}` : ''}`)}
					onClick={onTagClick}
					onRemoveClick={isEditable ? () => onRemoveClick(i) : NOOP}
				/>
			</Fragment>
		)
	}

	render() {
		const { className, tags, onChange, onTagClick, onRemoveClick, maxWidth, isEditable, showPlaceholder } = this.props;
		const { firstHiddenIndex, showSelect } = this.state;
		const containerStyle = this.getContainerStyle();

		return (	
			<div
				className={s(`card-tags-container ${maxWidth ? 'flex-shrink-1 min-w-0' : 'card-tags-container-wrap'} ${className}`)}
				style={containerStyle}
			>
				{ showSelect ?
					<Select
						className={s("w-full")}
			            value={tags}
			            options={SELECT_TAG_OPTIONS}
			            onChange={onChange}
			            isSearchable
			            isMulti
			            menuShouldScrollIntoView
			            isClearable={false}
			            placeholder={"Add tags..."}
					/> :
					<React.Fragment>
						{ tags.map((tag, i) => this.renderTag(tag, i)) }
						{ !isEditable && tags.length === 0 && showPlaceholder &&
							<div className={s("text-sm text-gray-light")}>
								No current tags
							</div>
						}
						{ isEditable &&
							<CardTag
								text={
									<div className={s("flex items-center")}>
										<div> Add Tag </div>
										<IoMdAdd className={s("ml-xs")} />
									</div>
								}
								className={s("mr-xs mb-xs primary-gradient text-white")}
								onClick={() => this.setState({ showSelect: true })}
							/>
						}
					</React.Fragment>
				}
			</div>
		);		
	}
}

CardTags.propTypes = {
	isEditable: PropTypes.bool.isRequired,
	className: PropTypes.string,
	tags: PropTypes.arrayOf(PropTypes.string).isRequired,
	maxWidth: PropTypes.number,
	onChange: PropTypes.func,
	onTagClick: PropTypes.func,
	onRemoveClick: PropTypes.func,
	showPlaceholder: PropTypes.bool,
}

CardTags.defaultProps = {
	className: '',
	size: 'md',
	showPlaceholder: false,
}

export default CardTags;