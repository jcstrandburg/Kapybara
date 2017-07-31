import { createStore, applyMiddleware  } from 'redux';
import applicationReducer from './ducks/root';

// This middleware will just add the property "async dispatch"
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

        if (syncActivityFinished)
            flushQueue();
    }

    const actionWithAsyncDispatch = Object.assign({}, action, { asyncDispatch });

    next(actionWithAsyncDispatch);
    syncActivityFinished = true;
    flushQueue();
};

const actionLogMiddleware = store => next => action => {
    next(action);
}

let store = createStore(applicationReducer, applyMiddleware(actionLogMiddleware, asyncDispatchMiddleware));

export default store;
