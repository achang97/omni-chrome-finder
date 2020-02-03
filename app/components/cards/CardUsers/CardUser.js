import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import CircleButton from '../../common/CircleButton';
import PlaceholderImg from '../../common/PlaceholderImg';

import style from './card-users.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const CardUser = ({ className, name, img, size, onClick, onRemoveClick, ...rest }) => {
	return (	
		<div className={s(`card-user ${className} ${onRemoveClick ? 'pr-sm pt-sm' : ''}`)} {...rest}>
			<CircleButton
				content={<PlaceholderImg src={img} name={name} className={s("w-full h-full")} />}
				size={size}
				label={name}
				labelClassName={s("card-user-label")}
				onClick={onClick}
			/>
			{ onRemoveClick &&
				<button onClick={onRemoveClick} className={s("absolute top-0 right-0 text-purple-gray-50")}>
					<MdClose />
				</button>
			}
		</div>
	);
}

CardUser.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string.isRequired,
	img: PropTypes.string,
	size: PropTypes.oneOfType([
	    PropTypes.number,
	    PropTypes.oneOf(['sm', 'md', 'lg'])
	]),
	onClick: PropTypes.func,
	onRemoveClick: PropTypes.func,
}

CardUser.defaultProps = {
	className: '',
	size: 'md',
}

export default CardUser;