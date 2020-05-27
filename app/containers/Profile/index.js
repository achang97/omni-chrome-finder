import { connect } from 'react-redux';
import {
  changeFirstname,
  changeLastname,
  changeBio,
  editUser,
  requestUpdateUser,
  requestSaveUserEdits,
  requestGetUser,
  requestUpdateUserPermissions
} from 'actions/profile';
import { logout } from 'actions/auth';
import Profile from './Profile';

const mapStateToProps = (state) => {
  const {
    profile: { user, userEdits, analytics, permissionState, isSavingEdits, isEditingAbout },
    auth: { token }
  } = state;

  return {
    user,
    userEdits,
    analytics,
    permissionState,
    isSavingEdits,
    isEditingAbout,
    token
  };
};

const mapDispatchToProps = {
  changeFirstname,
  changeLastname,
  changeBio,
  requestSaveUserEdits,
  requestUpdateUser,
  editUser,
  requestGetUser,
  requestUpdateUserPermissions,
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
