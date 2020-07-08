import { connect } from 'react-redux';
import { USER_ROLE } from 'appConstants/profile';
import DisabledAlert from './DisabledAlert';

const mapStateToProps = (state) => {
  const {
    profile: {
      user: {
        role,
        company: { disabled, hasPaymentMethod }
      }
    }
  } = state;

  return { disabled, hasPaymentMethod, isAdmin: role === USER_ROLE.ADMIN };
};

export default connect(mapStateToProps)(DisabledAlert);
