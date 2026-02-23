-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  avatar TEXT,
  parent_id TEXT,
  daily_time_limit INTEGER DEFAULT 120,
  time_used_today INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建人仔表
CREATE TABLE IF NOT EXISTS characters (
  character_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_base64 TEXT,
  description TEXT,
  personality TEXT,
  speaking_style TEXT,
  creator_id TEXT DEFAULT 'system',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建书籍表
CREATE TABLE IF NOT EXISTS books (
  book_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  chapter_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 创建章节表
CREATE TABLE IF NOT EXISTS chapters (
  chapter_id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  has_puzzle INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- 创建书籍角色关联表
CREATE TABLE IF NOT EXISTS book_characters (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  custom_name TEXT NOT NULL,
  role_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (character_id) REFERENCES characters(character_id)
);

-- 创建谜题表
CREATE TABLE IF NOT EXISTS puzzles (
  puzzle_id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  answer TEXT NOT NULL,
  hint TEXT,
  puzzle_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(chapter_id)
);

-- 创建答题记录表
CREATE TABLE IF NOT EXISTS puzzle_records (
  record_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  puzzle_id TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  attempts INTEGER DEFAULT 1,
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (puzzle_id) REFERENCES puzzles(puzzle_id)
);

-- 创建分享表
CREATE TABLE IF NOT EXISTS shares (
  share_id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  share_code TEXT UNIQUE NOT NULL,
  password TEXT,
  is_public INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_book_characters_book_id ON book_characters(book_id);
CREATE INDEX IF NOT EXISTS idx_puzzles_chapter_id ON puzzles(chapter_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_records_user_id ON puzzle_records(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_book_id ON shares(book_id);
CREATE INDEX IF NOT EXISTS idx_shares_share_code ON shares(share_code);
