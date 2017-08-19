import appClient from '../util/appClient';
import * as httpCodes from '../util/appClient';

const initialState = {
    actionHistory: []
}

export default function reducer(debug = initialState, action) {

    // append action to history for loggin
    return {
        ...debug,
        actionHistory: debug.actionHistory.concat([action])
    };
}