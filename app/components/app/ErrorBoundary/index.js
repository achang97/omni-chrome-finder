import { connect } from 'react-redux';
import ErrorBoundary from './ErrorBoundary';

const mapStateToProps = (state) => {
  const {
    profile: { user }
  } = state;

  return { user };
};

export default connect(mapStateToProps)(ErrorBoundary);
