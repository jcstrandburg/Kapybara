package com.tofu.kapybara.apiv1

object Routes {
    const val GET_CURRENT_USER = "/api/v1/users/me"
    const val GET_USER = "/api/v1/users/:username"

    const val CREATE_ORGANIZATION = "/api/v1/organizations"
    const val GET_ORGANIZATION = "/api/v1/organizations/:orgToken"
    const val GET_ORGANIZATIONS_FOR_USER = "/api/v1/users/me/organizations"

    const val GET_PROJECT = "/api/v1/projects/:projectId"
    const val CREATE_PROJECT = "/api/v1/projects"
    const val GET_PROJECTS_FOR_ORGANIZATION = "/api/v1/organizations/:orgToken/projects"

    const val CREATE_PROJECT_COMMENT = "/api/v1/projects/:projectId/comments"
    const val GET_PROJECT_COMMENTS = "/api/v1/projects/:projectId/comments"
}
