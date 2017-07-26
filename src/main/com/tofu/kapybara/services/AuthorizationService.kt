package com.tofu.kapybara.services

import com.tofu.kapybara.data.IUserRepository
import com.tofu.kapybara.data.models.User
import org.mindrot.jbcrypt.BCrypt
import spark.Request
import spark.Response
import java.util.*

class AuthorizationService(val userRepository: IUserRepository) {
    /**
     * Gets the currently authenticated user via cookies
     */
    fun getLoggedInUser(request: Request): User? {
        val username = request.cookie("username")
        val authToken = request.cookie("authToken")
        if (username == null || authToken == null)
            return null

        val user = userRepository.getUser(username) ?: return null
        return if (user.authToken == authToken) user else null
    }

    fun logInUser(name: String, plainPassword: String, response: Response): User? {
        val user = userRepository.getUser(name) ?: return null

        if (BCrypt.checkpw(plainPassword, user.password)) {
            // todo: use setcookie method
            val authenticatedUser = userRepository.setUserAuthToken(user.id, UUID.randomUUID().toString())
            response.cookie("/", "username", authenticatedUser.name, -1, false, false)
            response.cookie("/", "authToken", authenticatedUser.authToken, -1, false, false)

            return authenticatedUser
        }
        return null
    }

    fun hashPassword(plainPassword: String) = BCrypt.hashpw(plainPassword, BCrypt.gensalt(12))!!

    fun logOutUser(response: Response) {
        response.removeCookie("username")
        response.removeCookie("authToken")
    }

    private fun setCookie(response: Response, name: String, value: String) {
        response.cookie(
            "/", // root path so that the cookie gets submitted for all pages
            name,
            value,
            -1, // no expiration
            false, // secure only
            false) // http only
    }
}