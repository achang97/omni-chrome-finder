import React from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Select, Tabs, Tab } from 'components/common';
import { CARD, ANIMATE } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-permissions.css';

const s = getStyleApplicationFn(style);

const CardPermissions = ({
  isDisabled,
  showJustMe,
  selectedPermission,
  onChangePermission,
  permissionGroups,
  onChangePermissionGroups,
  isSearchingPermissionGroups,
  permissionGroupOptions,
  requestSearchPermissionGroups
}) => {
  const loadOptions = (inputValue) => {
    requestSearchPermissionGroups(inputValue);
  };

  let permissionOptions = CARD.PERMISSION_OPTIONS;
  if (!showJustMe) {
    permissionOptions = permissionOptions.filter(
      ({ value }) => value !== CARD.PERMISSION_OPTION.JUST_ME
    );
  }

  return (
    <div>
      {isDisabled ? (
        selectedPermission.value !== CARD.PERMISSION_OPTION.SPECIFIC_GROUPS && (
          <div
            className={s(
              'underline-border border-purple-gray-20 mb-sm text-purple-reg text-sm inline-block'
            )}
          >
            {selectedPermission.label}
          </div>
        )
      ) : (
        <Tabs
          activeValue={selectedPermission}
          className={s('mb-sm')}
          tabClassName={s('text-sm font-normal rounded-full p-sm text-center')}
          inactiveTabClassName={s('text-purple-reg')}
          activeTabClassName={s('primary-gradient text-white font-semibold')}
          onTabClick={onChangePermission}
          showRipple={false}
        >
          {permissionOptions.map((permissionOption) => (
            <Tab key={permissionOption.value} value={permissionOption}>
              <div
                className={s(
                  `${
                    permissionOption.value !== selectedPermission.value
                      ? 'underline-border border-purple-gray-20'
                      : 'primary-underline'
                  } card-permissions-tab`
                )}
              >
                {permissionOption.label}
              </div>
            </Tab>
          ))}
        </Tabs>
      )}
      <AnimateHeight
        height={selectedPermission.value === CARD.PERMISSION_OPTION.SPECIFIC_GROUPS ? 'auto' : 0}
      >
        {!isDisabled ? (
          <Select
            value={permissionGroups}
            onChange={onChangePermissionGroups}
            onInputChange={_.debounce(loadOptions, ANIMATE.DEBOUNCE.MS_300)}
            onFocus={() => loadOptions('')}
            placeholder="Add permission groups..."
            options={permissionGroupOptions}
            isMulti
            isSearchable
            isDisabled={isDisabled}
            isClearable={false}
            menuShouldScrollIntoView
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option._id}
            noOptionsMessage={() =>
              isSearchingPermissionGroups ? 'Searching permission groups...' : 'No options'
            }
          />
        ) : (
          <div className={s('flex flex-wrap')}>
            {permissionGroups.length !== 0 &&
              permissionGroups.map(({ name }, i) => (
                <div
                  key={name}
                  className={s(
                    'text-sm mr-sm mb-sm truncate text-purple-reg underline-border border-purple-gray-10'
                  )}
                >
                  {name}
                  {i !== permissionGroups.length - 1 && ','}
                </div>
              ))}
          </div>
        )}
      </AnimateHeight>
    </div>
  );
};

const PermissionGroupPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired
  })
);

CardPermissions.propTypes = {
  selectedPermission: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }),
  onChangePermission: PropTypes.func.isRequired,
  permissionGroups: PermissionGroupPropTypes.isRequired,
  onChangePermissionGroups: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  showJustMe: PropTypes.bool.isRequired,

  // Redux State
  isSearchingPermissionGroups: PropTypes.bool,
  permissionGroupOptions: PermissionGroupPropTypes.isRequired,

  // Redux Actions
  requestSearchPermissionGroups: PropTypes.func.isRequired
};

CardPermissions.defaultProps = {
  isDisabled: false,
  isSearchingPermissionGroups: false,
  selectedPermission: null
};

export default CardPermissions;
