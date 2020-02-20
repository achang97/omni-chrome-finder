import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react'
import App from './App';

export default class Root extends Component {
  render() {
    const { store, persistor } = this.props;
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </PersistGate>
      </Provider>
    );
  }
}
