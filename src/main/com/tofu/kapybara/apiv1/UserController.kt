package com.tofu.kapybara.apiv1

import com.tofu.kapybara.StatusCode
import com.tofu.kapybara.apiv1.dtos.CurrentUserDto
import com.tofu.kapybara.apiv1.dtos.OrganizationSummaryDto
import com.tofu.kapybara.apiv1.dtos.UserDto
import com.tofu.kapybara.data.IOrganizationRepository
import com.tofu.kapybara.data.IUserRepository
import com.tofu.kapybara.services.AuthenticationService
import spark.Request
import spark.Response
import spark.Spark.get
import spark.Spark.halt

class UserController(
    private val authenticationService: AuthenticationService,
    private val userRepository: IUserRepository,
    private val organizationRepository: IOrganizationRepository) {

    init {
        get(Routes.GET_CURRENT_USER) { req, res ->
            getCurrentUser(req, res)
        }
        get(Routes.GET_USER) { req, res ->
            getUser(req, res)
        }
    }

    private fun  getCurrentUser(req: Request, res: Response): Any? {
        val user = authenticationService.getLoggedInUser(req) ?: return halt(StatusCode.UNAUTHORIZED)
        val organizations = organizationRepository.getOrganizationsForUser(user.id)

        return CurrentUserDto(
                UserDto(
                    id=user.id,
                    name=user.name,
                    alias=user.alias),
                organizations.map{OrganizationSummaryDto(
                    id=it.id,
                    name=it.name,
                    token=it.token)})
            .toJson()
    }

    private fun getUser(req: Request, res: Response): Any? {
        authenticationService.getLoggedInUser(req) ?: return halt(StatusCode.UNAUTHORIZED)
        val userId = req.params(":userId")?.toIntOrNull() ?: return halt(StatusCode.BAD_REQUEST)

        val user = userRepository.getUser(userId) ?: return halt(StatusCode.NOT_FOUND)
        return UserDto(
                id=user.id,
                name=user.name,
                alias=user.alias)
            .toJson()
    }
}
