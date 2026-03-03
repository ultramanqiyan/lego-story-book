package com.legostory.mobile.core.constants

object Colors {
    val LegoRed = 0xFFE3000B
    val LegoBlue = 0xFF006BA6
    val LegoYellow = 0xFFFFD100
    val LegoGreen = 0xFF00A651
    val LegoOrange = 0xFFFF6B00
    val LegoPurple = 0xFF8B5CF6
    
    val Background = 0xFFFFF8E7
    val BackgroundLight = 0xFFFFFEF5
    val BackgroundDark = 0xFFF5E6C8
    
    val Text = 0xFF333333
    val TextLight = 0xFF666666
    val TextMuted = 0xFF999999
    
    val White = 0xFFFFFFFF
    val Black = 0xFF000000
    
    val Border = 0xFFE0E0E0
    val BorderLight = 0xFFF0F0F0
    
    val Error = 0xFFE74C3C
    val ErrorLight = 0xFFFDEAEA
    val Success = 0xFF27AE60
    val SuccessLight = 0xFFE8F5E9
    val Warning = 0xFFF39C12
    val WarningLight = 0xFFFFF8E1
    val Info = 0xFF3498DB
    val InfoLight = 0xFFE3F2FD
    
    val Overlay = 0x80000000
    val Shadow = 0x1A000000
}

data class Color(val value: Long) {
    constructor(red: Int, green: Int, blue: Int, alpha: Int = 0xFF) : this(
        ((alpha.toLong() and 0xFF) shl 24) or
        ((red.toLong() and 0xFF) shl 16) or
        ((green.toLong() and 0xFF) shl 8) or
        (blue.toLong() and 0xFF)
    )
    
    constructor(hex: String) : this(
        hex.removePrefix("#").let { 
            if (it.length == 6) {
                "FF$it".toLong(16)
            } else {
                it.toLong(16)
            }
        }
    )
    
    companion object {
        operator fun invoke(value: Long) = Color(value)
    }
}
