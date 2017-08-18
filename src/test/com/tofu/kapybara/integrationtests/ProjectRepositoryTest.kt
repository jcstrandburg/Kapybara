package com.tofu.kapybara.integrationtests

import com.tofu.kapybara.data.models.DiscussionMessageCreate
import com.tofu.kapybara.services.*
import createTestOrganization
import createTestProject
import createTestUser
import junit.framework.TestCase
import org.junit.BeforeClass
import org.junit.Test
import org.sql2o.Sql2o

class ProjectRepositoryTest: TestCase() {

    companion object {
        @BeforeClass
        @JvmStatic
        fun setup() {
        }
    }

    @Test
    fun testCreateAndRetrieve() {
        val org = createTestOrganization(organizationRepository)
        val createdProject = createTestProject(repository, org.id, null)

        val fetchedProject = repository.getProject(createdProject.id)
        assertEquals(createdProject, fetchedProject)
    }

    @Test
    fun testGetProjectsForOrganizationWithParentage() {
        val org = createTestOrganization(organizationRepository)
        val topLevelProject = createTestProject(repository, org.id, null)
        val childProject = createTestProject(repository, org.id, topLevelProject.id)

        assertEquals(topLevelProject.id, childProject.parentProjectId)

        val fetchedTopLevelProjects = repository.getProjectsForOrganization(org.id, null)
        assertEquals(topLevelProject, fetchedTopLevelProjects.single())

        val fetchedChildProjects = repository.getProjectsForOrganization(org.id, topLevelProject.id)
        assertEquals(childProject, fetchedChildProjects.single())
    }

    @Test
    fun testDiscussionMessages() {
        val user = createTestUser(userRepository)
        val org = createTestOrganization(organizationRepository)
        val proj = createTestProject(repository, org.id, null)

        val messageCreate = DiscussionMessageCreate(user.id, "Message content")
        val message = repository.addDiscussionMessage(proj.id, messageCreate)
        assertEquals(message.userId, messageCreate.userId)
        assertEquals(message.content, messageCreate.content)

        val messages = repository.getDiscussionMessages(proj.id)
        assertEquals(message, messages.single())
    }

    private val config = getConfig()
    private val sql2o = Sql2o(config.databaseConnectionString, config.databaseUser, config.databasePassword)
    private val organizationRepository = MysqlOrganizationRepository(sql2o)
    private val repository = MysqlProjectRepository(sql2o, MysqlDiscussionContextService(sql2o))
    private val userRepository = MysqlUserRepository(sql2o)
}