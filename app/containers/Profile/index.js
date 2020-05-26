import { connect } from 'react-redux';
import {
  changeFirstname,
  changeLastname,
  changeBio,
  editUser,
  requestUpdateUser,
  requestGetUser,
  requestUpdateUserPermissions
} from 'actions/profile';
import { logout } from 'actions/auth';
import Profile from './Profile';

const mapStateToProps = (state) => {
  const {
    profile: { user, userEdits, analytics, permissionState, isUpdatingUser, isEditingAbout },
    auth: { token }
  } = state;

  return {
    user,
    userEdits,
    analytics,
    permissionState,
    isUpdatingUser,
    isEditingAbout,
    token
  };
};

const mapDispatchToProps = {
  changeFirstname,
  changeLastname,
  changeBio,
  requestUpdateUser,
  editUser,
  requestGetUser,
  requestUpdateUserPermissions,
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
