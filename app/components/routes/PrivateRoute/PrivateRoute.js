import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ROUTES } from 'appConstants';

const PrivateRoute = ({ isLoggedIn, isVerified, hasCompletedOnboarding, ...givenProps }) => {
  const isOnVerifyPage = givenProps.path === ROUTES.VERIFY;
  const isOnCompletedOnboarding = givenProps.path === ROUTES.COMPLETE_ONBOARDING;

  if (isLoggedIn) {
    if ((isVerified && hasCompletedOnboarding) || isOnVerifyPage || isOnCompletedOnboarding) {
      return <Route {...givenProps} />
    } else if (!isVerified) {
      return <Redirect to={{ pathname: ROUTES.VERIFY, state: { from: givenProps.location } }} />;
    } else { // if (!hasCompletedOnboarding) {
      return <Redirect to={{ pathname: ROUTES.COMPLETE_ONBOARDING, state: { from: givenProps.location } }} />;
    }
  } else {
    return <Redirect to={{ pathname: ROUTES.MAIN_AUTH, state: { from: givenProps.location } }} />;
  }
}

export default PrivateRoute;