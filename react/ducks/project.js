import toDict from '../util/toDict';
import * as httpCodes from '../util/appClient';

const CREATE_ASYNC = 'PROJECT/CREATE_ASYNC';
const GET_FOR_ORGANIZATION_ASYNC = 'PROJECT/GET_FOR_ORGANIZATION_ASYNC';
const GET_COMMENTS_ASYNC = 'PROJECT/GET_COMMENTS_ASYNC';
const POST_COMMENT_ASYNC = 'PROJECT/POST_COMMENT_ASYNC';

const UPDATED = 'PROJECT/UPDATED';
const COMMENTS_UPDATED = 'PROJECT/COMMENTS_UPDATED';

export function createProject(project) {
    if (project == null)
        throw new TypeError("Argument null: project");

    return { type: CREATE_ASYNC, project };
}

export function getOrganizationProjects(organizationToken, parentProjectId) {
    if (organizationToken == null)
        throw new TypeError("Argument null: organizationToken");

    return { type: GET_FOR_ORGANIZATION_ASYNC, organizationToken, parentProjectId };
}

export function getProjectComments(projectId) {
    if (projectId == null)
        throw new TypeError("Argument null: projectId");

    return { type: GET_COMMENTS_ASYNC, projectId };
}

export function postProjectComment(userId, projectId, content) {
    if (userId == null)
        throw new TypeError("Argument null: userId");
    if (projectId == null)
        throw new TypeError("Argument null: projectId");
    if (content == null)
        throw new TypeError("Argument null: content");

    return { type: POST_COMMENT_ASYNC, userId, projectId, content };
}

export function projectsUpdated(projects) {
    if (projects == null)
        throw new TypeError("Argument null: projects");

    return { type: UPDATED, projects };
}

export function commentsUpdated(projectId, comments) {
    if (projectId == null)
        throw new TypeError("Argument null: projectId");
    if (comments == null)
        throw new TypeError("Argument null: comments");

    return { type: COMMENTS_UPDATED, projectId, comments };
}

export default function reducer(projects = [], action, fetchJson, appClient) {
    // handle async events
    switch (action.type) {
    case CREATE_ASYNC:
        appClient.post('projects', { project: action.project }, {
                [httpCodes.CREATED]: result => action.asyncDispatch(projectsUpdated([result]))
            });
        break;
    case GET_FOR_ORGANIZATION_ASYNC:
        appClient.get('organizations/'+action.organizationToken+'/projects'+appClient.urlEncode({ parent: action.parentProjectId }), {
                [httpCodes.OK]: result => action.asyncDispatch(projectsUpdated(result.projects))
            });
        break;
    case GET_COMMENTS_ASYNC:
        appClient.get('projects/'+action.projectId+'/comments', {
                [httpCodes.OK]: result => action.asyncDispatch(commentsUpdated(action.projectId, result.comments))
            });
        break;
    case POST_COMMENT_ASYNC:
        appClient.post(
            'projects/'+action.projectId+'/comments',
            {
                userId: action.projectid,
                content: action.projectId
            },
            {
                [httpCodes.OK]: result => action.asyncDispatch(getProjectComments(action.projectId))
            });
        break;
    }
    

    switch (action.type) {
    case UPDATED:
        return Object.assign({}, projects, toDict(action.projects, it => it.id));
    case COMMENTS_UPDATED:
        return Object.assign({}, projects, {
            [action.projectId]: Object.assign({}, projects[action.projectId], { comments: action.comments })
        });
    default:
        return projects;
    }
}
