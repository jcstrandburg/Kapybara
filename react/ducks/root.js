import fetchJson from '../util/fetchJson';
import projectReducer from './project';
import { default as organizationReducer, organizationsUpdated } from './organization';

const GET_CURRENT_USER = 'APP/GET_CURRENT_USER';
const SET_CURRENT_USER = 'APP/SET_CURRENT_USER';

const initialState = {
	user: {},
	organizations: {},
	projects: {},
	chatMessages: {},
	actionHistory: [],
};

export function getCurrentUser() {
	return { type: GET_CURRENT_USER };
}

export function setCurrentUser(user, organizations) {
	return { type: SET_CURRENT_USER, user, organizations };
}

export default function reducer(state = initialState, action) {
	console.log(action);
	switch (action.type) {
	case GET_CURRENT_USER:
		fetchJson('/api/v1/users/me')
			.then(result => {
				console.log(result);
				return action.asyncDispatch(setCurrentUser(result.user, result.organizations))
			});
		break;
	}

	var newState = {
		user: state.user,
		organizations: organizationReducer(state.organizations, action, fetchJson),
		projects: projectReducer(state.projects, action, fetchJson),
		actionHistory: state.actionHistory.concat([action]),
	};

	switch (action.type) {
	case SET_CURRENT_USER:
		action.asyncDispatch(organizationsUpdated(action.organizations));
		Object.assign({}, newState, { user: action.user });
	}

	return newState;
}