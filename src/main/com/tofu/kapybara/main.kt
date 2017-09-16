package com.tofu.kapybara

import com.tofu.kapybara.apiv1.OrganizationController
import com.tofu.kapybara.apiv1.ProjectController
import com.tofu.kapybara.apiv1.UserController
import com.tofu.kapybara.services.*
import org.sql2o.Sql2o
import spark.Spark.*

fun main(args: Array<String>) {
    val config = getConfig()
    val sql2o = Sql2o(config.databaseConnectionString, config.databaseUser, config.databasePassword)

    val discussionContextService = MysqlDiscussionContextService(sql2o)
    val userRepository = MysqlUserRepository(sql2o)
    val organizationRepository = MysqlOrganizationRepository(sql2o)
    val projectRepository = MysqlProjectRepository(sql2o, discussionContextService)
    val authorizationService = AuthenticationService(userRepository)

    port(8080)
    staticFiles.externalLocation(config.staticFileLocation)
    init()

    AppController(authorizationService)
    AuthenticationController(authorizationService)
    UserController(authorizationService, userRepository, organizationRepository)
    OrganizationController(authorizationService, organizationRepository, userRepository)
    ProjectController(authorizationService, projectRepository, userRepository, organizationRepository)

    exception(Exception::class.java) { e, _, _ ->
        println(e)
    }
}
