package com.tofu.kapybara.services

import com.tofu.kapybara.data.IProjectRepository
import com.tofu.kapybara.data.models.DiscussionMessage
import com.tofu.kapybara.data.models.DiscussionMessageCreate
import com.tofu.kapybara.data.models.Project
import com.tofu.kapybara.data.models.ProjectCreate
import com.tofu.kapybara.services.database.DbDiscussionMessage
import com.tofu.kapybara.services.database.DbProject
import com.tofu.kapybara.util.dbFields
import org.sql2o.Sql2o
import sun.plugin.dom.exception.InvalidStateException
import java.math.BigInteger
import java.time.OffsetDateTime

class MysqlProjectRepository(
    val sql2o: Sql2o,
    val discussionContextService: MysqlDiscussionContextService
): IProjectRepository {

    override fun getProject(projectId: Int): Project? {
        return getProjectCore(projectId)?.map()
    }

    override fun createProject(project: ProjectCreate): Project {
        val sql = """
INSERT INTO `Projects`
    (name, organizationId, discussionContextId, parentProjectId)
VALUES
    (:name, :organizationId, :discussionContextId, :parentProjectId)
"""
        val discussionContextId = discussionContextService.createContext()
        val id = sql2o.open().createQuery(sql).use {query ->
            query
                .addParameter("name", project.name)
                .addParameter("organizationId", project.organizationId)
                .addParameter("discussionContextId", discussionContextId)
                .addParameter("parentProjectId", project.parentProjectId)
                .executeUpdate()
                .key as BigInteger
        }

        return getProject(id.toInt())!!
    }

    override fun getProjectsForOrganization(organizationId: Int, parentProjectId: Int?): List<Project> {
        val sql = """
SELECT ${dbFields(Project::class)}
FROM `Projects`
WHERE
    organizationId=:organizationId
    AND ${if (parentProjectId == null) "parentProjectId IS NULL" else "parentProjectId=:parentProjectId"}
"""

        val dbProjects = sql2o.open().createQuery(sql).use {query ->
            if (parentProjectId == null) {
                query
                    .addParameter("organizationId", organizationId)
            }
            else  {
                query
                    .addParameter("organizationId", organizationId)
                    .addParameter("parentProjectId", parentProjectId)
            }
            .executeAndFetch(DbProject::class.java)
        }

        return dbProjects.map { it -> it.map() }
    }

    override fun addDiscussionMessage(projectId: Int, message: DiscussionMessageCreate): DiscussionMessage {
        val project = getProjectCore(projectId) ?: throw InvalidStateException("Project $projectId does not exist")
        val sql = """
INSERT INTO `DiscussionMessages`
    (discussionContextId, userId, content, createdTime)
VALUES
    (:discussionContextId, :userId, :content, :createdTime)
"""
        val id = sql2o.open().createQuery(sql).use {query ->
            query
                .addParameter("discussionContextId", project.discussionContextId)
                .addParameter("userId", message.userId)
                .addParameter("content", message.content)
                .addParameter("createdTime", OffsetDateTime.now().toLocalDateTime())
                .executeUpdate()
                .key as BigInteger
        }
        return getDiscussionMessageCore(id.toInt()).map()
    }

    override fun getDiscussionMessages(projectId: Int): List<DiscussionMessage> {
        val sql = """
SELECT ${dbFields(DbDiscussionMessage::class, "dm")}
FROM
`Projects` p JOIN `DiscussionMessages` dm ON p.discussionContextId=dm.discussionContextId
WHERE p.id=:projectId
ORDER BY dm.id ASC
"""
        val messages = sql2o.open().createQuery(sql).use {query ->
            query
                .addParameter("projectId", projectId)
                .executeAndFetch(DbDiscussionMessage::class.java)
        }
        return messages.map { it.map() }
    }

    private fun getProjectCore(projectId: Int): DbProject? {
        val sql = "SELECT ${dbFields(DbProject::class)} FROM `Projects` WHERE id=:projectId"

        return sql2o.open().createQuery(sql).use {query ->
            query
                .addParameter("projectId", projectId)
                .executeAndFetch(DbProject::class.java)
                .singleOrNull()
        }
    }

    private fun getDiscussionMessageCore(discussionMessageId: Int): DbDiscussionMessage {
        val sql = """
SELECT ${dbFields(DbDiscussionMessage::class)}
FROM `DiscussionMessages`
WHERE id=:discussionMessageId
"""
        return sql2o.open().createQuery(sql).use {query ->
            query.addParameter("discussionMessageId", discussionMessageId)
                .executeAndFetch(DbDiscussionMessage::class.java)
                .single()
        }
    }

    companion object {
        private fun DbProject.map(): Project {
            return Project(this.id, this.name, this.organizationId, this.parentProjectId)
        }

        private fun DbDiscussionMessage.map(): DiscussionMessage {
            return DiscussionMessage(
                id=this.id,
                userId=this.userId,
                content=this.content,
                createdTime=this.createdTime)
        }
    }
}