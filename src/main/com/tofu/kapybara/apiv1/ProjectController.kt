package com.tofu.kapybara.apiv1

import com.google.gson.Gson
import com.tofu.kapybara.apiv1.dtos.ProjectCreateDto
import com.tofu.kapybara.apiv1.dtos.ProjectSummaryDto
import com.tofu.kapybara.data.IOrganizationRepository
import com.tofu.kapybara.data.IProjectRepository
import com.tofu.kapybara.data.IUserRepository
import com.tofu.kapybara.data.models.ProjectCreate
import com.tofu.kapybara.services.AuthorizationService
import spark.Request
import spark.Response
import spark.Spark.*

class ProjectController(
    val authorizationService: AuthorizationService,
    val projectRepository: IProjectRepository,
    val userRepository: IUserRepository,
    val organizationRepository: IOrganizationRepository) {

    init {
        post(Routes.CREATE_PROJECT) { req, res ->
            createProject(req, res)
        }
        get(Routes.GET_PROJECT) { req, res ->
            getProject(req, res)
        }
    }

    private fun createProject(req: Request, res: Response): Any? {
        val user = authorizationService.getLoggedInUser(req) ?: return halt(401)

        val createDto = gson.fromJson(req.body(), ProjectCreateDto::class.java)
        val project = ProjectCreate(
                name=createDto.project.name,
                organizationId=createDto.project.organizationId)

        if (!userRepository.isUserInOrganization(user.id, project.organizationId))
            return halt(404)

        val createdProject = projectRepository.createProject(project)

        return ProjectSummaryDto(
                createdProject.id,
                createdProject.name,
                createdProject.organizationId)
            .toJson()
    }

    private fun getProject(req: Request, res: Response): Any? {
        val projectId = req.queryParams("projectId").toIntOrNull() ?: return halt(400)
        val project = projectRepository.getProject(projectId) ?: return halt(404)

        return ProjectSummaryDto(
                id=project.id,
                name=project.name,
                organizationId=project.organizationId)
            .toJson()
    }

    private val gson = Gson()
}