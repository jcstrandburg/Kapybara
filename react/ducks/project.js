import toDict from '../util/toDict';
import * as httpCodes from '../util/appClient';

const ADD = 'PROJECT/ADD';
const UPDATE = 'PROJECT/UPDATE';
const UPDATED = 'PROJECT/UPDATED';
const GET_FOR_ORGANIZATION = 'PROJECT/GET_FOR_ORGANIZATION';

export function addProject(project) {
    if (project == null)
        throw new TypeError("Argument null: project");

    return { type: ADD, project }
}

export function projectsUpdated(projects) {
    if (projects == null)
        throw new TypeError("Argument null: projects");

    return { type: UPDATED, projects }
}

export function getOrganizationProjects(organizationToken) {
    if (organizationToken == null)
        throw new TypeError("Argument null: organizationToken");

    return {
        type: GET_FOR_ORGANIZATION,
        organizationToken,
    }
}

export default function reducer(projects = [], action, fetchJson, appClient) {
    // handle async events
    switch (action.type) {
    case ADD:
        appClient.post('projects', { project: action.project }, {
                [httpCodes.CREATED]: result => action.asyncDispatch(projectsUpdated([result]))
            });
        break;
    case GET_FOR_ORGANIZATION:
        appClient.get('organizations/'+action.organizationToken+'/projects', {
                [httpCodes.OK]: result => action.asyncDispatch(projectsUpdated(result.projects))
            });
        break;
    }

    switch (action.type) {
    case UPDATE:
        return Object.assign({}, projects, toDict([action.project], it => it.id));    
    case UPDATED:
        return Object.assign({}, projects, toDict(action.projects, it => it.id));
        return;
    default:
        return projects;
    }
}