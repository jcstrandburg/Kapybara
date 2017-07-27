package com.tofu.kapybara.data

import com.tofu.kapybara.data.models.Organization
import com.tofu.kapybara.data.models.OrganizationCreate

interface IOrganizationRepository {
    fun getOrganization(id: Int): Organization?
    fun getOrganization(token: String): Organization?
    fun createOrganization(org: OrganizationCreate): Organization
    fun getOrganizationsForUser(userId: Int): List<Organization>
}