package com.tofu.kapybara

import com.tofu.kapybara.services.AuthorizationService
import spark.Request
import spark.Response
import spark.Spark.get
import java.util.*

class AppController(val authorizationService: AuthorizationService) {
    init {
        get("/app") { req, res -> serveApp(req, res) }
    }

    private fun serveApp(req: Request, res: Response): Any? {
        authorizationService.getLoggedInUser(req) ?: return res.redirect("/auth/signin")

        val cacheBuster = UUID.randomUUID()
        return """
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>React App</title>
        <link rel="stylesheet" href="styles.css?$cacheBuster">
    </head>
    <body>
        <div id="app">
            Hello world
            <a href="/auth/signout">Log Out</a>
        </div>
        <script src="index.js?$cacheBuster"></script>
    </body>
</html>
"""
    }
}