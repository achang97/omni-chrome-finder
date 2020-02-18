import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Select from '../../common/Select';
import AnimateHeight from 'react-animate-height';
import _ from 'underscore';

import { PERMISSION_OPTIONS, PERMISSION_OPTIONS_MAP, DEBOUNCE_300_MS } from '../../../utils/constants';
import { createSelectOptions } from '../../../utils/selectHelpers';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestSearchPermissionGroups } from '../../../actions/search';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const CardPermissions = ({ selectedPermission, onChangePermission, permissionGroups, onChangePermissionGroups, isSearchingPermissionGroups, permissionGroupOptions, requestSearchPermissionGroups }) => {
  const loadOptions = (inputValue) => {
    requestSearchPermissionGroups(inputValue);
  }

  return (
    <div>
      <Select
        value={selectedPermission}
        onChange={onChangePermission}
        placeholder="Select permissions..."
        options={PERMISSION_OPTIONS}
        isSearchable
        menuShouldScrollIntoView
      />
      <AnimateHeight height={selectedPermission.value === PERMISSION_OPTIONS_MAP.SPECIFIC_GROUPS ? 'auto' : 0}>
        <Select
          value={permissionGroups}
          onChange={onChangePermissionGroups}
          onInputChange={_.debounce(loadOptions, DEBOUNCE_300_MS)}
          onFocus={() => loadOptions("")}
          className={s("mt-xs")}
          placeholder="Add permission groups..."
          options={permissionGroupOptions}
          isMulti
          isSearchable
          isClearable={false}
          menuShouldScrollIntoView
          getOptionLabel={option => option.permissiongroupName}
          getOptionValue={option => option._id}
          noOptionsMessage={() => isSearchingPermissionGroups ? 'Searching permission groups...' : 'No options' }
        />
      </AnimateHeight>
    </div>
  );
}

CardPermissions.propTypes = {
  selectedPermission: PropTypes.string.isRequired,
  onChangePermission: PropTypes.func.isRequired,
  permissionGroups: PropTypes.array.isRequired,
  onChangePermissionGroups: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    permissionGroupOptions: state.search.permissionGroups,
    isSearchingPermissionGroups: state.search.isSearchingPermissionGroups,
  }),
  dispatch => bindActionCreators({
    requestSearchPermissionGroups,
  }, dispatch)
)(CardPermissions);
