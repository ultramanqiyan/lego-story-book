# LEGO Mobile 接口文档

## 一、API 服务接口

### 1.1 APIClient

基础HTTP客户端类，所有API服务的基础。

```typescript
class APIClient {
    baseURL: string
    
    // 通用请求方法
    request(endpoint: string, options?: RequestOptions): Promise<T>
    
    // GET请求
    get<T>(endpoint: string, options?: RequestOptions): Promise<T>
    
    // POST请求
    post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T>
    
    // PUT请求
    put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T>
    
    // DELETE请求
    delete<T>(endpoint: string, options?: RequestOptions): Promise<T>
}
```

### 1.2 UsersAPI

用户相关API。

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `createOrLogin` | `username: string, email?: string` | `Promise<{userId: string, message: string, isNewUser: boolean}>` | 创建或登录用户 |
| `getUser` | `userId: string` | `Promise<{user: User}>` | 获取用户信息 |
| `updateUser` | `userId: string, data: Partial<User>` | `Promise<{message: string}>` | 更新用户信息 |

### 1.3 CharactersAPI

角色/人仔相关API。

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getList` | `userId?: string` | `Promise<{characters: Character[]}>` | 获取人仔列表 |
| `create` | `data: CreateCharacterData` | `Promise<{characterId: string, message: string}>` | 创建人仔 |
| `update` | `characterId: string, data: Partial<Character>` | `Promise<{message: string}>` | 更新人仔 |
| `delete` | `characterId: string, force?: boolean` | `Promise<{message: string} \| {needsConfirm: boolean, message: string, usageCount: number}>` | 删除人仔 |

**CreateCharacterData 接口:**
```typescript
interface CreateCharacterData {
    userId: string
    name: string
    emoji: string
    personality: string
    speakingStyle: string
    description?: string
}
```

### 1.4 BooksAPI

书籍相关API。

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getList` | `userId: string` | `Promise<{books: Book[]}>` | 获取书籍列表 |
| `getDetail` | `bookId: string, userId?: string` | `Promise<{book: Book, chapters: Chapter[], characters: BookCharacter[]}>` | 获取书籍详情 |
| `create` | `userId: string, title: string` | `Promise<{bookId: string, message: string}>` | 创建书籍 |
| `update` | `bookId: string, data: Partial<Book>` | `Promise<{message: string}>` | 更新书籍 |
| `delete` | `bookId: string` | `Promise<{message: string}>` | 删除书籍 |

### 1.5 BookCharactersAPI

书籍角色关联API。

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getList` | `bookId: string` | `Promise<{characters: BookCharacter[]}>` | 获取书籍角色列表 |
| `add` | `bookId: string, characterId: string, customName?: string, roleType?: string` | `Promise<{message: string, id: string}>` | 添加角色到书籍 |
| `update` | `id: string, data: Partial<BookCharacter>` | `Promise<{message: string}>` | 更新书籍角色 |
| `delete` | `id: string, force?: boolean` | `Promise<{message: string}>` | 从书籍移除角色 |

### 1.6 ChaptersAPI

章节相关API。

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getDetail` | `chapterId: string, userId?: string` | `Promise<{chapter: Chapter, puzzle?: Puzzle, puzzleRecord?: PuzzleRecord}>` | 获取章节详情 |
| `getListByBook` | `bookId: string, userId?: string` | `Promise<{chapters: Chapter[]}>` | 获取书籍的章节列表 |
| `create` | `bookId: string, title: string, content: string, puzzle?: PuzzleData` | `Promise<{chapterId: string, chapterNumber: number, message: string}>` | 创建章节 |
| `delete` | `chapterId: string` | `Promise<{message: string}>` | 删除章节 |
| `complete` | `bookId: string, chapterId: string, userId: string` | `Promise<{message: string}>` | 标记章节完成 |
| `generate` | `bookId: string, userId: string, plotSelection?: PlotSelection, characterIds?: string[]` | `Promise<{chapterId: string, chapterNumber: number, title: string, hasPuzzle: boolean, prompt: string, message: string}>` | 生成新章节 |

**PlotSelection 接口:**
```typescript
interface PlotSelection {
    weather?: string
    adventureType?: string
    terrain?: string
    equipment?: string[]
}
```

### 1.7 PuzzleAPI

谜题相关API。

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getById` | `puzzleId: string` | `Promise<{puzzle: Puzzle}>` | 通过ID获取谜题 |
| `getByChapter` | `chapterId: string` | `Promise<{puzzle: Puzzle}>` | 通过章节ID获取谜题 |
| `submit` | `puzzleId: string, userId: string, userAnswer: string` | `Promise<{isCorrect: boolean, attempts: number, attemptsRemaining: number, hint?: string, message: string}>` | 提交谜题答案 |

### 1.8 PlotOptionsAPI

情节选项API。

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `get` | - | `Promise<{plotOptions: PlotOption}>` | 获取情节选项 |

### 1.9 ShareAPI

分享相关API。

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `create` | `bookId: string, userId: string, options?: ShareOptions` | `Promise<{shareId: string, shareCode: string, message: string}>` | 创建分享 |
| `getByBook` | `bookId: string, userId: string` | `Promise<{shares: Share[]}>` | 通过书籍ID获取分享信息 |
| `getByCode` | `code: string` | `Promise<{share: Share}>` | 通过分享码获取分享信息 |
| `delete` | `shareId: string` | `Promise<{message: string}>` | 删除分享 |

---

## 二、Context 接口

### 2.1 AuthContext

认证上下文。

```typescript
interface AuthContextValue {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (username: string) => Promise<void>
    logout: () => void
    checkAuth: () => Promise<void>
}

// 使用方式
const { user, isLoading, isAuthenticated, login, logout } = useAuth()
```

### 2.2 ThemeContext

主题上下文。

```typescript
interface ThemeContextValue {
    themeId: string
    theme: ThemeConfig
    themes: ThemeConfig[]
    changeTheme: (themeId: string) => void
    
    card2DStyle: CardStyle
    card2DStyles: Record<string, CardStyle>
    changeCard2DStyle: (styleId: string) => void
    
    card3DStyle: CardStyle
    card3DStyles: Record<string, CardStyle>
    changeCard3DStyle: (styleId: string) => void
    
    particleEffect: ParticleEffect
    particleEffects: Record<string, ParticleEffect>
    changeParticleEffect: (effectId: string) => void
    
    weatherEffect: WeatherEffect
    weatherEffects: Record<string, WeatherEffect>
    changeWeatherEffect: (effectId: string) => void
}

// 使用方式
const { theme, changeTheme, card3DStyle } = useTheme()
```

### 2.3 ToastContext

消息提示上下文。

```typescript
interface ToastContextValue {
    toast: ToastState
    showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void
    hideToast: () => void
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
}

// 使用方式
const { showToast, success, error } = useToast()
```

---

## 三、组件接口

### 3.1 Button

通用按钮组件。

```typescript
interface ButtonProps {
    title: string
    onPress: () => void
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean
    loading?: boolean
    icon?: string
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
}
```

### 3.2 Card

通用卡片组件。

```typescript
interface CardProps {
    children: ReactNode
    title?: string
    subtitle?: string
    onPress?: () => void
    variant?: 'default' | 'elevated' | 'outlined'
    style?: StyleProp<ViewStyle>
}
```

### 3.3 Header

页面头部组件。

```typescript
interface HeaderProps {
    title?: string
    subtitle?: string
    leftButton?: ReactNode
    rightButton?: ReactNode
    transparent?: boolean
    backgroundColor?: string
}

// BackButton 子组件
Header.BackButton: FC<{ onPress: () => void }>
```

### 3.4 Modal

模态框组件。

```typescript
interface ModalProps {
    visible: boolean
    onClose: () => void
    title?: string
    children: ReactNode
    showCloseButton?: boolean
}
```

### 3.5 Loading

加载状态组件。

```typescript
interface LoadingProps {
    message?: string
    fullScreen?: boolean
}
```

### 3.6 EmptyState

空状态组件。

```typescript
interface EmptyStateProps {
    icon?: string
    title: string
    description?: string
    action?: {
        label: string
        onPress: () => void
    }
}
```

### 3.7 StepIndicator

步骤指示器组件。

```typescript
interface StepIndicatorProps {
    currentStep: number
    totalSteps: number
}
```

### 3.8 Card3D

3D翻转卡牌组件。

```typescript
interface Card3DProps {
    frontContent?: ReactNode
    backContent?: ReactNode
    icon?: string
    name?: string
    isSelected?: boolean
    onPress?: () => void
    onFlip?: (isFlipped: boolean) => void
    width?: number
    height?: number
    style?: StyleProp<ViewStyle>
    enableTilt?: boolean
    enableFlip?: boolean
    variant?: 'default' | 'glow' | 'minimal'
}
```

### 3.9 CardDeck3D

3D卡牌组组件。

```typescript
interface CardDeck3DProps {
    title?: string
    items: CardItem[]
    selectedId?: string
    onPress?: (item: CardItem) => void
    iconKey?: string
    nameKey?: string
    emoji?: string
    variant?: 'default' | 'compact'
    showTitle?: boolean
    enableFanSpread?: boolean
    stackOffset?: number
}

interface CardItem {
    id: string
    icon?: string
    name?: string
    [key: string]: any
}
```

### 3.10 KeywordHighlight

关键词高亮组件。

```typescript
interface KeywordHighlightProps {
    content: string
    characters?: Character[]
}

interface Character {
    id: string
    name: string
    customName?: string
    roleType?: string
    emoji?: string
}
```

### 3.11 WeatherEffect

天气特效组件。

```typescript
interface WeatherEffectProps {
    weather: 'sunny' | 'rainy' | 'thunder' | 'snow'
}
```

### 3.12 WeatherEffectV2

升级版天气特效组件。

```typescript
interface WeatherEffectV2Props {
    weather: string
    intensity?: 'light' | 'medium' | 'heavy'
}
```

### 3.13 MagicParticles

魔法粒子组件。

```typescript
interface MagicParticlesProps {
    count?: number
    colors?: string[]
    enabled?: boolean
    showConnections?: boolean
}
```

### 3.14 StagePreview

舞台预览组件。

```typescript
interface StagePreviewProps {
    characters?: Character[]
    weather?: string
    terrain?: string
}
```

### 3.15 CardDeck

2D卡牌组组件。

```typescript
interface CardDeckProps {
    title?: string
    items: CardItem[]
    selectedId?: string
    onSelect?: (item: CardItem) => void
    iconKey?: string
    nameKey?: string
    emoji?: string
}
```

### 3.16 CharacterForm

角色表单组件。

```typescript
interface CharacterFormProps {
    character?: Character
    onSubmit: (data: CharacterFormData) => void
    onCancel: () => void
}

interface CharacterFormData {
    name: string
    emoji: string
    personality: string
    speakingStyle: string
    description?: string
}
```

### 3.17 PromptPanel

提示面板组件。

```typescript
interface PromptPanelProps {
    prompts: Prompt[]
    title?: string
}

interface Prompt {
    id: string
    type: string
    content: string
    options?: string[]
}
```

---

## 四、Hooks 接口

### 4.1 use3DCard

3D卡牌动画Hook。

```typescript
interface Use3DCardOptions {
    onFlip?: () => void
    onTilt?: () => void
    onPress?: () => void
    enableTilt?: boolean
    enableFlip?: boolean
}

interface Use3DCardReturn {
    frontAnimatedStyle: AnimatedStyle
    backAnimatedStyle: AnimatedStyle
    shadowAnimatedStyle: AnimatedStyle
    glowAnimatedStyle: AnimatedStyle
    gesture: Gesture
    flipCard: () => void
    resetTilt: () => void
    updateLayout: (width: number, height: number) => void
    animateSelect: () => void
    flipProgress: SharedValue<number>
    isFlipped: () => boolean
}

// 使用方式
const { frontAnimatedStyle, gesture, flipCard } = use3DCard({
    enableTilt: true,
    enableFlip: true,
    onFlip: () => console.log('flipped')
})
```

### 4.2 useParticles

粒子系统Hook。

```typescript
// 魔法粒子背景
interface UseMagicParticlesOptions {
    count?: number
    colors?: string[]
}

// 爆发粒子效果
interface UseBurstParticlesOptions {
    count?: number
    colors?: string[]
    duration?: number
}

// 轨迹粒子效果
interface UseTrailParticlesOptions {
    count?: number
    colors?: string[]
    trailLength?: number
}

// 通用粒子系统
interface UseParticleSystemOptions {
    particles: ParticleConfig[]
    onUpdate: (particles: Particle[]) => void
}
```

---

## 五、工具函数接口

### 5.1 helpers.js

```typescript
// 格式化日期
formatDate(dateString: string): string

// 截断文本
truncateText(text: string, maxLength: number): string

// 格式化时间（分钟转小时分钟）
formatTime(minutes: number): string

// 获取角色类型标签
getRoleLabel(roleType: string): string

// 获取情节名称显示
getPlotNameDisplay(category: string, id: string): string

// 转义正则表达式特殊字符
escapeRegex(string: string): string

// 高亮关键词
highlightKeywords(content: string, characters: Character[]): string

// 生成唯一ID
generateId(): string
```

### 5.2 animations.js

```typescript
// 配置常量
EASINGS: { standard: EasingFunction, bounce: EasingFunction, ... }
CARD_3D_CONFIG: { maxTilt: number, perspective: number, ... }
WEATHER_CONFIG: { rain: RainConfig, snow: SnowConfig, ... }
PARTICLES_CONFIG: { count: number, speed: number, ... }
TRANSITION_CONFIG: { duration: number, ... }
MICRO_INTERACTION_CONFIG: { scale: number, ... }

// 工具函数
random(min: number, max: number): number
randomInt(min: number, max: number): number
randomChoice<T>(array: T[]): T

// 配置生成函数
generateParticleConfig(): ParticleConfig
generateRainDropConfig(): RainDropConfig
generateSnowFlakeConfig(): SnowFlakeConfig

// 计算函数
calculateTiltAngle(x: number, y: number, width: number, height: number): { rotateX: number, rotateY: number }
calculateFanAngle(index: number, total: number): number
calculateFanPosition(index: number, total: number, radius?: number): { x: number, y: number, rotate: number, scale: number }

// 防抖节流
debounce<T extends (...args: any[]) => any>(func: T, wait: number): T
throttle<T extends (...args: any[]) => any>(func: T, limit: number): T
```

### 5.3 storage.js

```typescript
interface Storage {
    // 用户相关
    getUserId(): string | null
    setUserId(userId: string): void
    getUsername(): string | null
    setUsername(username: string): void
    
    // 设置相关
    getTheme(): string
    setTheme(theme: string): void
    getFontSize(): number
    setFontSize(size: number): void
    
    // 通用方法
    get<T>(key: string): T | null
    set(key: string, value: any): void
    remove(key: string): void
    getMultiple(keys: string[]): Record<string, any>
    setMultiple(keyValuePairs: Record<string, any>): void
    
    // 清除方法
    clearUserData(): void
    clearAll(): void
}
```

### 5.4 constants.js

```typescript
// 颜色常量
COLORS: {
    primary: string
    secondary: string
    background: string
    text: string
    // ...
}

// 角色类型颜色
ROLE_COLORS: Record<string, string>

// 情节图标
PLOT_ICONS: {
    weather: Record<string, string>
    adventureType: Record<string, string>
    terrain: Record<string, string>
    equipment: Record<string, string>
}

// 角色表情符号
CHARACTER_EMOJIS: string[]

// 故事类型
PLOT_TYPES: string[]

// 角色类型
ROLE_TYPES: string[]

// 主题配置
THEMES: ThemeConfig[]
```

---

## 六、数据模型接口

### 6.1 User

```typescript
interface User {
    id: string
    username: string
    email?: string
    avatar?: string
    createdAt: string
    updatedAt?: string
}
```

### 6.2 Character

```typescript
interface Character {
    id: string
    userId: string
    name: string
    emoji: string
    personality: string
    speakingStyle: string
    description?: string
    createdAt: string
}
```

### 6.3 Book

```typescript
interface Book {
    id: string
    userId: string
    title: string
    coverImage?: string
    description?: string
    chapterCount: number
    isCompleted: boolean
    createdAt: string
    updatedAt: string
}
```

### 6.4 BookCharacter

```typescript
interface BookCharacter {
    id: string
    bookId: string
    characterId: string
    character?: Character
    customName?: string
    roleType: string
    createdAt: string
}
```

### 6.5 Chapter

```typescript
interface Chapter {
    id: string
    bookId: string
    chapterNumber: number
    title: string
    content: string
    hasPuzzle: boolean
    isCompleted: boolean
    createdAt: string
}
```

### 6.6 Puzzle

```typescript
interface Puzzle {
    id: string
    chapterId: string
    type: string
    question: string
    options?: string[]
    answer: string
    hint?: string
    points: number
}
```

### 6.7 PuzzleRecord

```typescript
interface PuzzleRecord {
    id: string
    puzzleId: string
    userId: string
    attempts: number
    isCorrect: boolean
    completedAt?: string
}
```

### 6.8 PlotOption

```typescript
interface PlotOption {
    weather: PlotItem[]
    adventureType: PlotItem[]
    terrain: PlotItem[]
    equipment: PlotItem[]
}

interface PlotItem {
    id: string
    name: string
    icon: string
    description?: string
}
```

### 6.9 Share

```typescript
interface Share {
    id: string
    shareCode: string
    bookId: string
    userId: string
    expiresAt?: string
    createdAt: string
}
```

---

## 七、导航参数接口

### 7.1 路由参数

```typescript
// 书籍详情页
interface BookDetailParams {
    bookId: string
}

// 章节阅读页
interface ChapterParams {
    chapterId: string
    bookId?: string
}

// 故事导演台
interface StoryDirectorParams {
    bookId: string
}

// 角色编辑
interface CharacterEditParams {
    character?: Character
}
```

### 7.2 导航类型

```typescript
// 根栈导航
type RootStackParamList = {
    Auth: undefined
    Main: undefined
}

// 主Tab导航
type MainTabParamList = {
    Home: undefined
    Bookshelf: undefined
    Characters: undefined
    Adventure: undefined
    Settings: undefined
}

// 首页栈
type HomeStackParamList = {
    HomeMain: undefined
    BookDetail: BookDetailParams
    Chapter: ChapterParams
    StoryDirector: StoryDirectorParams
}
```

---

## 八、类型定义文件

建议在项目中创建 `src/types/index.ts` 文件，统一管理所有类型定义：

```typescript
// src/types/index.ts

export * from './api'
export * from './models'
export * from './components'
export * from './navigation'
```

---

## 九、接口使用示例

### 9.1 登录流程

```typescript
import { usersAPI } from '../api/users'
import { useAuth } from '../context/AuthContext'

const LoginScreen = () => {
    const { login } = useAuth()
    
    const handleLogin = async (username: string) => {
        const { userId, isNewUser } = await usersAPI.createOrLogin(username)
        await login(userId)
    }
}
```

### 9.2 创建故事

```typescript
import { chaptersAPI } from '../api/chapters'

const createChapter = async () => {
    const result = await chaptersAPI.generate(bookId, userId, {
        weather: 'sunny',
        adventureType: 'exploration',
        terrain: 'forest',
        equipment: ['map', 'compass']
    })
    console.log('Created chapter:', result.chapterId)
}
```

### 9.3 使用3D卡牌

```typescript
import Card3D from '../components/card3d/Card3D'

const MyScreen = () => {
    return (
        <Card3D
            icon="🦸"
            name="英雄"
            enableTilt={true}
            enableFlip={true}
            onFlip={(isFlipped) => console.log('Flipped:', isFlipped)}
            frontContent={<Text>正面</Text>}
            backContent={<Text>背面</Text>}
        />
    )
}
```
