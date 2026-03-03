package com.legostory.mobile.core.constants

object RoleColors {
    val Protagonist = RoleColor(
        background = 0xFFFFF3E0,
        text = 0xFFE65100
    )
    val Supporting = RoleColor(
        background = 0xFFE3F2FD,
        text = 0xFF1565C0
    )
    val Antagonist = RoleColor(
        background = 0xFFFFEBEE,
        text = 0xFFC62828
    )
    val Bystander = RoleColor(
        background = 0xFFF3E5F5,
        text = 0xFF7B1FA2
    )
}

data class RoleColor(
    val background: Long,
    val text: Long
)
