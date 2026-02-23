-- 插入预设人仔数据
INSERT INTO characters (character_id, name, description, personality, speaking_style, creator_id) VALUES
('char_batman', '乐高蝙蝠侠', '哥谭暗夜骑士', '勇敢、正义、严肃', '低沉有力', 'system'),
('char_spiderman', '乐高蜘蛛侠', '友好邻居英雄', '活泼、幽默、善良', '轻松俏皮', 'system'),
('char_naruto', '乐高火影忍者', '忍者村忍者', '热血、坚韧、乐观', '充满干劲', 'system'),
('char_dinosaur', '乐高恐龙', '史前巨兽', '威猛、古老、神秘', '低沉咆哮', 'system'),
('char_princess', '乐高公主', '童话王国公主', '优雅、善良、勇敢', '温柔甜美', 'system'),
('char_knight', '乐高骑士', '中世纪战士', '忠诚、勇敢、正直', '庄重有力', 'system'),
('char_wizard', '乐高巫师', '魔法大师', '智慧、神秘、慈祥', '古老深奥', 'system'),
('char_astronaut', '乐高宇航员', '太空探索者', '好奇、勇敢、科学', '专业冷静', 'system'),
('char_pirate', '乐高海盗', '七海冒险家', '豪爽、自由、机智', '粗犷豪迈', 'system'),
('char_elf', '乐高精灵', '森林守护者', '敏捷、聪慧、友善', '清脆悦耳', 'system'),
('char_robot', '乐高机器人', '未来科技', '精确、理性、忠诚', '机械平稳', 'system'),
('char_superman', '乐高超人', '氪星之子', '正义、无私、强大', '坚定有力', 'system');

-- 创建情节表（用于存储预设情节）
CREATE TABLE IF NOT EXISTS plots (
  plot_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  scene_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入预设情节数据
INSERT INTO plots (plot_id, name, description, scene_type) VALUES
('plot_adventure', '冒险之旅', '主人公踏上未知旅程，探索神秘世界', '冒险故事'),
('plot_mystery', '神秘谜团', '发现并解开隐藏的谜题，揭示真相', '悬疑故事'),
('plot_friendship', '友谊考验', '朋友间的互助与成长，共同面对困难', '友情故事'),
('plot_hero', '英雄救美', '拯救被困之人，展现英雄气概', '英雄故事'),
('plot_treasure', '寻宝探险', '寻找珍贵宝藏，克服重重障碍', '冒险故事'),
('plot_magic', '魔法奇遇', '遇到神奇魔法，体验奇幻冒险', '魔法故事'),
('plot_space', '太空冒险', '星际探索之旅，发现宇宙奥秘', '科幻故事'),
('plot_competition', '竞技比赛', '参加激烈比赛，挑战自我极限', '竞技故事');
