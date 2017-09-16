package com.tofu.kapybara.services

import org.sql2o.Sql2o
import java.math.BigInteger

class MysqlDiscussionContextService(val sql2o: Sql2o) {
    fun createContext(): Int {
        val sql = "INSERT INTO `DiscussionContexts` VALUES ()"

        val contextId = sql2o.open().createQuery(sql).use { query ->
            query.executeUpdate().key as BigInteger
        }

        return contextId.toInt()
    }
}