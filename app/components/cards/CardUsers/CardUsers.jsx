import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoMdAdd } from 'react-icons/io';
import _ from 'lodash';

import { CircleButton, PlaceholderImg, Select } from 'components/common';

import { DEBOUNCE } from 'appConstants/animate';

import { isInvitedUser } from 'utils/card';
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
  onCreate,
  showSelect,
  showTooltips,
  size,
  showNames,
  placeholder,
  userOptions,
  isLoading,
  isAdmin,
  requestSearchUsers,
  requestSearchInvitedUsers
}) => {
  const [showSelectState, setShowSelectState] = useState(false);

  const loadOptions = (inputValue) => {
    requestSearchUsers(inputValue);
  };

  const onFocus = () => {
    loadOptions('');
    requestSearchInvitedUsers();
  };

  const getSelectOptionLabel = (user) => {
    const { firstname, lastname, email, label, __isNew__ } = user;

    if (__isNew__) {
      return label;
    }

    if (isInvitedUser(user)) {
      return email;
    }

    return `${firstname} ${lastname}`;
  };

  const renderUser = (user, index) => {
    const { _id, profilePicture, isEditable: userIsEditable = true } = user;
    const name = getSelectOptionLabel(user);

    return (
      <CardUser
        key={_id}
        size={size}
        name={name}
        showName={showNames}
        img={profilePicture}
        className={s('mr-sm mb-sm')}
        onClick={onUserClick}
        onRemoveClick={isEditable && userIsEditable ? () => onRemoveClick({ user, index }) : null}
        showTooltip={showTooltips}
        isInvited={isInvitedUser(user)}
      />
    );
  };

  const formatSelectOptionLabel = (option) => {
    const { profilePicture, __isNew__ } = option;
    const label = getSelectOptionLabel(option);

    return (
      <div className={s('flex items-center')}>
        {!__isNew__ && (
          <PlaceholderImg
            src={profilePicture}
            name={label}
            className={s('h-3xl w-3xl rounded-full mr-sm')}
          />
        )}
        <div> {label} </div>
      </div>
    );
  };

  const shouldShowSelect = (showSelect || showSelectState) && isEditable;

  return (
    <div className={s(`card-users-container ${className}`)}>
      {shouldShowSelect && (
        <Select
          type={isAdmin && onCreate ? 'creatable' : 'default'}
          className={s('w-full mb-sm')}
          value={null}
          options={_.differenceBy(userOptions, users, '_id')}
          onChange={({ __isNew__, ...option }) =>
            __isNew__ && onCreate ? onCreate(option.value) : onAdd(option)
          }
          onInputChange={_.debounce(loadOptions, DEBOUNCE.MS_300)}
          onFocus={onFocus}
          isSearchable
          menuShouldScrollIntoView
          isClearable={false}
          placeholder="Add users..."
          getOptionLabel={getSelectOptionLabel}
          formatCreateLabel={(inputValue) => `Invite ${inputValue}`}
          getOptionValue={({ _id, value, __isNew__ }) => (__isNew__ ? value : _id)}
          formatOptionLabel={formatSelectOptionLabel}
          noOptionsMessage={() => (isLoading ? 'Searching users...' : 'No options')}
        />
      )}
      {users.map(renderUser)}
      {!isEditable && users.length === 0 && (
        <div className={s('text-sm text-gray-light')}>{placeholder}</div>
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

const UsersPropTypes = PropTypes.arrayOf(
  PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      img: PropTypes.string,
      isEditable: PropTypes.bool
    }),
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      email: PropTypes.string,
      isEditable: PropTypes.bool
    })
  ])
);

CardUsers.propTypes = {
  isEditable: PropTypes.bool,
  className: PropTypes.string,
  users: UsersPropTypes.isRequired,
  onRemoveClick: PropTypes.func,
  onUserClick: PropTypes.func,
  onAdd: PropTypes.func,
  onCreate: PropTypes.func,
  showSelect: PropTypes.bool,
  showTooltips: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])]),
  showNames: PropTypes.bool,
  placeholder: PropTypes.string,
  showInviteOptions: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types

  // Redux State
  userOptions: UsersPropTypes.isRequired,
  isLoading: PropTypes.bool,
  isAdmin: PropTypes.bool.isRequired,

  // Redux Actions
  requestSearchUsers: PropTypes.func.isRequired,
  requestSearchInvitedUsers: PropTypes.func.isRequired
};

CardUsers.defaultProps = {
  className: '',
  isEditable: false,
  size: 'md',
  showSelect: false,
  showTooltips: false,
  showNames: true,
  onRemoveClick: null,
  onUserClick: null,
  onAdd: null,
  placeholder: 'No current users',
  showInviteOptions: false
};

export default CardUsers;
