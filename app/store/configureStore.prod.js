import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import authMiddleware from '../middleware/auth';
import tasksMiddleware from '../middleware/tasks';
import rootSaga from '../sagas';
import authEnhancer from './enhancers/auth';
import tasksEnhancer from './enhancers/tasks';

const sagaMiddleware = createSagaMiddleware();

const middlewares = applyMiddleware(sagaMiddleware, thunk, authMiddleware, tasksMiddleware);
const enhancer = compose(
  middlewares,
  authEnhancer(),
  tasksEnhancer()
);

export default function (initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  // Run saga
  sagaMiddleware.run(rootSaga, store.dispatch, store.getState);

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  return store;
}
