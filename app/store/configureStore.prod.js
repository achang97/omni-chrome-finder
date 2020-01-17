import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import storage from '../utils/storage';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const middlewares = applyMiddleware(sagaMiddleware, thunk);
const enhancer = compose(
  middlewares,
  storage()
);

export default function (initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  // Run saga
  sagaMiddleware.run(rootSaga, store.dispatch, store.getState)

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  return store;
}
