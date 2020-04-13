import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ROUTES } from 'appConstants';

const PrivateRoute = ({ isLoggedIn, isVerified, ...givenProps }) => {
  const isOnVerifyPage = givenProps.path === ROUTES.VERIFY;

  if (isLoggedIn && (isVerified || isOnVerifyPage)) {
    return <Route {...givenProps} />
  } else if (isLoggedIn) {
    return <Redirect to={{ pathname: ROUTES.VERIFY, state: { from: givenProps.location } }} />;
  } else {
    return <Redirect to={{ pathname: ROUTES.LOGIN, state: { from: givenProps.location } }} />;
  }
}

export default PrivateRoute;