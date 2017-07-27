package com.tofu.kapybara.data.models

data class User(
    val id: Int,
    val name: String,
    val password: String,
    val authToken: String,
    val alias: String)

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