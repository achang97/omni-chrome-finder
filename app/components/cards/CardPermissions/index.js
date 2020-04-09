import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Select from '../../common/Select';
import Tabs from '../../common/Tabs/Tabs';
import Tab from '../../common/Tabs/Tab';
import AnimateHeight from 'react-animate-height';
import _ from 'lodash';

import { PERMISSION_OPTIONS, PERMISSION_OPTION, DEBOUNCE_60_HZ } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/select';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestSearchPermissionGroups } from '../../../actions/search';

import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn();

const CardPermissions = ({ isDisabled, showJustMe, selectedPermission, onChangePermission, permissionGroups, onChangePermissionGroups, isSearchingPermissionGroups, permissionGroupOptions, requestSearchPermissionGroups }) => {
  const loadOptions = (inputValue) => {
    requestSearchPermissionGroups(inputValue);
  };

  let permissionOptions = PERMISSION_OPTIONS;
  if (!showJustMe) {
    permissionOptions = permissionOptions.filter(({ value }) => value !== PERMISSION_OPTION.JUST_ME);
  }

  return (
    <div>
      { isDisabled ?
        <div className={s('underline-border border-purple-gray-20 mb-sm text-purple-reg text-sm inline-block')}>
          {selectedPermission.label}
        </div> :
        <Tabs
          activeValue={selectedPermission}
          className={s('mb-sm')}
          tabClassName={s(
            'text-sm font-normal rounded-full py-sm px-reg'
          )}
          inactiveTabClassName={s('text-purple-reg')}
          activeTabClassName={s(
            'primary-gradient text-white font-semibold'
          )}
          onTabClick={onChangePermission}
          showRipple={false}
        >
          {permissionOptions.map((permissionOption) => (
            <Tab key={permissionOption.value} value={permissionOption}>
              <div className={s(permissionOption.value !== selectedPermission.value ? 'underline-border border-purple-gray-20' : 'primary-underline')}>
                {permissionOption.label}
              </div>
            </Tab>
          ))}
        </Tabs>
      }
      <AnimateHeight height={selectedPermission.value === PERMISSION_OPTION.SPECIFIC_GROUPS ? 'auto' : 0}>
        <Select
          value={permissionGroups}
          onChange={onChangePermissionGroups}
          onInputChange={_.debounce(loadOptions, DEBOUNCE_60_HZ)}
          onFocus={() => loadOptions('')}
          placeholder="Add permission groups..."
          options={permissionGroupOptions}
          isMulti
          isSearchable
          isDisabled={isDisabled}
          isClearable={false}
          menuShouldScrollIntoView
          getOptionLabel={option => option.name}
          getOptionValue={option => option._id}
          noOptionsMessage={() => isSearchingPermissionGroups ? 'Searching permission groups...' : 'No options'}
        />
      </AnimateHeight>
    </div>
  );
};

CardPermissions.propTypes = {
  selectedPermission: PropTypes.oneOf([...PERMISSION_OPTIONS, {}]).isRequired,
  onChangePermission: PropTypes.func.isRequired,
  permissionGroups: PropTypes.array.isRequired,
  onChangePermissionGroups: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  showJustMe: PropTypes.bool.isRequired,
};

CardPermissions.defaultProps = {
  isDisabled: false,
};

export default connect(
  state => ({
    permissionGroupOptions: state.search.permissionGroups,
    isSearchingPermissionGroups: state.search.isSearchingPermissionGroups,
  }),
  dispatch => bindActionCreators({
    requestSearchPermissionGroups,
  }, dispatch)
)(CardPermissions);
