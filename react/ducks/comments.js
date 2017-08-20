import toDict from '../util/toDict';
import * as httpCodes from '../util/appClient';

const GET_FOR_PROJECT_ASYNC = 'COMMENTS/GET_FOR_PROJECT_ASYNC';
const POST_ASYNC = 'COMMENTS/POST_ASYNC';

const COMMENTS_UPDATED = 'COMMENTS/UPDATED';

export function getProjectComments(projectId) {
    if (projectId == null)
        throw new TypeError("Argument null: projectId");

    return { type: GET_FOR_PROJECT_ASYNC, projectId };
}

export function postProjectComment(projectId, content) {
    if (projectId == null)
        throw new TypeError("Argument null: projectId");
    if (content == null)
        throw new TypeError("Argument null: content");

    return { type: POST_ASYNC, projectId, content };
}

export function commentsUpdated(projectId, comments) {
    if (projectId == null)
        throw new TypeError("Argument null: projectId");
    if (comments == null)
        throw new TypeError("Argument null: comments");

    return { type: COMMENTS_UPDATED, projectId, comments };
}

const initialState = {
    byProjectId: {}
};

export default function reducer(comments = initialState, action, appClient) {
    // handle async events
    switch (action.type) {
    case GET_FOR_PROJECT_ASYNC:
        appClient.get('projects/'+action.projectId+'/comments', {
                [httpCodes.OK]: result => action.asyncDispatch(commentsUpdated(action.projectId, result.comments))
            });
        break;
    case POST_ASYNC:
        appClient.post(
            'projects/'+action.projectId+'/comments',
            {
                content: action.content
            },
            {
                [httpCodes.CREATED]: result => action.asyncDispatch(getProjectComments(action.projectId))
            });
        break;
    }

    switch (action.type) {
    case COMMENTS_UPDATED:
        return {
            ...comments,
            byProjectId: {
                ...comments.byProjectId,
                [action.projectId]: action.comments,
            }
        };
    default:
        return comments;
    }
}
