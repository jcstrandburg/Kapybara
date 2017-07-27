package com.tofu.kapybara.integrationtests

import com.tofu.kapybara.data.models.OrganizationCreate
import com.tofu.kapybara.data.models.ProjectCreate
import com.tofu.kapybara.services.MysqlOrganizationRepository
import com.tofu.kapybara.services.MysqlProjectRepository
import com.tofu.kapybara.services.getConfig
import junit.framework.TestCase
import org.junit.Test
import org.sql2o.Sql2o
import java.util.*

class ProjectRepositoryTest: TestCase() {

    @Test
    fun testCreateAndRetrieve() {
        val org = organizationRepository.createOrganization(OrganizationCreate(
            name="ProjectRepositoryTest organization",
            token=UUID.randomUUID().toString()))
        val createdProject = repository.createProject(ProjectCreate(UUID.randomUUID().toString(), org.id))

        val fetchedProject = repository.getProject(createdProject.id)
        assertEquals(createdProject, fetchedProject)
    }

    private val config = getConfig()
    private val sql2o = Sql2o(config.databaseConnectionString, config.databaseUser, config.databasePassword)
    private val organizationRepository = MysqlOrganizationRepository(sql2o)
    private val repository = MysqlProjectRepository(sql2o)
}