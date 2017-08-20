package com.tofu.kapybara.apiv1.dtos

import com.google.gson.Gson
import java.time.OffsetDateTime

open class Dto {
    fun toJson() = gson.toJson(this)!!
}

data class UserDto(val id: Int, val name: String, val alias: String): Dto()
data class CurrentUserDto(val user: UserDto, val organizations: Collection<OrganizationSummaryDto>): Dto()

data class OrganizationSummaryDto(val id: Int, val name: String, val token: String): Dto()
data class OrganizationCreateDto(val organization: OrganizationSummaryDto): Dto()
data class OrganizationCollectionDto(val organizations: List<OrganizationSummaryDto>): Dto()

data class ProjectSummaryDto(val id: Int, val name: String, val organizationId: Int, val parentProjectId: Int?): Dto()
data class ProjectCreateDto(val project: ProjectSummaryDto): Dto()
data class ProjectCollectionDto(val projects: List<ProjectSummaryDto>): Dto()

data class DiscussionCommentCreateDto(val content: String): Dto()
data class DiscussionCommentDto(val id: Int, val userId: Int, val content: String, val createdTime: OffsetDateTime): Dto()
data class DiscussionCommentCollectionDto(val comments: List<DiscussionCommentDto>): Dto()

private val gson = Gson()