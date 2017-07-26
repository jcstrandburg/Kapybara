package com.tofu.kapybara

import com.tofu.kapybara.util.dbFields
import com.tofu.kapybara.util.splitQuery
import junit.framework.TestCase

private class DbFieldsTestClass(val x: Int, val y: String, val z: Float)

class UtilTest : TestCase() {

    fun testDbFields() {
        assertEquals("x,y,z", dbFields(DbFieldsTestClass::class))
    }

    fun testDbFieldsWithName() {
        assertEquals("a.x,a.y,a.z", dbFields(DbFieldsTestClass::class, "a"))
    }

    fun testSplitQuery() {
        val query = "username=jim&password=p4ssw0rd"
        val params = splitQuery(query)

        assertEquals("jim", params["username"])
        assertEquals("p4ssw0rd", params["password"])
    }
}
