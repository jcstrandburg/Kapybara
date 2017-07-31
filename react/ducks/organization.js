import toDict from '../util/toDict';

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

export default function reducer(organizations, action, fetchJson) {
	// handle async events
	switch (action.type) {
	case ADD:
        fetchJson('/api/v1/organizations', {
                method: 'POST',
                body: {	organization: action.organization },
            })
			.then(result => action.asyncDispatch(organizationsUpdated([result])));
		break;
	case GET:
		fetchJson('/api/v1/organizations/'+action.token, {
				method: 'GET',
			})
			.then(result => action.asyncDispatch(organizationsUpdated([result])));
		break;	
	}

	switch (action.type) {
    case UPDATED:
		return Object.assign({}, organizations, toDict(action.organizations, it => it.token));
	default:
		return organizations;
	}
}