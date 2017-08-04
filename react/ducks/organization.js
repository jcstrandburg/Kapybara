import toDict from '../util/toDict';
import * as httpCodes from '../util/appClient';

const CREATE_ASYNC = 'ORGANIZATION/CREATE_ASYNC';
const GET_ASYNC = 'ORGANIZATION/GET_ASYNC';

const UPDATED = 'ORGANIZATION/UPDATED';

export function createOrganization(organization) {
    if (organization == null)
        throw new TypeError("Argument null: organization");

    return { type: CREATE_ASYNC, organization };
}

export function organizationsUpdated(organizations) {
    if (organizations == null)
        throw new TypeError("Argument null: organizations");

    return { type: UPDATED, organizations }
}

export function getOrganization(token) {
    if (token == null)
        throw new TypeError("Argument null: token");

    return { type: GET_ASYNC, token }
}

export default function reducer(organizations, action, fetchJson, appClient) {
    // handle async events
    switch (action.type) {
    case CREATE_ASYNC:
        appClient.post('organizations', { organization: action.organization }, {
                [httpCodes.CREATED]: organization => action.asyncDispatch(organizationsUpdated([organization]))
            });
        break;
    case GET_ASYNC:
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