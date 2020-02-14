import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import storage from '../utils/storage';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';
import * as types from '../actions/actionTypes';
import { getStorageName } from '../utils/constants';

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
  }) :
  compose;
/* eslint-enable no-underscore-dangle */

const sagaMiddleware = createSagaMiddleware();

const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware, thunk),
  storage(),
);

export default function (initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  const persistor = persistStore(store);

  // Run saga
  sagaMiddleware.run(rootSaga, store.dispatch, store.getState);

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (const key in changes) {
      const { oldValue, newValue } = changes[key];
      if (namespace === 'sync' && key === getStorageName('auth')) {
        const oldValueJSON = oldValue ? JSON.parse(oldValue) : oldValue;
        const newValueJSON = newValue ? JSON.parse(newValue) : newValue;

        if (oldValueJSON.isLoggedIn && !newValueJSON.isLoggedIn) {
          store.dispatch({ type: types.LOGOUT });
        } else if (!oldValueJSON.isLoggedIn && newValueJSON.isLoggedIn) {
          store.dispatch({ type: types.SYNC_LOGIN, payload: newValueJSON });
        }
      }
    }
  });

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');

      store.replaceReducer(nextRootReducer);
    });
  }
  return { store, persistor };
}
