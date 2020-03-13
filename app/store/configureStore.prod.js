import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import auth from '../middleware/auth';
// import badge from '../middleware/badge';
import rootSaga from '../sagas';
import setUpAuthSync from './enhancers/authSync';

const sagaMiddleware = createSagaMiddleware();

const middlewares = applyMiddleware(sagaMiddleware, thunk, auth, /* badge */);
const enhancer = compose(
  middlewares,
);

export default function (initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  // Run saga
  sagaMiddleware.run(rootSaga, store.dispatch, store.getState);

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  setUpAuthSync(store);

  return store;
}
