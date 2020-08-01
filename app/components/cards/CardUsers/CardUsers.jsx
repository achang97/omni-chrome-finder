import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoMdAdd } from 'react-icons/io';
import { FiUserPlus } from 'react-icons/fi';
import _ from 'lodash';

import { CircleButton, Select, Tooltip } from 'components/common';

import { DEBOUNCE } from 'appConstants/animate';
import { ROLE } from 'appConstants/user';
import { UserPropTypes } from 'utils/propTypes';
import { isInvitedUser } from 'utils/user';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-users.css';
import CardUser from '../CardUser';

const s = getStyleApplicationFn(style);

const CardUsers = ({
  isEditable,
  className,
  users,
  selectedUser,
  onRemoveClick,
  onUserClick,
  onAdd,
  onCreate,
  showSelect,
  showTooltips,
  size,
  showNames,
  placeholder,
  maxShown,
  userOptions,
  isLoading,
  isEditor,
  requestSearchUsers
}) => {
  const [showSelectState, setShowSelectState] = useState(false);

  const loadOptions = (inputValue) => {
    requestSearchUsers(inputValue);
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

  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    return (
      inputValue &&
      !selectOptions.some(({ options }) =>
        options.some(({ email }) => email === inputValue.trim().toLowerCase())
      )
    );
  };

  const renderUser = (user, index) => {
    const { _id, profilePicture, status, isEditable: userIsEditable = true } = user;
    const name = getSelectOptionLabel(user);

    return (
      <CardUser
        key={_id}
        size={size}
        name={name}
        showName={showNames}
        img={profilePicture}
        className={s('mr-sm mb-sm')}
        onClick={() => onUserClick(user, index)}
        onRemoveClick={isEditable && userIsEditable ? () => onRemoveClick({ user, index }) : null}
        showTooltip={showTooltips}
        status={status}
      />
    );
  };

  const formatSelectOptionLabel = (option) => {
    const { profilePicture, status, __isNew__ } = option;
    const label = getSelectOptionLabel(option);

    return (
      <div className={s('flex items-center')}>
        {!__isNew__ && (
          <CardUser
            name={label}
            img={profilePicture}
            showName={false}
            status={status}
            size="sm"
            className={s('mr-sm')}
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
          type={isEditor && onCreate ? 'creatable' : 'default'}
          className={s('w-full mb-sm')}
          value={selectedUser}
          options={_.differenceBy(userOptions, users, '_id')}
          onChange={onAdd}
          onInputChange={_.debounce(loadOptions, DEBOUNCE.MS_300)}
          onFocus={() => loadOptions('')}
          isSearchable
          menuShouldScrollIntoView
          isClearable={false}
          placeholder="Add users..."
          getOptionLabel={getSelectOptionLabel}
          formatCreateLabel={(inputValue) => `Invite ${inputValue}`}
          getOptionValue={({ _id, value, __isNew__ }) => (__isNew__ ? value : _id)}
          formatOptionLabel={formatSelectOptionLabel}
          onCreateOption={onCreate}
          isValidNewOption={isValidNewOption}
          noOptionsMessage={() => (isLoading ? 'Searching users...' : 'No options')}
        />
      )}
      {users.slice(0, maxShown).map(renderUser)}
      {!isEditable && users.length === 0 && (
        <div className={s('text-sm text-gray-light')}>{placeholder}</div>
      )}
      {!isEditable && users.length > maxShown && (
        <Tooltip tooltip={`+${users.length - maxShown} more`}>
          <CircleButton
            content={<FiUserPlus />}
            className="text-purple-reg"
            buttonClassName="bg-purple-gray-10"
            labelClassName="text-xs"
            size={size}
            onClick={() => onUserClick(null, -1)}
          />
        </Tooltip>
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

CardUsers.propTypes = {
  isEditable: PropTypes.bool,
  className: PropTypes.string,
  users: PropTypes.arrayOf(UserPropTypes),
  selectedUser: UserPropTypes,
  onRemoveClick: PropTypes.func,
  onUserClick: PropTypes.func,
  onAdd: PropTypes.func,
  onCreate: PropTypes.func,
  showSelect: PropTypes.bool,
  showTooltips: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])]),
  showNames: PropTypes.bool,
  placeholder: PropTypes.string,
  maxShown: PropTypes.number,

  // Options that are used in index.js
  /* eslint-disable react/no-unused-prop-types */
  showInviteOptions: PropTypes.bool,
  disabledUserRoles: PropTypes.arrayOf(PropTypes.oneOf(Object.values(ROLE))),
  disabledUserIds: PropTypes.arrayOf(PropTypes.string),
  /* eslint-enable react/no-unused-prop-types */

  // Redux State
  userOptions: PropTypes.arrayOf(UserPropTypes).isRequired,
  isLoading: PropTypes.bool,
  isEditor: PropTypes.bool.isRequired,

  // Redux Actions
  requestSearchUsers: PropTypes.func.isRequired
};

CardUsers.defaultProps = {
  className: '',
  isEditable: false,
  selectedUser: null,
  users: [],
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
