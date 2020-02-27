import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';
import { MdClose, MdLock } from 'react-icons/md';
import _ from 'underscore';

import CardTag from './CardTag';
import Select from '../../common/Select';

import { NOOP, DEBOUNCE_60_HZ } from '../../../utils/constants';
import { createSelectOptions, simpleInputFilter } from '../../../utils/selectHelpers';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestSearchTags } from '../../../actions/search';

import style from './card-tags.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
  	tagOptions: state.search.tags,
  	isSearchingTags: state.search.isSearchingTags,
  }),
  dispatch => bindActionCreators({
    requestSearchTags,
  }, dispatch)
)

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
		if (prevProps.maxWidth !== this.props.maxWidth || JSON.stringify(prevProps.tags) !== JSON.stringify(this.props.tags)) {
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

	renderOptionLabel = ({ name, locked }) => (
		<div className={s("flex items-center")}>
			<div> {name} </div>
			{ locked && <MdLock className={s("ml-xs")} /> }
		</div>
	);

	renderTag = ({ name, _id, locked }, i) => {
		const { maxWidth, tags, onTagClick, onRemoveClick, isEditable } = this.props;
		const { firstHiddenIndex } = this.state;
		return (
			<Fragment key={_id}>
				{i === firstHiddenIndex &&
					<CardTag
						text={`+${tags.length - firstHiddenIndex}`}
						className={s("flex items-center mb-xs")}
						onClick={onTagClick}
					/>
				}
				<CardTag
					key={name}
					text={this.renderOptionLabel({ name, locked })}
					ref={maxWidth && ((instance)=>{this.tagRefs[i] = instance;})}
					className={s(`flex items-center mr-xs mb-xs ${maxWidth ? `whitespace-no-wrap ${i >= firstHiddenIndex ? 'invisible' : ''}` : ''}`)}
					onClick={onTagClick}
					onRemoveClick={isEditable ? () => onRemoveClick(i) : NOOP}
				/>
			</Fragment>
		)
	}

	loadOptions = (inputValue) => {
		this.props.requestSearchTags(inputValue);
	}

	render() {
		const { className, tags, tagOptions, isSearchingTags, onChange, onTagClick, onRemoveClick, maxWidth, isEditable, showPlaceholder, hideSelectOnBlur } = this.props;
		const { firstHiddenIndex } = this.state;
		const containerStyle = this.getContainerStyle();

		return (	
			<div
				className={s(`card-tags-container ${maxWidth ? 'flex-shrink-1 min-w-0' : 'card-tags-container-wrap'} ${className}`)}
				style={containerStyle}
			>
				{ (this.state.showSelect || this.props.showSelect) ?
					<Select
						className={s("w-full")}
			            value={tags}
			            options={tagOptions}
			            onChange={onChange}
			            onInputChange={_.debounce(this.loadOptions, DEBOUNCE_60_HZ)}
			            onFocus={() => this.loadOptions("")}
			            isSearchable
			            isMulti
			            menuShouldScrollIntoView
			            isClearable={false}
			            placeholder={"Add tags..."}
			            onBlur={hideSelectOnBlur ? () => this.setState({ showSelect: false }) : NOOP}
			            getOptionLabel={option => option.name}
			            getOptionValue={option => option._id}
			            formatOptionLabel={this.renderOptionLabel}
			            noOptionsMessage={() => isSearchingTags ? 'Searching tags...' : 'No options' }
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
	tags: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		_id: PropTypes.string.isRequired,
		locked: PropTypes.bool.isRequired,
	})).isRequired,
	maxWidth: PropTypes.number,
	onChange: PropTypes.func,
	onTagClick: PropTypes.func,
	onRemoveClick: PropTypes.func,
	showPlaceholder: PropTypes.bool,
	showSelect: PropTypes.bool,
	hideSelectOnBlur: PropTypes.bool,
}

CardTags.defaultProps = {
	className: '',
	size: 'md',
	showPlaceholder: false,
	showSelect: false,
	hideSelectOnBlur: false,
}

export default CardTags;