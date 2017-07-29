import { fetchJson } from './appclient';
import * as actions from './actions';
import { userReducer, organizationReducer, projectReducer, chatReducer, actionHistory } from './reducers';

const initialState = {
	user: {
	},
	organizations: {},
	projects: {},
	chatMessages: {},
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
		user: userReducer(state.user, action, fetchJson),
		organizations: organizationReducer(state.organizations, action, fetchJson),
		projects: projectReducer(state.projects, action, fetchJson),
		chatMessages: chatReducer(state.chatMessages, action, fetchJson),
		actionHistory: state.actionHistory.concat([action]),
	};

	return newState;
}