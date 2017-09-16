package com.tofu.kapybara

import com.tofu.kapybara.services.AuthenticationService
import spark.Request
import spark.Response
import spark.Spark.get
import java.util.*

class AppController(val authenticationService: AuthenticationService) {
    init {
        get(Routes.APP) { req, res -> serveApp(req, res) }
        get(Routes.APP_WILDCARD) { req, res -> serveApp(req, res) }
    }

    private fun serveApp(req: Request, res: Response): Any? {
        val user = authenticationService.getLoggedInUser(req)

        if (user == null) {
            authenticationService.setLogInSuccessRedirectUri(req.uri(), res)
            return res.redirect(Routes.SIGN_IN)
        }
        else {
            authenticationService.clearLogInSuccessRedirectUri(res)
        }

        // TODO: smarter cache buster
        val cacheBuster = UUID.randomUUID()
        return """
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>React App</title>
        <link rel="stylesheet" href="/styles.css?$cacheBuster">
    </head>
    <body>
        <div id="app" class="app-container">
            Hello world
            <a href="${Routes.SIGN_OUT}">Log Out</a>
        </div>
        <script src="/index.js?$cacheBuster"></script>
    </body>
</html>
"""
    }
}
