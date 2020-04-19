import { connect } from 'react-redux';
import { requestUpdateProfilePicture, requestDeleteProfilePicture } from 'actions/profile';
import ProfilePicture from './ProfilePicture';

const mapStateToProps = state => {
  const { 
    auth: {
      token
    },
    profile: {
      user,
      isUpdatingPicture,
    }
  } = state;

  return { user, token, isUpdatingPicture };
}

const mapDispatchToProps = {
  requestUpdateProfilePicture,
  requestDeleteProfilePicture
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePicture);