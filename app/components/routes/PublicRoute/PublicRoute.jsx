import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { ROUTES } from 'appConstants';

const PublicRoute = ({ isLoggedIn, ...givenProps }) => {
  if (!isLoggedIn) {
    return <Route {...givenProps} />;
  }
  return <Redirect to={{ pathname: ROUTES.ASK, state: { from: givenProps.location } }} />;
};

PublicRoute.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default PublicRoute;
