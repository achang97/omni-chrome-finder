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
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.object.isRequired
};

export default Root;
