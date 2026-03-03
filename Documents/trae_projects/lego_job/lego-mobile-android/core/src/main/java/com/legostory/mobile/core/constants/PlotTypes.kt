package com.legostory.mobile.core.constants

data class PlotType(
    val id: String,
    val name: String,
    val icon: String,
    val description: String
)

object PlotTypes {
    val All = listOf(
        PlotType("adventure", "冒险之旅", "🗺️", "踏上未知旅程，探索神秘世界"),
        PlotType("mystery", "神秘谜团", "🔍", "发现并解开隐藏的谜题"),
        PlotType("friendship", "友谊考验", "🤝", "朋友间的互助与成长"),
        PlotType("hero", "英雄救美", "🦸", "拯救被困之人"),
        PlotType("treasure", "寻宝探险", "💎", "寻找珍贵宝藏"),
        PlotType("magic", "魔法奇遇", "✨", "遇到神奇魔法")
    )
    
    fun getById(id: String): PlotType? = All.find { it.id == id }
}
