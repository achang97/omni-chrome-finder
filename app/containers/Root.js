import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { ROUTES } from 'appConstants';
import App from './App';

class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[ROUTES.ASK]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
