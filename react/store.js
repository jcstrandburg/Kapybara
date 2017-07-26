import { createStore, applyMiddleware  } from 'redux';
import { appReducer } from './reducers';

// This middleware will just add the property "async dispatch"
// to actions with the "async" propperty set to true
// http://stackoverflow.com/questions/36730793/dispatch-action-in-reducer
const asyncDispatchMiddleware = store => next => action => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch =
    Object.assign({}, action, { asyncDispatch });

  next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
};

const actionLogMiddleware = store => next => action => {
    console.log(action);
    next(action);
    console.log(store.getState())
}

let store = createStore(appReducer, applyMiddleware(actionLogMiddleware, asyncDispatchMiddleware));

export default store;
