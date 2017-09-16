package com.tofu.kapybara

import com.tofu.kapybara.services.AuthenticationService
import com.tofu.kapybara.util.splitQuery
import spark.Request
import spark.Response
import spark.Spark.get
import spark.Spark.post

class AuthenticationController(val authenticationService: AuthenticationService) {

    init{
        get(Routes.SIGN_IN) { req, res -> signInForm(req, res) }
        post(Routes.SIGN_IN) { req, res -> doSignIn(req, res) }
        get(Routes.SIGN_OUT) { req, res -> logOut(req, res) }
    }

    private fun signInForm(req: Request, res: Response): Any? {
        val user = authenticationService.getLoggedInUser(req)
        if (user != null)
            return res.redirect(Routes.APP)

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
        val authenticatedUser = authenticationService.logInUser(formData["username"]!!, formData["password"]!!, res)

        if (authenticatedUser != null) {
            return res.redirect(authenticationService.getLogInSuccessRedirectUri(req) ?: Routes.APP)
        } else {
            req.session().attribute("auth_error", "Unable to login with these credentials")
            return res.redirect(Routes.SIGN_IN)
        }
    }

    private fun logOut(req: Request, res: Response): Any? {
        authenticationService.logOutUser(res)
        return res.redirect(Routes.SIGN_IN)
    }
}
