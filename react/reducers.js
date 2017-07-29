import * as actions from './actions';

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
				body: {
					organization: action.organization,
				},
			})
			.then(result => action.asyncDispatch(actions.organizationUpdated(result.organization)));
		break;
	}

	switch (action.type) {
	case actions.SET_CURRENT_USER:
		return action.organizations;
	case actions.ORGANIZATION_UPDATED:
		return organizations.filter(org => org.id != action.organization.id).concat(organization);
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
				body: {
					project: action.project
				}
			})
			.then(result => action.asyncDispatch(actions.projectUpdated(result.project)));
		break;
	}

	switch (action.type) {
	case actions.PROJECT_UPDATED:
		return projects.filter(p => p.id != action.project.id).concat(action.project);
		return;
	case actions.DELETE_PROJECT:
		// TODO: move this to the async section
		return projects.filter((proj) => proj.id != action.project.id);
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
