import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ROUTES } from 'appConstants';

const PublicRoute = ({ isLoggedIn, ...givenProps }) => {
  if (!isLoggedIn) {
    return <Route {...givenProps} />;
  }
  return <Redirect to={{ pathname: ROUTES.ASK, state: { from: givenProps.location } }} />;
};

export default PublicRoute;
