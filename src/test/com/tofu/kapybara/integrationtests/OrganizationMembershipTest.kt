package com.tofu.kapybara.integrationtests

import com.tofu.kapybara.data.models.Organization
import com.tofu.kapybara.data.models.OrganizationCreate
import com.tofu.kapybara.data.models.User
import com.tofu.kapybara.services.MysqlOrganizationRepository
import com.tofu.kapybara.services.MysqlUserRepository
import com.tofu.kapybara.services.getConfig
import createTestOrganization
import createTestUser
import junit.framework.TestCase
import org.junit.Test
import org.sql2o.Sql2o
import java.util.*

class OrganizationMembershipTest: TestCase() {

    override fun setUp() {
        // recreate test users for every test case so we don't have any organization membership noise
        testUser1 = createTestUser(userRepository)
        testUser2 = createTestUser(userRepository)
    }

    @Test
    fun testIsUserInOrganization() {
        val org1 = createTestOrganization(organizationRepository)
        val org2 = createTestOrganization(organizationRepository)

        assertFalse(userRepository.isUserInOrganization(testUser1.id, org1.id))
        assertFalse(userRepository.isUserInOrganization(testUser2.id, org1.id))
        assertFalse(userRepository.isUserInOrganization(testUser1.id, org2.id))
        assertFalse(userRepository.isUserInOrganization(testUser2.id, org2.id))

        userRepository.addUserToOrganization(testUser1.id, org1.id)
        userRepository.addUserToOrganization(testUser2.id, org2.id)

        assertTrue(userRepository.isUserInOrganization(testUser1.id, org1.id))
        assertFalse(userRepository.isUserInOrganization(testUser2.id, org1.id))
        assertFalse(userRepository.isUserInOrganization(testUser1.id, org2.id))
        assertTrue(userRepository.isUserInOrganization(testUser2.id, org2.id))

        userRepository.removeUserFromOrganization(testUser1.id, org1.id)
        userRepository.removeUserFromOrganization(testUser2.id, org2.id)
        userRepository.addUserToOrganization(testUser1.id, org2.id)
        userRepository.addUserToOrganization(testUser2.id, org1.id)

        assertFalse(userRepository.isUserInOrganization(testUser1.id, org1.id))
        assertTrue(userRepository.isUserInOrganization(testUser2.id, org1.id))
        assertTrue(userRepository.isUserInOrganization(testUser1.id, org2.id))
        assertFalse(userRepository.isUserInOrganization(testUser2.id, org2.id))

        userRepository.removeUserFromOrganization(testUser1.id, org2.id)
        userRepository.removeUserFromOrganization(testUser2.id, org1.id)

        assertFalse(userRepository.isUserInOrganization(testUser1.id, org1.id))
        assertFalse(userRepository.isUserInOrganization(testUser2.id, org1.id))
        assertFalse(userRepository.isUserInOrganization(testUser1.id, org2.id))
        assertFalse(userRepository.isUserInOrganization(testUser2.id, org2.id))
    }

    @Test
    fun testGetOrganizationMembers() {
        val org = createTestOrganization(organizationRepository)

        assertEquals(0, userRepository.getUsersForOrganization(org.id).size)

        userRepository.addUserToOrganization(testUser1.id, org.id)
        assertEquals(listOf(testUser1.id), userRepository.getUsersForOrganization(org.id).map {user -> user.id})

        userRepository.addUserToOrganization(testUser2.id, org.id)
        assertEquals(listOf(testUser1.id, testUser2.id), userRepository.getUsersForOrganization(org.id).map {user -> user.id})

        userRepository.removeUserFromOrganization(testUser1.id, org.id)
        assertEquals(listOf(testUser2.id), userRepository.getUsersForOrganization(org.id).map {user -> user.id})
    }

    @Test
    fun testGetOrganizationsForUser() {
        val org = createTestOrganization(organizationRepository)

        assertEquals(listOf<Int>(), organizationRepository.getOrganizationsForUser(testUser1.id).map{it.id})
        assertEquals(listOf<Int>(), organizationRepository.getOrganizationsForUser(testUser2.id).map{it.id})

        userRepository.addUserToOrganization(testUser1.id, org.id)

        assertEquals(listOf(org.id), organizationRepository.getOrganizationsForUser(testUser1.id).map{it.id})
        assertEquals(listOf<Int>(), organizationRepository.getOrganizationsForUser(testUser2.id).map{it.id})

        userRepository.addUserToOrganization(testUser2.id, org.id)

        assertEquals(listOf(org.id), organizationRepository.getOrganizationsForUser(testUser1.id).map{it.id})
        assertEquals(listOf(org.id), organizationRepository.getOrganizationsForUser(testUser2.id).map{it.id})

        userRepository.removeUserFromOrganization(testUser1.id, org.id)

        assertEquals(listOf<Int>(), organizationRepository.getOrganizationsForUser(testUser1.id).map{it.id})
        assertEquals(listOf(org.id), organizationRepository.getOrganizationsForUser(testUser2.id).map{it.id})
    }

    private val config = getConfig()
    private val sql2o = Sql2o(config.databaseConnectionString, config.databaseUser, config.databasePassword)
    private val userRepository = MysqlUserRepository(sql2o)
    private val organizationRepository = MysqlOrganizationRepository(sql2o)

    private lateinit var testUser1: User
    private lateinit var testUser2: User
}