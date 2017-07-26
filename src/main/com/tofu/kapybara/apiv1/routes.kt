package com.tofu.kapybara.apiv1

object Routes {
    const val GET_CURRENT_USER = "/api/v1/users/me"
    const val GET_USER = "/api/v1/users/:username"
    const val CREATE_ORGANIZATION = "/api/v1/organizations"
    const val GET_ORGANIZATION = "/api/v1/organizations/:orgToken"
}
