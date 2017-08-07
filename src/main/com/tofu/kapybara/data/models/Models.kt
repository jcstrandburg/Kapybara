package com.tofu.kapybara.data.models

import java.time.OffsetDateTime

data class User(
    val id: Int,
    val name: String,
    val password: String,
    val authToken: String,
    val alias: String,
    val email: String)

data class UserCreate(
    val name: String,
    val password: String,
    val authToken: String,
    val alias: String,
    val email: String)

data class Organization(
    val id: Int,
    val name: String,
    val token: String)

data class OrganizationCreate(
    val name: String,
    val token: String)

data class Project(
    val id: Int,
    val name: String,
    val organizationId: Int)

data class ProjectCreate(
    val name: String,
    val organizationId: Int)

data class DiscussionMessage(
    val id: Int,
    val userId: Int,
    val content: String,
    val createdTime: OffsetDateTime)

data class DiscussionMessageCreate(
    val userId: Int,
    val content: String)
