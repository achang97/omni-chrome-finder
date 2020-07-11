import { connect } from 'react-redux';
import { USER_ROLE } from 'appConstants/profile';
import { logout } from 'actions/auth';
import DisabledAlert from './DisabledAlert';

const mapStateToProps = (state) => {
  const {
    profile: {
      user: {
        role,
        company: { disabled, disabledReason }
      }
    }
  } = state;

  return { disabled, disabledReason, isAdmin: role === USER_ROLE.ADMIN };
};

const mapDispatchToProps = {
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(DisabledAlert);
