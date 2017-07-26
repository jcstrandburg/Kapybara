package com.tofu.kapybara.services

import java.io.FileInputStream
import java.util.*

class Config(props: Properties) {
    val databaseConnectionString = props.getProperty("database.connectionString")!!
    val databaseUser = props.getProperty("database.user")!!
    val databasePassword = props.getProperty("database.password")!!
    val staticFileLocation = props.getProperty("content.staticLocation")!!
}

fun getConfig(filename: String = "config.properties"): Config {
    return FileInputStream(filename).use { stream ->
        val props = Properties()
        props.load(stream)
        Config(props)
    }
}
