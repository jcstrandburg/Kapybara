package com.tofu.kapybara.apiv1

import com.google.gson.Gson
import spark.Request
import spark.Response
import spark.Spark.post

class ProjectController {

    init {
        post(Routes.CREATE_PROJECT) { req, res ->
            createProject(req, res)
        }
        post(Routes.GET_PROJECT) { req, res ->
            getProject(req, res)
        }
    }

    private fun createProject(request: Request, res: Response) {
        return Unit
    }

    private fun getProject(request: Request, res: Response) {
        return Unit
    }

    private val gson = Gson()
}