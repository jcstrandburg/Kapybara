import toDict from '../util/toDict';
import * as httpCodes from '../util/appClient';

const ADD = 'ORGANIZATION/ADD';
const UPDATED = 'ORGANIZATION/UPDATED';
const GET = 'ORGANIZATION/GET';

export function addOrganization(organization) {
    return { type: ADD, organization };
}

export function organizationsUpdated(organizations) {
    return { type: UPDATED, organizations }
}

export function getOrganization(token) {
    return { type: GET, token }
}

export default function reducer(organizations, action, fetchJson, appClient) {
    // handle async events
    switch (action.type) {
    case ADD:
        appClient.post('organizations', { organization: action.organization }, {
                [httpCodes.CREATED]: organization => action.asyncDispatch(organizationsUpdated([organization]))
            });
        break;
    case GET:
        appClient.get('organizations/'+action.token, {
                [httpCodes.OK]: organization => action.asyncDispatch(organizationsUpdated([organization]))
            });
        break;
    }

    switch (action.type) {
    case UPDATED:
        return Object.assign({}, organizations, toDict(action.organizations, it => it.token));
    default:
        return organizations;
    }
}