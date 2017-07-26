package com.tofu.kapybara

import com.tofu.kapybara.apiv1.OrganizationController
import com.tofu.kapybara.apiv1.UserController
import com.tofu.kapybara.services.AuthorizationService
import com.tofu.kapybara.services.MysqlOrganizationRepository
import com.tofu.kapybara.services.MysqlUserRepository
import com.tofu.kapybara.services.getConfig
import org.sql2o.Sql2o
import spark.Spark.*

fun main(args: Array<String>) {

    val config = getConfig()
    val sql2o = Sql2o(config.databaseConnectionString, config.databaseUser, config.databasePassword)

    val userRepository = MysqlUserRepository(sql2o)
    val organizationRepository = MysqlOrganizationRepository(sql2o)
    val authorizationService = AuthorizationService(userRepository)

    port(8080)
    staticFiles.externalLocation(config.staticFileLocation)
    init()

    AppController(authorizationService)
    AuthorizationController(authorizationService)
    UserController(authorizationService, userRepository, organizationRepository)
    OrganizationController(authorizationService, organizationRepository, userRepository)

    exception(Exception::class.java) { e, _, _ ->
        println(e)
    }
}
