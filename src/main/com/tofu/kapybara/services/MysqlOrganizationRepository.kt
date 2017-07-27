package com.tofu.kapybara.services

import com.tofu.kapybara.data.IOrganizationRepository
import com.tofu.kapybara.data.models.Organization
import com.tofu.kapybara.data.models.OrganizationCreate
import com.tofu.kapybara.services.database.DbOrganization
import com.tofu.kapybara.util.dbFields
import org.sql2o.Sql2o
import java.math.BigInteger

private fun DbOrganization.toOrganization(): Organization {
    return Organization(this.id, this.name, this.token)
}

class MysqlOrganizationRepository(private val sql2o: Sql2o) : IOrganizationRepository {

    override fun getOrganization(id: Int): Organization? {
        val sql = "SELECT ${dbFields(DbOrganization::class)} FROM Organizations WHERE id=:id"

        return sql2o.open().createQuery(sql).use { query ->
            query.addParameter("id", id)
                .executeAndFetch(DbOrganization::class.java)
                .singleOrNull()
                ?.toOrganization()
        }
    }

    override fun getOrganization(token: String): Organization? {
        val sql = "SELECT ${dbFields(DbOrganization::class)} FROM Organizations WHERE token=:token"

        return sql2o.open().createQuery(sql).use { query ->
            query.addParameter("token", token)
                .executeAndFetch(DbOrganization::class.java)
                .singleOrNull()
                ?.toOrganization()
        }
    }

    override fun createOrganization(org: OrganizationCreate): Organization {
        val sql = """
INSERT INTO `Organizations`
(name, token)
VALUES
(:name, :token)
"""

        val id = sql2o.open().createQuery(sql).use { query ->
            query.addParameter("name", org.name)
                .addParameter("token", org.token)
                .executeUpdate()
                .key as BigInteger
        }

        return getOrganization(id.toInt())!!
    }

    override fun getOrganizationsForUser(userId: Int): List<Organization> {
        val sql = """
SELECT
    ${dbFields(DbOrganization::class, "o")}
FROM
    Organizations o JOIN OrganizationRelationships r
ON
    o.id = r.organizationId
WHERE
    r.userId=:userId
"""

        val dbOrganizations =  sql2o.open().createQuery(sql).use { query ->
            query.addParameter("userId", userId).executeAndFetch(DbOrganization::class.java)
        }

        return dbOrganizations.map {it.toOrganization()}
    }
}