package com.legostory.mobile.core.constants

object CharacterEmojis {
    val Emojis = listOf(
        "🦸", "🧙", "🧝", "🦹", "👸", "🤴", "🧛", "🧟", "🤖", "👻", "🧚", "🧜"
    )
    
    fun get(index: Int): String = Emojis.getOrElse(index % Emojis.size) { Emojis[0] }
}
