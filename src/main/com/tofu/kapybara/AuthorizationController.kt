package com.tofu.kapybara

import com.tofu.kapybara.services.AuthorizationService
import com.tofu.kapybara.util.splitQuery
import spark.Request
import spark.Response
import spark.Spark.get
import spark.Spark.post

class AuthorizationController(val authorizationService: AuthorizationService) {

    init{
        get("/auth/signin") { req, res -> signInForm(req, res) }
        post("/auth/signin") { req, res -> doSignIn(req, res) }
        get("/auth/signout") { req, res -> logOut(req, res) }
    }

    private fun signInForm(req: Request, res: Response): Any? {
        val user = authorizationService.getLoggedInUser(req)
        if (user != null)
            return res.redirect("/app")

        val err: String
        val auth_error:String? = req.session().attribute("auth_error")
        if (auth_error != null) {
            req.session().attribute("auth_error", null)
            err = "<div>$auth_error</div>";
        } else {
            err = ""
        }

        // todo: make this a real template
        return """
<html>
<head>
</head>
<body>
    $err
    <form method="POST">
        Name: <input type="text" name="username"></input><br>
        Password: <input type="password" name="password"></input><br>
    <input type="submit" />
</form>
</body>
</html>
"""
    }

    private fun doSignIn(req: Request, res: Response): Any? {
        val formData = splitQuery(req.body())
        val authenticatedUser = authorizationService.logInUser(formData["username"]!!, formData["password"]!!, res)

        if (authenticatedUser != null) {
            return res.redirect("/app")
        } else {
            req.session().attribute("auth_error", "Unable to login with these credentials")
            return res.redirect("/auth/signin")
        }
    }

    private fun logOut(req: Request, res: Response): Any? {
        authorizationService.logOutUser(res)
        return res.redirect("/auth/signin")
    }
}