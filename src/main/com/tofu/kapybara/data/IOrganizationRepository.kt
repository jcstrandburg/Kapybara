package com.tofu.kapybara.data

import com.tofu.kapybara.data.models.Organization

interface IOrganizationRepository {
    fun getOrganization(id: Int): Organization?
    fun getOrganization(token: String): Organization?
    fun createOrganization(org: Organization): Organization
    fun getOrganizationsForUser(userId: Int): List<Organization>
}