import * as actions from './actions';

function toDict(data, keySelector) {
	return data.reduce((map, it) => {
		map[keySelector(it)] = it;
		return map;
	}, {});
}

export function userReducer(user, action, fetchJson) {
	switch (action.type) {
	case actions.SET_CURRENT_USER:
		return action.user;
		break;
	default:
		return user;
	}
}

export function organizationReducer(organizations, action, fetchJson) {
	// handle async events
	switch (action.type) {
	case actions.ADD_ORGANIZATION:
		fetchJson('/api/v1/organizations', {
				method: 'POST',
				body: {	organization: action.organization },
			})
			.then(result => action.asyncDispatch(actions.organizationUpdated(result)));
		break;
	case actions.GET_ORGANIZATION:
		fetchJson('/api/v1/organizations/'+action.token, {
				method: 'GET',
			})
			.then(result => action.asyncDispatch(actions.organizationUpdated(result)));
		break;	
	}

	switch (action.type) {
	case actions.SET_CURRENT_USER: 
		return Object.assign({}, organizations, toDict(action.organizations, it => it.token));
	case actions.ORGANIZATION_UPDATED:
		return Object.assign({}, organizations, toDict([action.organization], it => it.token));
	default:
		return organizations;
	}
}

export function projectReducer(projects = [], action, fetchJson) {
	// handle async events
	switch (action.type) {
	case actions.ADD_PROJECT:
		fetchJson('/api/v1/projects', {
				method: 'POST',
				body: { project: action.project }
			})
			.then(result => action.asyncDispatch(actions.projectUpdated(result)));
		break;
	case actions.GET_PROJECTS_FOR_ORGANIZATION:
		fetchJson('/api/v1/organizations/'+action.organizationToken+'/projects')
			.then(result => {
				action.asyncDispatch(actions.projectsUpdated(result.projects))
			})
	}

	switch (action.type) {
	case actions.PROJECT_UPDATED:
		return Object.assign({}, projects, toDict([action.project], it => it.id));	
	case actions.DELETE_PROJECT:
		throw "not implemented";
	case actions.PROJECTS_UPDATED:
		return Object.assign({}, projects, toDict(action.projects, it => it.id));
		return;
	default:
		return projects;
	}
}

export function chatReducer(messages = [], action, fetchJson) {
	switch (action.type) {
	default:
		return messages;
	}
}
