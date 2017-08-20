import appClient from '../util/appClient';
import * as httpCodes from '../util/appClient';

const GET_CURRENT_USER_ASYNC = 'USER/GET_CURRENT_USER_ASYNC';
const GET_USER_ASYNC = 'USER/SET_CURRENT_USER';

const lazyLoader = {
    cachedRequests: {},

    startLazyLoad: (key, appClient) => {
        if (cachedRequests[key])
            return;

        cachedRequests[key] = appClient
            .getAsync('users/'+key)
            .then(result => {
                
            });
    }
}