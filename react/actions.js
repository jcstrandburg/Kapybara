import {dispatch} from 'redux';

const NOT_IMPLEMENTED = "Not implemented";

export const ADD_ORGANIZATION = 'ADD_ORGANIZATION';
export const ORGANIZATION_UPDATED = 'ORGANIZATION_UPDATED';

export function addOrganization(organization) {
    return {
        type: ADD_ORGANIZATION,
        organization: organization,
    };
}

export function organizationUpdated(organization) {    
    return {
        TYPE: ORGANIZATION_UPDATED,
        organization: organization,
    }
}

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export function fetchCurrentUser() {
    return {
        type: FETCH_CURRENT_USER
    };
}

export function setCurrentUser(user, organizations) {
    return {
        type: SET_CURRENT_USER,
        user: user,
        organizations: organizations
    };
}

export const ADD_PROJECT = 'ADD_PROJECT';
export const DELETE_PROJECT = 'DELETE_PROJECT';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const PROJECT_UPDATED = 'PROJECT_UPDATED';

export function addProject(organizationToken, project) {
    var action = {
		type: ADD_PROJECT,
        organizationToken: organizationToken,
		project: project
	};
    console.log(action);
    return action;
}

export function deleteProject(project) {
	throw NOT_IMPLEMENTED;
}

export const SEND_CHAT = 'SEND_CHAT';
export const RECEIVE_CHAT = 'RECEIVE_CHAT';

export function sendChat(channelId, message) {
    throw NOT_IMPLEMENTED;
}

export function receiveChat(message) {
    throw NOT_IMPLEMENTED;
}