package com.legostory.mobile.core.constants

data class RoleType(
    val value: String,
    val label: String
)

object RoleTypes {
    val All = listOf(
        RoleType("protagonist", "⭐ 主角"),
        RoleType("supporting", "🎭 配角"),
        RoleType("antagonist", "👿 反派"),
        RoleType("bystander", "🚶 路人")
    )
    
    fun getByValue(value: String): RoleType? = All.find { it.value == value }
    
    fun getLabel(value: String): String = getByValue(value)?.label ?: value
}
