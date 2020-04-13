import { connect } from 'react-redux';
import { requestSearchPermissionGroups } from 'actions/search';
import CardPermissions from './CardPermissions';

const mapStateToProps = state => {
  const { 
    search: {
      permissionGroups,
      isSearchingPermissionGroups
    }
  } = state;

  return { permissionGroupOptions: permissionGroups, isSearchingPermissionGroups };
}

const mapDispatchToProps = {
  requestSearchPermissionGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardPermissions);
