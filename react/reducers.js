import { fetchJson } from './appclient';
import * as actions from './actions';

const initialState = {
	user: {		
	},
	organizations: [		
	],
	projects: [
	],
	chatMessages: [
	],
	actionHistory: [		
	],
};

export function appReducer(state = initialState, action) {
	switch (action.type) {
	case actions.FETCH_CURRENT_USER:
		fetchJson('/api/v1/users/me')
			.then(result => action.asyncDispatch(actions.setCurrentUser(result.user, result.organizations)));
		break;
	}

	var newState = {
		user: userReducer(state.user, action),
		organizations: organizationReducer(state.organizations, action),
		projects: projectReducer(state.projects, action),
		chatMessages: chatReducer(state.chatMessages, action),
		actionHistory: state.actionHistory.concat([action]),
	};

	return newState;
}

// TODO: kill this
function getNextProjectId(projects) {
	return projects.reduce((id, project) => id > project.id ? id : project.id, -1) + 1;
}

function userReducer(user, action) {
	switch (action.type) {
	case actions.SET_CURRENT_USER:
		return action.user;
		break;
	default:
		return user;
	}
}

function organizationReducer(organizations, action) {
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

export function projectReducer(projects = [], action) {
	// handle async events
	switch (action.type) {
	case actions.ADD_PROJECT:
		fetchJson('/api/v1/'+action.organizationToken+'/projects', {
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

export function chatReducer(messages = [], action) {
	switch (action.type) {
	default:
		return messages;
	}
}
