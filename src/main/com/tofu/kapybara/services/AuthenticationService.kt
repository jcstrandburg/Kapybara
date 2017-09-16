package com.tofu.kapybara.services

import com.tofu.kapybara.data.IUserRepository
import com.tofu.kapybara.data.models.User
import org.mindrot.jbcrypt.BCrypt
import spark.Request
import spark.Response
import java.util.*

class AuthenticationService(val userRepository: IUserRepository) {
    /**
     * Gets the currently authenticated user via cookies
     */
    fun getLoggedInUser(request: Request): User? {
        val username = request.cookie(USERNAME_COOKIE)
        val authToken = request.cookie(AUTH_TOKEN_COOKIE)
        if (username == null || authToken == null)
            return null

        val user = userRepository.getUser(username) ?: return null
        return if (user.authToken == authToken) user else null
    }

    fun logInUser(name: String, plainPassword: String, response: Response): User? {
        val user = userRepository.getUser(name) ?: return null

        if (BCrypt.checkpw(plainPassword, user.password)) {
            val authenticatedUser = userRepository.setUserAuthToken(user.id, UUID.randomUUID().toString())

            setCookie(response, USERNAME_COOKIE, authenticatedUser.name)
            setCookie(response, AUTH_TOKEN_COOKIE, authenticatedUser.authToken)

            return authenticatedUser
        }
        return null
    }

    fun hashPassword(plainPassword: String) =
        BCrypt.hashpw(plainPassword, BCrypt.gensalt(12))!!

    fun logOutUser(response: Response) {
        unsetCookie(response, USERNAME_COOKIE)
        unsetCookie(response, AUTH_TOKEN_COOKIE)
    }

    fun setLogInSuccessRedirectUri(uri: String, response: Response) =
        setCookie(response, LOG_IN_REDIRECT_COOKIE, uri)

    fun getLogInSuccessRedirectUri(request: Request): String? =
        request.cookie(LOG_IN_REDIRECT_COOKIE)

    fun clearLogInSuccessRedirectUri(response: Response) =
        unsetCookie(response, LOG_IN_REDIRECT_COOKIE)

    private fun setCookie(response: Response, name: String, value: String) {
        response.cookie(
            "/", // root path so that the cookie gets submitted for all pages
            name,
            value,
            -1, // no expiration
            false, // secure only
            false) // http only
    }

    companion object {
        private const val USERNAME_COOKIE = "username"
        private const val AUTH_TOKEN_COOKIE = "authToken"
        private const val LOG_IN_REDIRECT_COOKIE = "logInSuccessRedirect"
    }

    private fun unsetCookie(response: Response, name: String) = response.removeCookie("/", name)
}
