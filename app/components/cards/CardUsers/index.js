import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IoMdAdd } from 'react-icons/io';
import _ from 'lodash';

import CardUser from '../CardUser';
import CircleButton from '../../common/CircleButton';
import PlaceholderImg from '../../common/PlaceholderImg';
import Select from '../../common/Select';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestSearchUsers } from '../../../actions/search';

import { getArrayWithout } from '../../../utils/array';
import { DEBOUNCE_60_HZ } from '../../../utils/constants';
import { createSelectOptions, simpleInputFilter } from '../../../utils/select';

import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn();

class CardUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSelect: false,
    };
  }

  loadOptions = (inputValue) => {
    this.props.requestSearchUsers(inputValue);
  }

  render() {
    const { className, size, showNames, isEditable, userOptions, isSearchingUsers, users, onUserClick, onRemoveClick, onAdd, showTooltips } = this.props;
    const showSelect = this.state.showSelect || this.props.showSelect;
    return (
      <div className={s(`card-users-container ${className}`)}>
        { showSelect &&
        <Select
          className={s('w-full mb-sm')}
          value={null}
          options={getArrayWithout(userOptions, users, '_id')}
          onChange={option => onAdd(option)}
          onInputChange={_.debounce(this.loadOptions, DEBOUNCE_60_HZ)}
          onFocus={() => this.loadOptions('')}
          isSearchable
          menuShouldScrollIntoView
          isClearable={false}
          placeholder={'Add users...'}
          getOptionLabel={option => option.name}
          getOptionValue={option => option._id}
          formatOptionLabel={({ _id, name, img }) => (
            <div className={s('flex items-center')}>
              <PlaceholderImg src={img} name={name} className={s('h-3xl w-3xl rounded-full mr-sm')} />
              <div> {name} </div>
            </div>
                   )}
          noOptionsMessage={() => isSearchingUsers ? 'Searching users...' : 'No options'}
        />
        }
        { users.map(({ _id, name, firstname, lastname, img, isEditable: userIsEditable }, i) => (
          <CardUser
            key={_id}
            size={size}
            name={name || `${firstname} ${lastname}`}
            showName={showNames}
            img={img}
            className={s('mr-sm mb-sm')}
            onClick={onUserClick}
            onRemoveClick={isEditable && (userIsEditable == undefined || userIsEditable === true) ?
              () => onRemoveClick(i) :
              null
            }
            showTooltip={showTooltips}
          />
        ))}
        { !isEditable && users.length === 0 &&
        <div className={s('text-sm text-gray-light')}>
            No current users
          </div>
        }
        { isEditable && onAdd && !showSelect &&
        <CircleButton
          content={<IoMdAdd size={30} />}
          containerClassName={s('text-purple-reg')}
          buttonClassName={s('bg-purple-gray-10')}
          labelClassName={s('text-xs')}
          size={size}
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
    isEditable: PropTypes.bool,
  })).isRequired,
  onRemoveClick: PropTypes.func,
  onUserClick: PropTypes.func,
  onAdd: PropTypes.func,
  showSelect: PropTypes.bool,
  showTooltips: PropTypes.bool,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])
  ]),
  showNames: PropTypes.bool,
};

CardUsers.defaultProps = {
  className: '',
  size: 'md',
  showSelect: false,
  showTooltips: false,
  showNames: true,
};

export default connect(
  state => ({
    userOptions: state.search.users,
    isSearchingUsers: state.search.isSearchingUsers,
  }),
  dispatch => bindActionCreators({
    requestSearchUsers,
  }, dispatch)
)(CardUsers);
