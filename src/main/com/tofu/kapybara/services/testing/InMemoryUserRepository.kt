package com.tofu.kapybara.services.testing

import com.tofu.kapybara.data.IUserRepository
import com.tofu.kapybara.data.models.User
import com.tofu.kapybara.data.models.UserCreate
import java.util.*
import kotlin.NoSuchElementException

class InMemoryUserRepository: IUserRepository {

    override fun createUser(user: UserCreate): User {
        val newUser = User(
            id = nextId++,
            name = user.name,
            password = user.password,
            authToken = user.authToken,
            alias = user.alias,
            email = user.email)

        users[user.name] = newUser
        return newUser
    }

    override fun getUser(name: String): User? {
        return users[name]
    }

    override fun getUser(id: Int): User? {
        return users.values.filter { it.id == id }.singleOrNull()
    }

    override fun setUserAuthToken(id: Int, token: String): User {
        val user = getUser(id) ?: throw NoSuchElementException()

        val userWithAuthToken = user.copy(authToken = token)
        return updateUser(userWithAuthToken)!!
    }

    override fun updateUser(user: User): User? {
        if (users.contains(user.name)) {
            users[user.name] = user
            return user
        } else {
            return null
        }
    }

    override fun getUsersForOrganization(organizationId: Int): List<User> = TODO("not implemented")
    override fun addUserToOrganization(userId: Int, organizationId: Int) = TODO("not implemented")
    override fun removeUserFromOrganization(userId: Int, organizationId: Int) = TODO("not implemented")
    override fun isUserInOrganization(userId: Int, organizationId: Int) = TODO("not implemented")

    private val users = HashMap<String, User>()
    private var nextId = 1000
}