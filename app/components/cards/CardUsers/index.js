import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';

import CardUser from './CardUser';
import CircleButton from '../../common/CircleButton';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const CardUsers = ({ className, users }) => {
	return (	
		<div className={s(`${className} text-gray-dark flex w-full overflow-auto`)}>
			{ users.map(({ name, img }) => (
				<CardUser
					size="md"
					name={name}
					img={img}
					className={s("mr-xs")}
					onRemove={() => console.log('Removed!')}
				/>
			))}
			<CircleButton
				content={<IoMdAdd size={30} />}
				containerClassName={s("text-purple-reg pt-sm ml-xs")}
				buttonClassName={s("bg-purple-gray-10")}
				size="md"
				label="Add"
			/>
		</div>
	);
}

CardUsers.propTypes = {
	className: PropTypes.string,
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
}

CardUsers.defaultProps = {
	className: '',
	size: 'md',
}

export default CardUsers;