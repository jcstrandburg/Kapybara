package com.tofu.kapybara.apiv1

object Routes {
    const val GET_CURRENT_USER = "/api/v1/users/me"
    const val GET_USER = "/api/v1/users/:username"
    const val CREATE_ORGANIZATION = "/api/v1/organizations"
    const val GET_ORGANIZATION = "/api/v1/organizations/:orgToken"
    const val GET_PROJECT = "/api/v1/organizations/:orgToken/projects/:projectId"
    const val CREATE_PROJECT = "/api/v1/organizations/:orgToken/projects"
}
