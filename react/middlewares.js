// This middleware will just add the property "async dispatch"
// http://stackoverflow.com/questions/36730793/dispatch-action-in-reducer
export const asyncDispatchMiddleware = store => next => action => {
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

export const actionLogMiddleware = store => next => action => {
    console.log(action);
    next(action);
};

export default {
    asyncDispatchMiddleware,
    actionLogMiddleware
};
