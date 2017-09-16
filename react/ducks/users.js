import * as httpCodes from '../util/appClient';

const GET_ASYNC = 'USERS/GET_ASYNC';

const UPDATED = 'USERS/UPDATED';

export function getUser(userId) {
    return { type: GET_ASYNC, userId };
}

export function userUpdated(user) {
    return { type: UPDATED, user };
}

export function getReducer(appClient) {
    return (users = {}, action) => {
        // handle async events
        switch (action.type) {
        case GET_ASYNC:
            appClient.get('users/'+action.userId, {
                [httpCodes.OK]: result => action.asyncDispatch(userUpdated(result))
            });
            break;
        }

        switch (action.type) {
        case UPDATED:
            console.log(action);
            return Object.assign({}, users, { [action.user.id]: action.user });
        default:
            return users;
        }
    }
}

export default {
    getUser,
    userUpdated,
    getReducer,
};
