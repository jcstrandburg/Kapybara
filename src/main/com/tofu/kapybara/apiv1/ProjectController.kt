package com.tofu.kapybara.apiv1

import com.google.gson.Gson
import com.tofu.kapybara.apiv1.dtos.*
import com.tofu.kapybara.data.IOrganizationRepository
import com.tofu.kapybara.data.IProjectRepository
import com.tofu.kapybara.data.IUserRepository
import com.tofu.kapybara.data.models.DiscussionMessageCreate
import com.tofu.kapybara.data.models.ProjectCreate
import com.tofu.kapybara.services.AuthenticationService
import spark.Request
import spark.Response
import spark.Spark.*
import sun.plugin.dom.exception.InvalidStateException

class ProjectController(
    val authenticationService: AuthenticationService,
    val projectRepository: IProjectRepository,
    val userRepository: IUserRepository,
    val organizationRepository: IOrganizationRepository) {

    init {
        post(Routes.CREATE_PROJECT) { req, res -> createProject(req, res) }
        get(Routes.GET_PROJECT) { req, _ -> getProject(req) }
        get(Routes.GET_PROJECTS_FOR_ORGANIZATION) { req, _ -> getProjectsForOrganization(req) }

        post(Routes.CREATE_PROJECT_COMMENT) { req, res -> createProjectComment(req, res) }
        get(Routes.GET_PROJECT_COMMENTS) { req, _ -> getProjectComments(req) }
    }

    private fun createProject(req: Request, res: Response): Any? {
        val user = authenticationService.getLoggedInUser(req) ?: return halt(401)

        val createDto = gson.fromJson(req.body(), ProjectCreateDto::class.java)
        val project = ProjectCreate(
            name=createDto.project.name,
            organizationId=createDto.project.organizationId,
            parentProjectId=createDto.project.parentProjectId)

        if (!userRepository.isUserInOrganization(user.id, project.organizationId))
            return halt(404)

        val createdProject = projectRepository.createProject(project)

        res.status(201)
        return ProjectSummaryDto(
                createdProject.id,
                createdProject.name,
                createdProject.organizationId,
                createdProject.parentProjectId)
            .toJson()
    }

    private fun getProject(req: Request): Any? {
        authenticationService.getLoggedInUser(req) ?: return halt(401)

        val projectId = req.params("projectId").toIntOrNull() ?: return halt(400)
        val project = projectRepository.getProject(projectId) ?: return halt(404)

        return ProjectSummaryDto(
                id=project.id,
                name=project.name,
                organizationId=project.organizationId,
                parentProjectId=project.parentProjectId)
            .toJson()
    }

    private fun getProjectsForOrganization(req: Request): Any? {
        authenticationService.getLoggedInUser(req) ?: return halt(401)
        val orgToken = req.params("orgToken") ?: return halt(400)
        val parentProjectId = req.queryParams("parent")?.toIntOrNull()
        val organization = organizationRepository.getOrganization(orgToken) ?: return halt(404)

        val projects = projectRepository.getProjectsForOrganization(organization.id, parentProjectId)

        return ProjectCollectionDto(projects.map {
                ProjectSummaryDto(it.id, it.name, it.organizationId, it.parentProjectId)
            })
            .toJson()
    }

    private fun createProjectComment(req: Request, res: Response): Any? {
        val user = authenticationService.getLoggedInUser(req) ?: return halt(401)
        val projectId = req.params("projectId").toIntOrNull() ?: return halt(400)
        val project = projectRepository.getProject(projectId) ?: return halt(404)
        val organization = organizationRepository.getOrganization(project.organizationId)
            ?: throw InvalidStateException("Unable to locate organization $project.organizationId")

        if (!userRepository.isUserInOrganization(user.id, organization.id))
            return halt(404)

        val createDto = gson.fromJson(req.body(), DiscussionCommentCreateDto::class.java)
        val message = projectRepository.addDiscussionMessage(
            projectId,
            DiscussionMessageCreate(user.id, createDto.content))

        res.status(201)
        return DiscussionCommentDto(
                id=message.id,
                userId=message.userId,
                content=message.content,
                createdTime=message.createdTime)
            .toJson()
    }

    private fun getProjectComments(req: Request): Any? {
        val user = authenticationService.getLoggedInUser(req) ?: return halt(401)
        val projectId = req.params("projectId").toIntOrNull() ?: return halt(400)
        val project = projectRepository.getProject(projectId) ?: return halt(404)
        val organization = organizationRepository.getOrganization(project.organizationId)
            ?: throw InvalidStateException("Unable to locate organization $project.organizationId")

        if (!userRepository.isUserInOrganization(user.id, organization.id))
            return halt(404)

        val messages = projectRepository.getDiscussionMessages(projectId)
        return DiscussionCommentCollectionDto(
                messages.map { DiscussionCommentDto(
                    id=it.id,
                    userId=it.userId,
                    content=it.content,
                    createdTime=it.createdTime) }
            ).toJson()
    }

    private val gson = Gson()
}