import * as httpCodes from '../util/appClient';

const GET_CURRENT_USER_ASYNC = 'USER/GET_CURRENT_USER_ASYNC';
const SET_CURRENT_USER = 'USER/SET_CURRENT_USER';

export function getCurrentUser() {
	return { type: GET_CURRENT_USER_ASYNC };
}

export function setCurrentUser(user, organizations) {
	return { type: SET_CURRENT_USER, user, organizations };
}

export function getReducer(appClient) {
	return (user = {}, action) => {
		// handle async events
		switch (action.type) {
		case GET_CURRENT_USER_ASYNC:
			appClient.get('users/me', {
					[httpCodes.OK]: result => action.asyncDispatch(setCurrentUser(result.user, result.organizations))
				});
			break;
		}

		switch (action.type) {
		case SET_CURRENT_USER:
			return {
				...action.user,
				organizations: action.organizations
			};
		}

		return user;
	}
}

export default {
	getCurrentUser,
	setCurrentUser,
	getReducer,
};
