package com.tofu.kapybara.integrationtests

import com.tofu.kapybara.data.models.User
import com.tofu.kapybara.data.models.UserCreate
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
        val uniqueId = UUID.randomUUID().toString()
        return repository.createUser(UserCreate(
            name = uniqueId,
            password = "password",
            authToken = "",
            alias = "UserRepositoryTest user",
            email = "$uniqueId@example.com"))
    }

    private val config = getConfig()
    private val repository = MysqlUserRepository(Sql2o(config.databaseConnectionString, config.databaseUser, config.databasePassword))
}
