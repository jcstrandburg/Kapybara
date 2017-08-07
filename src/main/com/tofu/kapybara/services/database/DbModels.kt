package com.tofu.kapybara.services.database

import java.time.OffsetDateTime

data class DbUser (
    val id: Int,
    val username: String,
    val password: String,
    val alias: String,
    val authToken:String?,
    val email: String)

data class DbOrganization(
    val id: Int,
    val name: String,
    val token: String)

data class DbProject(
    val id: Int,
    val name: String,
    val organizationId: Int,
    val discussionContextId: Int)

data class DbDiscussionContext(val id: Int)

data class DbChatChannel(
    val id: Int,
    val name: String,
    val organizationId: Int,
    val discussionContextId: Int)

data class DbDiscussionMessage(
    val id: Int,
    val discussionContextId: Int,
    val userId: Int,
    val content: String,
    val createdTime: OffsetDateTime)