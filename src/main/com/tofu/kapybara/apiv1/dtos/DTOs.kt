package com.tofu.kapybara.apiv1.dtos

import com.google.gson.Gson

open class Dto {
    fun toJson() = gson.toJson(this)!!
}

data class UserDto(val id: Int, val name: String, val alias: String): Dto()
data class CurrentUserDto(val user: UserDto, val organizations: Collection<OrganizationSummaryDto>): Dto()

data class OrganizationSummaryDto(val id: Int, val name: String, val token: String): Dto()
data class OrganizationCreateDto(val organization: OrganizationSummaryDto): Dto()
data class OrganizationCollectionDto(val organizations: List<OrganizationSummaryDto>): Dto()

data class ProjectSummaryDto(val id: Int, val name: String, val organizationId: Int): Dto()
data class ProjectCreateDto(val project: ProjectSummaryDto): Dto()
data class ProjectCollectionDto(val projects: List<ProjectSummaryDto>): Dto()

private val gson = Gson()