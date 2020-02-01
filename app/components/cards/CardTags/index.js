import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';
import { MdClose } from 'react-icons/md';

import CardTag from './CardTag';

import style from './card-tags.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const CardTags = ({ className, tags, onTagClick, onAddClick, onRemoveClick }) => {
	return (	
		<div className={s(`card-tags-container ${className}`)}>
			{ tags.map((tag) => (
				<CardTag
					key={tag}
					text={tag}
					className={s("flex items-center mr-xs mb-xs")}
					onClick={onTagClick}
					onRemoveClick={onRemoveClick}
				/>
			))}
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

CardTags.propTypes = {
	className: PropTypes.string,
	tags: PropTypes.arrayOf(PropTypes.string).isRequired,
	onTagClick: PropTypes.func,
	onAddClick: PropTypes.func,
	onRemoveClick: PropTypes.func,
}

CardTags.defaultProps = {
	className: '',
	size: 'md',
}

export default CardTags;