-- 添加情节选择字段到书籍表
-- 用于存储用户选择的情节设定（天气、冒险类型、地形、装备）

ALTER TABLE books ADD COLUMN plot_selection TEXT;

-- plot_selection 字段存储格式：
-- JSON字符串，包含以下字段：
-- {
--   "weather": "sunny",        // 天气选项ID
--   "adventureType": "adventure", // 冒险类型ID
--   "terrain": "forest",       // 地形ID
--   "equipment": "wand"        // 装备ID
-- }
--
-- 可选值参考：
-- 天气: sunny, rainy, thunder, snow, fog, wind, rainbow, starry
-- 冒险类型: friendship, adventure, wisdom, courage, treasure, rescue, mystery, competition
-- 地形: forest, castle, ocean, desert, mountain, glacier, volcano, city
-- 装备: wand, shield, map, telescope, sword, potion, flyer, cloak
