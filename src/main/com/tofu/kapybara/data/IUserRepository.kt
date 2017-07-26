package com.tofu.kapybara.data

import com.tofu.kapybara.data.models.User

interface IUserRepository {
    fun createUser(user: User): User
    fun getUser(name: String): User?
    fun getUser(id: Int): User?
    fun setUserAuthToken(id: Int, token: String): User
    fun updateUser(user: User): User?

    /**
     * Gets all users that have a relationship with an organization.
     * If the organization does not exist then an empty List will be returned.
     */
    fun getUsersForOrganization(organizationId: Int): List<User>

    /**
     * Adds the user with the given id to the given organization.
     * @throws InvalidStateError
     *
     */
    fun addUserToOrganization(userId: Int, organizationId: Int)
    fun removeUserFromOrganization(userId: Int, organizationId: Int)
    fun isUserInOrganization(userId: Int, organizationId: Int): Boolean
}