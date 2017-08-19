export const OK = 200;
export const CREATED = 201;
export const BADREQUEST = 400;
export const NOTFOUND = 404;
export const TOOMANYREQUESTS = 429;

function wrapResponse(response) {
    return {
        handle: (handler) => {
            if (handler.hasOwnProperty(response.status))
                return response.json().then(jsonBody => {
                    handler[response.status](jsonBody);
                });

            throw new Error("Unhandled status code "+response.status);
        }
    }
}

const apiBase = '/api/v1/';

const defaultHeaders = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});

export default {
    urlEncode: (params) => {
        let notNullParams = Object.keys(params).filter(k => params[k] !== null && params[k] !== undefined);
        if (notNullParams.length) {
            return '?' + (Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&'));
        }
        return '';
    },
    get: (route, handler = null) => {
        let fetchOptions = {
            credentials: "same-origin",
            method: 'GET',
            headers: defaultHeaders
        }

        if (handler !== null)
            return fetch(apiBase+route, fetchOptions).then(wrapResponse).then(wrappedResponse => wrappedResponse.handle(handler));
        else
            return fetch(apiBase+route, fetchOptions).then(wrapResponse);
    },
    post: (route, body, handler = null) => {
        let fetchOptions = {
            credentials: "same-origin",
            method: 'POST',
            body: JSON.stringify(body),
            headers: defaultHeaders
        }

        if (handler !== null)
            return fetch(apiBase+route, fetchOptions).then(wrapResponse).then(wrappedResponse => wrappedResponse.handle(handler));
        else
            return fetch(apiBase+route, fetchOptions).then(wrapResponse);
    },
}
