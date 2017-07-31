package com.tofu.kapybara.apiv1

import com.google.gson.Gson
import com.tofu.kapybara.apiv1.dtos.OrganizationCollectionDto
import com.tofu.kapybara.apiv1.dtos.OrganizationCreateDto
import com.tofu.kapybara.apiv1.dtos.OrganizationSummaryDto
import com.tofu.kapybara.data.IOrganizationRepository
import com.tofu.kapybara.data.IUserRepository
import com.tofu.kapybara.data.models.Organization

import com.tofu.kapybara.data.models.OrganizationCreate
import com.tofu.kapybara.services.AuthorizationService
import spark.Request
import spark.Response
import spark.Spark.*

class OrganizationController(
    private val authorizationService: AuthorizationService,
    private val organizationRepository: IOrganizationRepository,
    private val userRepository: IUserRepository) {

    init {
        post(Routes.CREATE_ORGANIZATION) { req, res ->
            createOrganization(req, res)
        }
        get(Routes.GET_ORGANIZATION) { req, res ->
            getOrganization(req, res)
        }
        get(Routes.GET_ORGANIZATIONS_FOR_USER) { req, res ->
            getCurrentUserOrganizations(req, res)
        }
    }

    private fun createOrganization(req: Request, res: Response): Any? {
        val user = authorizationService.getLoggedInUser(req) ?: return halt(401)

        val organizationCreate = gson.fromJson(req.body(), OrganizationCreateDto::class.java)
        val organization = OrganizationCreate(
            name=organizationCreate.organization.name,
            token=organizationCreate.organization.token)

        val existingOrganization = organizationRepository.getOrganization(organization.token)
        if (existingOrganization != null)
            return halt(409)

        val createdOrganization = organizationRepository.createOrganization(organization)

        userRepository.addUserToOrganization(user.id, createdOrganization.id)

        return mapToSummary(createdOrganization).toJson()
    }

    private fun getOrganization(req: Request, res: Response): Any? {
        authorizationService.getLoggedInUser(req) ?: return halt(401)

        val token = req.params("orgToken")
        val org = organizationRepository.getOrganization(token) ?: return halt(404)

        return mapToSummary(org).toJson()
    }

    private fun getCurrentUserOrganizations(req: Request, res: Response): Any? {
        val user = authorizationService.getLoggedInUser(req) ?: return halt(401)

        val orgs = organizationRepository.getOrganizationsForUser(user.id)

        return OrganizationCollectionDto(orgs.map { mapToSummary(it)}).toJson()
    }

    private val gson = Gson()
}

private fun mapToSummary(org: Organization): OrganizationSummaryDto {
    return OrganizationSummaryDto(org.id, org.name, org.token)
}