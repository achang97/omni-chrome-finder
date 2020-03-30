import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ROUTES } from '../../../utils/constants';

const PublicRoute = (props) => {
  const { isLoggedIn, ...givenProps } = props;

  if (!isLoggedIn) {
    return <Route {...givenProps} />
  } else {
    return <Redirect to={{ pathname: ROUTES.ASK, state: { from: props.location } }} />;
  }
}

export default connect(
  state => ({
    isLoggedIn: !!state.auth.token,
  }),
  undefined
)(PublicRoute);
