package com.tofu.kapybara.services.database

data class DbUser (
        val id: Int,
        val username: String,
        val password: String,
        val alias: String,
        val authToken:String?)

data class DbOrganization(
        val id: Int,
        val name: String,
        val token: String)

data class DbOrganizationRelationship(
        val id: Int,
        val userId: Int,
        val organizationId: Int)