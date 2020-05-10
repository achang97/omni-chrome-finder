import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoMdAdd } from 'react-icons/io';
import _ from 'lodash';

import { CircleButton, PlaceholderImg, Select } from 'components/common';

import { getArrayWithout } from 'utils/array';
import { DEBOUNCE } from 'appConstants/animate';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-users.css';
import CardUser from '../CardUser';

const s = getStyleApplicationFn(style);

const CardUsers = ({
  isEditable,
  className,
  users,
  onRemoveClick,
  onUserClick,
  onAdd,
  showSelect,
  showTooltips,
  size,
  showNames,
  userOptions,
  isSearchingUsers,
  requestSearchUsers
}) => {
  const [showSelectState, setShowSelectState] = useState(false);

  const loadOptions = (inputValue) => {
    requestSearchUsers(inputValue);
  };

  const renderUser = (user, i) => {
    const {
      _id,
      name,
      firstname,
      lastname,
      profilePicture,
      isEditable: userIsEditable = true
    } = user;

    return (
      <CardUser
        key={_id}
        size={size}
        name={name || `${firstname} ${lastname}`}
        showName={showNames}
        img={profilePicture}
        className={s('mr-sm mb-sm')}
        onClick={onUserClick}
        onRemoveClick={isEditable && userIsEditable ? () => onRemoveClick(i) : null}
        showTooltip={showTooltips}
      />
    );
  };

  const shouldShowSelect = (showSelect || showSelectState) && isEditable;
  return (
    <div className={s(`card-users-container ${className}`)}>
      {shouldShowSelect && (
        <Select
          className={s('w-full mb-sm')}
          value={null}
          options={getArrayWithout(userOptions, users, '_id')}
          onChange={(option) => onAdd(option)}
          onInputChange={_.debounce(loadOptions, DEBOUNCE.MS_300)}
          onFocus={() => loadOptions('')}
          isSearchable
          menuShouldScrollIntoView
          isClearable={false}
          placeholder="Add users..."
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option._id}
          formatOptionLabel={({ name, profilePicture }) => (
            <div className={s('flex items-center')}>
              <PlaceholderImg
                src={profilePicture}
                name={name}
                className={s('h-3xl w-3xl rounded-full mr-sm')}
              />
              <div> {name} </div>
            </div>
          )}
          noOptionsMessage={() => (isSearchingUsers ? 'Searching users...' : 'No options')}
        />
      )}
      {users.map(renderUser)}
      {!isEditable && users.length === 0 && (
        <div className={s('text-sm text-gray-light')}>No current users</div>
      )}
      {isEditable && onAdd && !shouldShowSelect && (
        <CircleButton
          content={<IoMdAdd size={30} />}
          className={s('text-purple-reg')}
          buttonClassName={s('bg-purple-gray-10')}
          labelClassName={s('text-xs')}
          size={size}
          label="Add"
          onClick={() => setShowSelectState(true)}
        />
      )}
    </div>
  );
};

const UserPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    img: PropTypes.string,
    isEditable: PropTypes.bool
  })
);

CardUsers.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  className: PropTypes.string,
  users: UserPropTypes.isRequired,
  onRemoveClick: PropTypes.func,
  onUserClick: PropTypes.func,
  onAdd: PropTypes.func,
  showSelect: PropTypes.bool,
  showTooltips: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])]),
  showNames: PropTypes.bool,

  // Redux State
  userOptions: UserPropTypes.isRequired,
  isSearchingUsers: PropTypes.bool,

  // Redux Actions
  requestSearchUsers: PropTypes.func.isRequired
};

CardUsers.defaultProps = {
  className: '',
  size: 'md',
  showSelect: false,
  showTooltips: false,
  showNames: true,
  onRemoveClick: null,
  onUserClick: null,
  onAdd: null
};

export default CardUsers;
