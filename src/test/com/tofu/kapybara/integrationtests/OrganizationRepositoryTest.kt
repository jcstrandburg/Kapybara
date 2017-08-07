package com.tofu.kapybara.integrationtests

import com.tofu.kapybara.data.models.OrganizationCreate
import com.tofu.kapybara.services.MysqlOrganizationRepository
import com.tofu.kapybara.services.getConfig
import createTestOrganization
import junit.framework.TestCase
import org.junit.Test
import org.sql2o.Sql2o
import java.util.*

class OrganizationRepositoryTest : TestCase() {

    @Test
    fun testCreateAndRetrieve() {
        val createdOrg = createTestOrganization(repository)

        assertEquals(createdOrg, repository.getOrganization(createdOrg.id))
        assertEquals(createdOrg, repository.getOrganization(createdOrg.token))
    }

    private val config = getConfig()
    private val repository = MysqlOrganizationRepository(Sql2o(config.databaseConnectionString, config.databaseUser, config.databasePassword))
}