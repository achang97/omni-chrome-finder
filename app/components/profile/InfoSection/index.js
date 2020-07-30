import { connect } from 'react-redux';
import {
  changeFirstname,
  changeLastname,
  changeBio,
  requestSaveUserEdits,
  editUser
} from 'actions/profile';
import InfoSection from './InfoSection';

const mapStateToProps = (state) => {
  const {
    profile: { user, userEdits, analytics, isSavingEdits, isEditingAbout }
  } = state;

  return { user, userEdits, analytics, isSavingEdits, isEditingAbout };
};

const mapDispatchToProps = {
  changeFirstname,
  changeLastname,
  changeBio,
  requestSaveUserEdits,
  editUser
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoSection);
