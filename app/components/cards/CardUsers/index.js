import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';

import CardUser from './CardUser';
import CircleButton from '../../common/CircleButton';
import PlaceholderImg from '../../common/PlaceholderImg';
import Select from '../../common/Select';

import { USER_OPTIONS } from '../../../utils/constants';
import { createSelectOptions, simpleInputFilter } from '../../../utils/selectHelpers';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

class CardUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showSelect: false,
		}
	}

	render() {
		const { className, isEditable, users, onUserClick, onRemoveClick, onAdd } = this.props;
		const showSelect = this.state.showSelect || this.props.showSelect;
		return (
			<div className={s(`card-users-container ${className}`)}>
				{ showSelect &&
					<Select
						className={s("w-full mb-sm")}
			            value={null}
			            options={USER_OPTIONS}
			            onChange={option => onAdd(option)}
			            isSearchable
			            menuShouldScrollIntoView
			            isClearable={false}
			            placeholder={"Add users..."}
			            getOptionLabel={option => option.name}
			            getOptionValue={option => option}
			            formatOptionLabel={({ id, name, img }) => (
							<div className={s("flex items-center")}>
								<PlaceholderImg src={img} name={name} className={s("h-3xl w-3xl rounded-full mr-sm")} />
								<div> {name} </div>
							</div>
			           	)}
					/>
				}
				{ users.map(({ id, name, img }, i) => (
					<CardUser
						key={id}
						size="md"
						name={name}
						img={img}
						className={s("mr-reg")}
						onClick={onUserClick}
						onRemoveClick={isEditable ? () => onRemoveClick(i) : null}
					/>
				))}
				{ !isEditable && users.length === 0 &&
					<div className={s("text-sm text-gray-light")}>
						No current users
					</div>
				}
				{ isEditable && onAdd && !showSelect &&
					<CircleButton
						content={<IoMdAdd size={30} />}
						containerClassName={s("text-purple-reg pt-sm ml-xs")}
						buttonClassName={s("bg-purple-gray-10")}
						labelClassName={s("text-xs")}
						size="md"
						label="Add"
						onClick={() => this.setState({ showSelect: true })}
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
	showSelect: PropTypes.bool,
}

CardUsers.defaultProps = {
	className: '',
	showSelect: false,
}

export default CardUsers;