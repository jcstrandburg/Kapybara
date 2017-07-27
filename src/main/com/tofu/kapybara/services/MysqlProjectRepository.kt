package com.tofu.kapybara.services

import com.tofu.kapybara.data.IProjectRepository
import com.tofu.kapybara.data.models.Project
import com.tofu.kapybara.data.models.ProjectCreate
import com.tofu.kapybara.services.database.DbProject
import com.tofu.kapybara.util.dbFields
import org.sql2o.Sql2o
import java.math.BigInteger

private fun DbProject.map(): Project {
    return Project(this.id, this.name, this.organizationId)
}

class MysqlProjectRepository(val sql2o: Sql2o): IProjectRepository {
    override fun getProject(projectId: Int): Project? {
        val sql = "SELECT ${dbFields(DbProject::class)} FROM `Projects` WHERE id=:projectId"

        return sql2o.open().createQuery(sql).use {query ->
            query
                .addParameter("projectId", projectId)
                .executeAndFetch(DbProject::class.java)
                .singleOrNull()
                ?.map()
        }
    }

    override fun createProject(project: ProjectCreate): Project {
        val sql = """
INSERT INTO `Projects`
    (name, organizationId)
VALUES
    (:name, :organizationId)
"""

        val id = sql2o.open().createQuery(sql).use {query ->
            query
                .addParameter("name", project.name)
                .addParameter("organizationId", project.organizationId)
                .executeUpdate()
                .key as BigInteger
        }

        return getProject(id.toInt())!!
    }
}