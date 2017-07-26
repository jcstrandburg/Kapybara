package com.tofu.kapybara

import com.tofu.kapybara.data.models.User
import com.tofu.kapybara.services.AuthorizationService
import com.tofu.kapybara.services.MysqlUserRepository
import com.tofu.kapybara.services.getConfig
import org.sql2o.Sql2o

private data class ReflectMe(val x: String, val y: Int)

fun main(args: Array<String>) {
    val config = getConfig()
    val sql2o = Sql2o(config.databaseConnectionString, config.databaseUser, config.databasePassword)
    val userRepository = MysqlUserRepository(sql2o)
    val authService = AuthorizationService(userRepository)

    userRepository.createUser(User(
        id=-1,
        name="jimbo",
        password=authService.hashPassword("password"),
        authToken="",
        alias=""))
}
