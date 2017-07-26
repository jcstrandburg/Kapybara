package com.tofu.kapybara.apiv1.dtos

import com.google.gson.Gson

val gson = Gson()

open class Dto {
    fun toJson() = gson.toJson(this)!!
}

data class OrganizationSummaryDto(val id: Int, val name: String, val token: String): Dto()
data class UserDto(val id: Int, val name: String, val alias: String): Dto()
data class CurrentUserDto(val user: UserDto, val organizations: Collection<OrganizationSummaryDto>): Dto()
data class OrganizationCreateDto(val organization: OrganizationSummaryDto)
