package com.tofu.kapybara.integrationtests

import com.tofu.kapybara.data.models.User
import com.tofu.kapybara.services.MysqlUserRepository
import com.tofu.kapybara.services.getConfig
import junit.framework.TestCase
import org.junit.Test
import org.sql2o.Sql2o
import java.util.*

class UserRepositoryTest : TestCase() {

    @Test
    fun testCreateAndGet() {
        val createdUser = createTestUser()

        assertEquals(createdUser, repository.getUser(createdUser.id))
        assertEquals(createdUser, repository.getUser(createdUser.name))
    }

    private fun createTestUser(): User {
        return repository.createUser(User(
            id = -1,
            name = UUID.randomUUID().toString(),
            password = "password",
            authToken = "",
            alias = "UserRepositoryTest user"))
    }

    private val config = getConfig()
    private val repository = MysqlUserRepository(Sql2o(config.databaseConnectionString, config.databaseUser, config.databasePassword))
}
