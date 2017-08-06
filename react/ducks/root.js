import fetchJson from '../util/fetchJson';
import appClient from '../util/appClient';
import * as httpCodes from '../util/appClient';
import projectReducer from './project';
import { default as organizationReducer, organizationsUpdated } from './organization';

const GET_CURRENT_USER_ASYNC = 'APP/GET_CURRENT_USER_ASYNC';
const SET_CURRENT_USER = 'APP/SET_CURRENT_USER';

const initialState = {
	user: {},
	organizations: {},
	projects: {},
	chatMessages: {},
	actionHistory: [],
};

export function getCurrentUser() {
	return { type: GET_CURRENT_USER_ASYNC };
}

export function setCurrentUser(user, organizations) {
	return { type: SET_CURRENT_USER, user, organizations };
}

export default function reducer(state = initialState, action) {
	// handle async events
	switch (action.type) {
	case GET_CURRENT_USER_ASYNC:
		appClient.get('users/me', {
				[httpCodes.OK]: body => action.asyncDispatch(setCurrentUser(body.user, body.organizations))
			});
		break;
	}

	var newState = {
		user: state.user,
		organizations: organizationReducer(state.organizations, action, fetchJson, appClient),
		projects: projectReducer(state.projects, action, fetchJson, appClient),
		actionHistory: state.actionHistory.concat([action]),
	};

	switch (action.type) {
	case SET_CURRENT_USER:
		action.asyncDispatch(organizationsUpdated(action.organizations));
		return Object.assign({}, newState, { user: action.user });
	}

	return newState;
}