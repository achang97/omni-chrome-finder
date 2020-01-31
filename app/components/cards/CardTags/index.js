import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';
import { MdClose } from 'react-icons/md';

import CardTag from './CardTag';

import style from './card-tags.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const CardTags = ({ className, tags, isEditable, onTagClick, onAddClick, onRemoveClick }) => {
	const onRemove = (e) => {
		e.stopPropagation();
		onRemoveClick();
	}

	return (	
		<div className={s(`${className} text-gray-dark flex flex-wrap`)}>
			{ tags.map((tag) => (
				<CardTag
					key={tag}
					text={
						<div className={s("flex items-center")}>
							<div> {tag} </div>
							{ isEditable &&
								<MdClose onClick={onRemove} className={s("ml-xs")} />
							}
						</div>
					}
					className={s("mr-xs mb-xs")}
					onClick={onTagClick}
				/>
			))}
			{ isEditable &&
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
	isEditable: PropTypes.bool,
	onTagClick: PropTypes.func,
	onAddClick: PropTypes.func,
	onRemoveClick: PropTypes.func,
}

CardTags.defaultProps = {
	className: '',
	size: 'md',
	isEditable: false,
}

export default CardTags;