import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';
import _ from 'lodash';

import CardUser from './CardUser';
import CircleButton from '../../common/CircleButton';
import PlaceholderImg from '../../common/PlaceholderImg';
import Select from '../../common/Select';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestSearchUsers } from '../../../actions/search';

import { DEBOUNCE_60_HZ } from '../../../utils/constants';
import { createSelectOptions, simpleInputFilter } from '../../../utils/selectHelpers';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

@connect(
  state => ({
  	userOptions: state.search.users,
  	isSearchingUsers: state.search.isSearchingUsers,
  }),
  dispatch => bindActionCreators({
    requestSearchUsers,
  }, dispatch)
)

class CardUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showSelect: false,
		}
	}

	loadOptions = (inputValue) => {
		this.props.requestSearchUsers(inputValue);
	}

	render() {
		const { className, isEditable, userOptions, isSearchingUsers, users, onUserClick, onRemoveClick, onAdd } = this.props;
		const showSelect = this.state.showSelect || this.props.showSelect;
		return (
			<div className={s(`card-users-container ${className}`)}>
				{ showSelect &&
					<Select
						className={s("w-full mb-sm")}
			            value={null}
			            options={userOptions.filter(userOption => !users.some(user => user._id === userOption._id))}
			            onChange={option => onAdd(option)}
			            onInputChange={_.debounce(this.loadOptions, DEBOUNCE_60_HZ)}
			            onFocus={() => this.loadOptions("")}
			            isSearchable
			            menuShouldScrollIntoView
			            isClearable={false}
			            placeholder={"Add users..."}
			            getOptionLabel={option => option.name}
			            getOptionValue={option => option._id}
			            formatOptionLabel={({ _id, name, img }) => (
							<div className={s("flex items-center")}>
								<PlaceholderImg src={img} name={name} className={s("h-3xl w-3xl rounded-full mr-sm")} />
								<div> {name} </div>
							</div>
			           	)}
			            noOptionsMessage={() => isSearchingUsers ? 'Searching users...' : 'No options' }
					/>
				}
				{ users.map(({ _id, name, firstname, lastname, img }, i) => (
					<CardUser
						key={_id}
						size="md"
						name={name || `${firstname} ${lastname}`}
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
		_id: PropTypes.string.isRequired,
		name: PropTypes.string,
		firstname: PropTypes.string,
		lastname: PropTypes.string,
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