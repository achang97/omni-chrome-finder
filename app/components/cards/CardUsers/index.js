import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';

import CardUser from './CardUser';
import CircleButton from '../../common/CircleButton';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const CardUsers = ({ className, users, onUserClick, onRemoveClick, onAddClick }) => {
	return (	
		<div className={s(`card-users-container ${className}`)}>
			{ users.map(({ id, name, img }) => (
				<CardUser
					key={id}
					size="md"
					name={name}
					img={img}
					className={s("mr-reg")}
					onClick={onUserClick}
					onRemoveClick={onRemoveClick}
				/>
			))}
			{ onAddClick &&
				<CircleButton
					content={<IoMdAdd size={30} />}
					containerClassName={s("text-purple-reg pt-sm ml-xs")}
					buttonClassName={s("bg-purple-gray-10")}
					labelClassName={s("text-xs")}
					size="md"
					label="Add"
					onClick={onAddClick}
				/>
			}
		</div>
	);
}

CardUsers.propTypes = {
	className: PropTypes.string,
	users: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		img: PropTypes.string,
	})).isRequired,
	onRemoveClick: PropTypes.func,
	onUserClick: PropTypes.func,
	onAddClick: PropTypes.func,
}

CardUsers.defaultProps = {
	className: '',
}

export default CardUsers;