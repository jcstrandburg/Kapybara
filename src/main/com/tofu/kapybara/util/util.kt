package com.tofu.kapybara.util

import java.net.URLDecoder
import java.security.InvalidParameterException
import java.util.*
import kotlin.reflect.KClass
import kotlin.reflect.full.declaredMemberProperties

inline fun dbFields(dbClass: KClass<*>): String {
    return dbClass.declaredMemberProperties.map{it.name}.joinToString(",")
}

fun dbFields(dbClass: KClass<*>, name: String): String {
    return dbClass.declaredMemberProperties.map{"$name.${it.name}"}.joinToString(",")
}

fun splitQuery(query: String): Map<String, String> {
    val query_pairs = LinkedHashMap<String, String>()
    val pairs = query.split("&".toRegex()).dropLastWhile({ it.isEmpty() }).toTypedArray()
    for (pair in pairs) {
        val idx = pair.indexOf("=")

        if (idx == -1)
            throw InvalidParameterException("Malformed query string segment \"$pair\"")

        query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"))
    }
    return query_pairs
}
