import { connect } from 'react-redux';
import { requestUpdateUser, requestUpdateUserPermissions } from 'actions/profile';
import IntegrationsSection from './IntegrationsSection';

const mapStateToProps = (state) => {
  const {
    profile: { user, permissionState }
  } = state;

  return { user, permissionState };
};

const mapDispatchToProps = {
  requestUpdateUser,
  requestUpdateUserPermissions
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationsSection);
