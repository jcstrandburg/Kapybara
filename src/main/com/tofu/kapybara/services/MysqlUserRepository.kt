package com.tofu.kapybara.services

import com.tofu.kapybara.data.IUserRepository
import com.tofu.kapybara.data.models.User
import com.tofu.kapybara.services.database.DbUser
import com.tofu.kapybara.util.dbFields
import org.sql2o.Sql2o
import java.math.BigInteger

private fun DbUser.toUser(): User {
    return User(this.id, this.username, this.password, this.authToken ?: "", this.alias)
}

class MysqlUserRepository(val sql2o: Sql2o): IUserRepository {

    override fun createUser(user: User): User {
        val sql = """
INSERT INTO `Users`
(username, password, alias)
VALUES
(:username,:password, :alias)
"""
        val userId = sql2o.open().createQuery(sql).use {query ->
            query.addParameter("username", user.name)
                .addParameter("password", user.password)
                .addParameter("alias", user.alias)
                .executeUpdate()
                .key as BigInteger
        }

        return getUser(userId.toInt())!!
    }

    override fun getUser(name: String): User? {
        val sql = "SELECT ${dbFields(DbUser::class)} FROM `Users` WHERE `username`=:name LIMIT 1"

        val dbUser = sql2o.open().createQuery(sql).use {query->
            query.addParameter("name", name)
                .executeAndFetch(DbUser::class.java)
                .singleOrNull()
        }

        return dbUser?.toUser()
    }

    override fun getUser(id: Int): User? {
        val sql = "SELECT ${dbFields(DbUser::class)} FROM `Users` WHERE `id`=:id LIMIT 1"
        val dbUser = sql2o.open().createQuery(sql).use {query ->
            query.addParameter("id", id)
                .executeAndFetch(DbUser::class.java)
                .singleOrNull()
        }

        return dbUser?.toUser()
    }

    override fun setUserAuthToken(id: Int, token: String): User {
        val sql = "UPDATE `Users` SET authToken=:authToken WHERE id=:id"
        sql2o.open().createQuery(sql).use { query ->
            query.addParameter("id", id)
                .addParameter("authToken", token)
                .executeUpdate()
        }

        val user = getUser(id) ?: throw NoSuchElementException()
        return user
    }

    override fun updateUser(user: User): User? {
        val sql = """
UPDATE `Users` SET
username=:username,
password=:password,
authtoken=:authtoken
WHERE
id=:user.Id
"""

        sql2o.open().createQuery(sql).use {query ->
            query.addParameter("username", user.name)
                .addParameter("password", user.password)
                .executeUpdate()
        }

        return getUser(user.id)
    }

    override fun addUserToOrganization(userId: Int, organizationId: Int) {
        val sql = """
INSERT INTO `OrganizationRelationships`
(UserId, OrganizationId)
VALUES
(:userId, :organizationId)
"""

        sql2o.open().createQuery(sql).use { query ->
            query
                .addParameter("userId", userId)
                .addParameter("organizationId", organizationId)
                .executeUpdate()
        }
    }

    override fun removeUserFromOrganization(userId: Int, organizationId: Int) {
        val sql = """
DELETE FROM `OrganizationRelationships`
WHERE UserId=:userId AND OrganizationId=:organizationId
"""

        sql2o.open().createQuery(sql).use { query ->
            query
                .addParameter("userId", userId)
                .addParameter("organizationId", organizationId)
                .executeUpdate()
        }
    }

    override fun isUserInOrganization(userId: Int, organizationId: Int): Boolean {
        val sql = """
SELECT COUNT(Id) FROM `OrganizationRelationships` WHERE UserId=:userId AND OrganizationId=:organizationId
"""

        return sql2o.open().createQuery(sql).use { query ->
            val count = query
                .addParameter("userId", userId)
                .addParameter("organizationId", organizationId)
                .executeScalar() as Long

            count > 0
        }
    }

    override fun getUsersForOrganization(organizationId: Int): List<User> {
        val sql = """
SELECT
    ${dbFields(DbUser::class, "u")}
FROM
    Users u JOIN OrganizationRelationships r
ON
    u.id = r.userId
WHERE
    r.organizationId=:organizationId
"""
        val dbUsers = sql2o.open().createQuery(sql).use { query ->
            query.addParameter("organizationId", organizationId)
                .executeAndFetch(DbUser::class.java)
        }

        return dbUsers.map {it.toUser()}
    }
}