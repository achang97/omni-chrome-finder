import { connect } from 'react-redux';
import {
  changeFirstname, changeLastname, changeBio, editUser,
  requestSaveUser, requestGetUser, requestUpdateUserPermissions
} from 'actions/profile';
import { logout } from 'actions/auth';
import Profile from './Profile';

const mapStateToProps = state => {
  const {
    profile,
    auth: {
      token
    }
  } = state;

  return { ...profile, token };
}

const mapDispatchToProps = {
  changeFirstname,
  changeLastname,
  changeBio,
  requestSaveUser,
  editUser,
  requestGetUser,
  requestUpdateUserPermissions,
  logout,  
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
