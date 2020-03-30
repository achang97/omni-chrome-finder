import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ROUTES } from '../../../utils/constants';

const PrivateRoute = (props) => {
  const { isLoggedIn, isVerified, ...givenProps } = props;
  const isOnVerifyPage = props.path === ROUTES.VERIFY;

  if (isLoggedIn && (isVerified || isOnVerifyPage)) {
    return <Route {...givenProps} />
  } else if (isLoggedIn) {
    return <Redirect to={{ pathname: ROUTES.VERIFY, state: { from: props.location } }} />;
  } else {
    return <Redirect to={{ pathname: ROUTES.LOGIN, state: { from: props.location } }} />;
  }
}

export default connect(
  state => ({
    isLoggedIn: !!state.auth.token,
    isVerified: state.profile.user && state.profile.user.isVerified
  }),
  undefined
)(PrivateRoute);
