import { connect } from 'react-redux';
import PublicRoute from './PublicRoute';

const mapStateToProps = (state) => {
  const {
    auth: { token }
  } = state;

  return { isLoggedIn: !!token };
};

export default connect(mapStateToProps)(PublicRoute);
