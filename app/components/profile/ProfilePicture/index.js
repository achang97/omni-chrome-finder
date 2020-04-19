import { connect } from 'react-redux';
import { requestUpdateProfilePicture, requestDeleteProfilePicture } from 'actions/profile';
import ProfilePicture from './ProfilePicture';

const mapStateToProps = state => {
  const { 
    profile: {
      user,
      isUpdatingPicture,
    }
  } = state;

  return { user, isUpdatingPicture };
}

const mapDispatchToProps = {
  requestUpdateProfilePicture,
  requestDeleteProfilePicture
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePicture);