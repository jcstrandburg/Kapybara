import toDict from '../util/toDict';

const ADD = 'PROJECT/ADD';
const DELETE = 'PROJECT/DELETE';
const UPDATE = 'PROJECT/UPDATE';
const UPDATED = 'PROJECT/UPDATED';
const GET_FOR_ORGANIZATION = 'PROJECT/GET_FOR_ORGANIZATION';

export function addProject(project) {
    var action = {
        type: ADD,
        project
    };
    return action;
}

export function projectsUpdated(projects) {
    return { type: UPDATED, projects }
}

export function getOrganizationProjects(organizationToken) {
    return {
        type: GET_FOR_ORGANIZATION,
        organizationToken,
    }
}

export default function reducer(projects = [], action, fetchJson) {
	// handle async events
	switch (action.type) {
	case ADD:
		fetchJson('/api/v1/projects', {
				method: 'POST',
				body: { project: action.project }
			})
			.then(result => action.asyncDispatch(actions.projectsUpdated([result])));
		break;
	case GET_FOR_ORGANIZATION:
		fetchJson('/api/v1/organizations/'+action.organizationToken+'/projects')
			.then(result => {
				action.asyncDispatch(projectsUpdated(result.projects))
			})
	}

	switch (action.type) {
	case UPDATE:
		return Object.assign({}, projects, toDict([action.project], it => it.id));	
	case DELETE:
		throw "not implemented";
	case UPDATED:
		return Object.assign({}, projects, toDict(action.projects, it => it.id));
		return;
	default:
		return projects;
	}
}