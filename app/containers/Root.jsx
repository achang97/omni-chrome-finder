import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { ROUTES } from 'appConstants';
import App from './App';

const Root = ({ store }) => (
  <Provider store={store}>
    <MemoryRouter initialEntries={[ROUTES.ASK]}>
      <App />
    </MemoryRouter>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
  }).isRequired
};

export default Root;
