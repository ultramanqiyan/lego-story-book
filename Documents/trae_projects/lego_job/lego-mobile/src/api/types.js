/**
 * API 接口类型定义文件 - 单一数据源
 * 
 * 此文件定义了前端 API 层与后端接口的契约
 * 所有 API 文件应遵循此文件中定义的类型
 * 
 * 最后更新: 2026-02-26
 */

// ============================================
// 用户模块 (Users)
// ============================================

/**
 * @typedef {Object} UserCreateParams
 * @property {string} username - 用户名（必填，最大20字符）
 * @property {string} [email] - 邮箱（可选）
 * @property {string} [parentId] - 家长ID（可选）
 */
export const UserCreateParams = {};

/**
 * @typedef {Object} UserCreateResult
 * @property {string} userId - 用户ID
 * @property {string} message - 提示信息
 * @property {boolean} isNewUser - 是否新用户
 */
export const UserCreateResult = {};

/**
 * @typedef {Object} UserUpdateParams
 * @property {string} userId - 用户ID（必填）
 * @property {string} [username] - 用户名
 * @property {string} [email] - 邮箱
 * @property {string} [avatar] - 头像
 * @property {number} [dailyTimeLimit] - 每日时间限制（分钟）
 */
export const UserUpdateParams = {};

/**
 * @typedef {Object} User
 * @property {string} user_id - 用户ID
 * @property {string} username - 用户名
 * @property {string} [email] - 邮箱
 * @property {string} [avatar] - 头像
 * @property {number} daily_time_limit - 每日时间限制
 * @property {number} time_used_today - 今日已用时间
 * @property {string} created_at - 创建时间
 */
export const User = {};

// ============================================
// 人仔模块 (Characters)
// ============================================

/**
 * @typedef {Object} CharacterCreateParams
 * @property {string} name - 名称（必填，最大20字符）
 * @property {string} [imageBase64] - 图片Base64
 * @property {string} [description] - 描述
 * @property {string} [personality] - 性格
 * @property {string} [speakingStyle] - 说话方式
 * @property {string} [creatorId] - 创建者ID，默认'user'
 */
export const CharacterCreateParams = {};

/**
 * @typedef {Object} CharacterUpdateParams
 * @property {string} characterId - 人仔ID（必填）
 * @property {string} [name] - 名称
 * @property {string} [imageBase64] - 图片Base64
 * @property {string} [description] - 描述
 * @property {string} [personality] - 性格
 * @property {string} [speakingStyle] - 说话方式
 */
export const CharacterUpdateParams = {};

/**
 * @typedef {Object} Character
 * @property {string} character_id - 人仔ID
 * @property {string} name - 名称
 * @property {string} [image_base64] - 图片
 * @property {string} [description] - 描述
 * @property {string} [personality] - 性格
 * @property {string} [speaking_style] - 说话方式
 * @property {string} creator_id - 创建者ID
 */
export const Character = {};

// ============================================
// 书籍模块 (Books)
// ============================================

/**
 * @typedef {Object} BookCreateParams
 * @property {string} userId - 用户ID（必填）
 * @property {string} title - 标题（必填，最大50字符）
 */
export const BookCreateParams = {};

/**
 * @typedef {Object} BookUpdateParams
 * @property {string} bookId - 书籍ID（必填）
 * @property {string} [title] - 标题
 * @property {string} [status] - 状态
 */
export const BookUpdateParams = {};

/**
 * @typedef {Object} Book
 * @property {string} book_id - 书籍ID
 * @property {string} user_id - 用户ID
 * @property {string} title - 标题
 * @property {number} chapter_count - 章节数
 * @property {string} status - 状态
 * @property {Object} [plotSelection] - 情节选择
 */
export const Book = {};

// ============================================
// 书籍角色模块 (Book Characters)
// ============================================

/**
 * @typedef {Object} BookCharacterAddParams
 * @property {string} bookId - 书籍ID（必填）
 * @property {string} characterId - 人仔ID（必填）
 * @property {string} customName - 自定义名称（必填，最大20字符）
 * @property {string} [roleType] - 角色类型：protagonist/antagonist/supporting/extra
 */
export const BookCharacterAddParams = {};

/**
 * @typedef {Object} BookCharacterUpdateParams
 * @property {string} id - 记录ID（必填）
 * @property {string} [customName] - 自定义名称
 * @property {string} [roleType] - 角色类型
 */
export const BookCharacterUpdateParams = {};

/**
 * @typedef {Object} BookCharacter
 * @property {string} id - 记录ID
 * @property {string} book_id - 书籍ID
 * @property {string} character_id - 人仔ID
 * @property {string} custom_name - 自定义名称
 * @property {string} role_type - 角色类型
 * @property {string} [original_name] - 原始名称
 */
export const BookCharacter = {};

// ============================================
// 章节模块 (Chapters)
// ============================================

/**
 * @typedef {Object} ChapterCreateParams
 * @property {string} bookId - 书籍ID（必填）
 * @property {string} [title] - 标题
 * @property {string} content - 内容（必填）
 * @property {Object} [puzzle] - 谜题数据
 */
export const ChapterCreateParams = {};

/**
 * @typedef {Object} ChapterGenerateParams
 * @property {string} bookId - 书籍ID（URL路径）
 * @property {string} userId - 用户ID（必填）
 * @property {Object} [plotSelection] - 情节选择
 * @property {string[]} [characterIds] - 角色ID列表
 */
export const ChapterGenerateParams = {};

/**
 * @typedef {Object} Chapter
 * @property {string} chapter_id - 章节ID
 * @property {string} book_id - 书籍ID
 * @property {number} chapter_number - 章节序号
 * @property {string} title - 标题
 * @property {string} content - 内容
 * @property {boolean} has_puzzle - 是否有谜题
 * @property {Object} [puzzle] - 谜题数据
 * @property {number} [puzzle_result] - 谜题结果
 */
export const Chapter = {};

// ============================================
// 故事生成模块 (Story)
// ============================================

/**
 * @typedef {Object} StoryGenerateParams
 * @property {CharacterData[]} characters - 角色列表（必填）
 * @property {string} plot - 情节类型（必填）
 * @property {CharacterData[]} [chapterCharacters] - 本章角色
 * @property {string} [previousSummary] - 前情提要
 * @property {PuzzleData} [previousPuzzle] - 上一章谜题
 * @property {PlotSelection} [plotSelection] - 情节选择
 * @property {boolean} [forcePuzzle] - 是否强制生成谜题
 */
export const StoryGenerateParams = {};

/**
 * @typedef {Object} CharacterData
 * @property {string} character_id - 角色ID
 * @property {string} custom_name - 自定义名称
 * @property {string} [personality] - 性格
 * @property {string} [speaking_style] - 说话方式
 */
export const CharacterData = {};

/**
 * @typedef {Object} PuzzleData
 * @property {string} question - 谜题问题
 * @property {string} answer - 正确答案
 * @property {boolean} isCorrect - 是否答对
 */
export const PuzzleData = {};

/**
 * @typedef {Object} PlotSelection
 * @property {string} weather - 天气
 * @property {string} adventureType - 冒险类型
 * @property {string} terrain - 地形
 * @property {string} equipment - 装备
 */
export const PlotSelection = {};

// ============================================
// 谜题模块 (Puzzle)
// ============================================

/**
 * @typedef {Object} PuzzleSubmitParams
 * @property {string} puzzleId - 谜题ID（必填）
 * @property {string} userId - 用户ID（必填）
 * @property {string} userAnswer - 用户答案（必填）
 */
export const PuzzleSubmitParams = {};

/**
 * @typedef {Object} PuzzleSubmitResult
 * @property {boolean} isCorrect - 是否正确
 * @property {number} attempts - 尝试次数
 * @property {number} attemptsRemaining - 剩余尝试次数
 * @property {string} [hint] - 提示（尝试2次后显示）
 * @property {string} message - 提示信息
 */
export const PuzzleSubmitResult = {};

/**
 * @typedef {Object} Puzzle
 * @property {string} puzzle_id - 谜题ID
 * @property {string} chapter_id - 章节ID
 * @property {string} question - 问题
 * @property {string[]} options - 选项
 * @property {string} answer - 答案
 * @property {string} [hint] - 提示
 * @property {string} puzzle_type - 谜题类型
 */
export const Puzzle = {};

// ============================================
// 分享模块 (Share)
// ============================================

/**
 * @typedef {Object} ShareCreateParams
 * @property {string} bookId - 书籍ID（必填）
 * @property {string} userId - 用户ID（必填）
 * @property {string} [password] - 密码
 * @property {boolean} [isPublic] - 是否公开
 */
export const ShareCreateParams = {};

/**
 * @typedef {Object} ShareCreateResult
 * @property {string} shareId - 分享ID
 * @property {string} shareCode - 分享码
 * @property {string} message - 提示信息
 */
export const ShareCreateResult = {};

/**
 * @typedef {Object} Share
 * @property {string} share_id - 分享ID
 * @property {string} book_id - 书籍ID
 * @property {string} user_id - 用户ID
 * @property {string} share_code - 分享码
 * @property {string} [password] - 密码
 * @property {boolean} is_public - 是否公开
 */
export const Share = {};

// ============================================
// API 方法签名定义
// ============================================

/**
 * usersAPI 方法签名
 * - createOrLogin(username: string, email?: string): Promise<{userId, message, isNewUser}>
 * - getUser(userId: string): Promise<{user}>
 * - updateUser(userId: string, data: UserUpdateParams): Promise<{message}>
 */

/**
 * charactersAPI 方法签名
 * - getList(userId?: string): Promise<{characters}>
 * - create(data: CharacterCreateParams): Promise<{characterId, message}>
 * - update(characterId: string, data: CharacterUpdateParams): Promise<{message}>
 * - delete(characterId: string, force?: boolean): Promise<{message}>
 */

/**
 * booksAPI 方法签名
 * - getList(userId: string): Promise<{books}>
 * - getDetail(bookId: string, userId?: string): Promise<{book, chapters, characters}>
 * - create(userId: string, title: string): Promise<{bookId, message}>
 * - update(bookId: string, data: BookUpdateParams): Promise<{message}>
 * - delete(bookId: string): Promise<{message}>
 */

/**
 * bookCharactersAPI 方法签名
 * - getList(bookId: string): Promise<{characters}>
 * - add(bookId: string, characterId: string, customName: string, roleType?: string): Promise<{message, id}>
 * - update(id: string, data: {custom_name?, role_type?}): Promise<{message}>
 * - delete(id: string, force?: boolean): Promise<{message}>
 */

/**
 * chaptersAPI 方法签名
 * - getDetail(chapterId: string, userId?: string): Promise<{chapter, puzzle, puzzleRecord}>
 * - getListByBook(bookId: string, userId?: string): Promise<{chapters}>
 * - create(bookId: string, title: string, content: string, puzzle?: object): Promise<{chapterId, chapterNumber, message}>
 * - delete(chapterId: string): Promise<{message}>
 * - complete(bookId: string, chapterId: string, userId: string): Promise<{message}>
 * - generate(bookId: string, userId: string, plotSelection?: object, characterIds?: string[]): Promise<{chapterId, chapterNumber, title, hasPuzzle, prompt, message}>
 */

/**
 * storyAPI 方法签名
 * - generate(params: StoryGenerateParams): Promise<{title, content, puzzle, prompt}>
 */

/**
 * puzzleAPI 方法签名
 * - getById(puzzleId: string): Promise<{puzzle}>
 * - getByChapter(chapterId: string): Promise<{puzzle}>
 * - submit(puzzleId: string, userId: string, userAnswer: string): Promise<PuzzleSubmitResult>
 */

/**
 * shareAPI 方法签名
 * - create(bookId: string, userId: string, options?: {password?, isPublic?}): Promise<ShareCreateResult>
 * - getByBook(bookId: string, userId: string): Promise<{shares}>
 * - getByCode(code: string): Promise<{share}>
 * - delete(shareId: string): Promise<{message}>
 */

/**
 * plotOptionsAPI 方法签名
 * - get(): Promise<{plotOptions}>
 */
