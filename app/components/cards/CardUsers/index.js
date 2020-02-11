import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';

import CardUser from './CardUser';
import CircleButton from '../../common/CircleButton';
import PlaceholderImg from '../../common/PlaceholderImg';
import Select from '../../common/Select';

import { USER_OPTIONS } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/selectHelpers';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const SELECT_USER_OPTIONS = createSelectOptions(USER_OPTIONS, ({ id, name, img }) => ({
	label: (
		<div className={s("flex items-center")}>
			<PlaceholderImg src={img} name={name} className={s("h-3xl w-3xl rounded-full mr-sm")} />
			<div> {name} </div>
		</div>
	),
	value: { id, name, img }
}));

class CardUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addSelectShown: false,
		}
	}

	render() {
		const { className, isEditable, users, onUserClick, onRemoveClick, onAdd } = this.props;
		const { addSelectShown } = this.state;

		return (
			<div className={s(`card-users-container ${className}`)}>
				{ addSelectShown &&
					<Select
						className={s("w-full mb-sm")}
			            value={null}
			            options={SELECT_USER_OPTIONS}
			            onChange={({ label, value }) => onAdd(value)}
			            isSearchable
			            menuShouldScrollIntoView
			            isClearable={false}
			            placeholder={"Add users..."}
					/>
				}
				{ users.map(({ id, name, img }) => (
					<CardUser
						key={id}
						size="md"
						name={name}
						img={img}
						className={s("mr-reg")}
						onClick={onUserClick}
						onRemoveClick={isEditable ? onRemoveClick : null}
					/>
				))}
				{ !isEditable && users.length === 0 &&
					<div className={s("text-sm text-gray-light")}>
						No current users
					</div>
				}
				{ isEditable && onAdd && !addSelectShown &&
					<CircleButton
						content={<IoMdAdd size={30} />}
						containerClassName={s("text-purple-reg pt-sm ml-xs")}
						buttonClassName={s("bg-purple-gray-10")}
						labelClassName={s("text-xs")}
						size="md"
						label="Add"
						onClick={() => this.setState({ addSelectShown: true })}
					/>
				}
			</div>
		);
	}
}

CardUsers.propTypes = {
	isEditable: PropTypes.bool.isRequired,
	className: PropTypes.string,
	users: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		img: PropTypes.string,
	})).isRequired,
	onRemoveClick: PropTypes.func,
	onUserClick: PropTypes.func,
	onAdd: PropTypes.func,
}

CardUsers.defaultProps = {
	className: '',
}

export default CardUsers;