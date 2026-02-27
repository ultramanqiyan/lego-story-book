# LEGO Mobile UML 类图文档

## 一、整体架构图

```plantuml
@startuml Architecture
!define RECTANGLE class

package "API Layer" {
    [APIClient] as APIClient
    [usersAPI] as UsersAPI
    [charactersAPI] as CharactersAPI
    [booksAPI] as BooksAPI
    [chaptersAPI] as ChaptersAPI
    [puzzleAPI] as PuzzleAPI
    [storyAPI] as StoryAPI
    [shareAPI] as ShareAPI
}

package "Context Layer" {
    [AuthContext] as AuthCtx
    [ThemeContext] as ThemeCtx
    [ToastContext] as ToastCtx
}

package "Hooks Layer" {
    [use3DCard] as Use3DCard
    [useParticles] as UseParticles
}

package "Component Layer" {
    package "Common" {
        [Button] as Button
        [Card] as Card
        [Header] as Header
        [Loading] as Loading
        [Modal] as Modal
        [Toast] as Toast
        [EmptyState] as EmptyState
        [StepIndicator] as StepIndicator
    }
    
    package "Card3D" {
        [Card3D] as Card3D
        [CardDeck3D] as CardDeck3D
    }
    
    package "Story" {
        [CardDeck] as CardDeck
        [StagePreview] as StagePreview
        [WeatherEffect] as WeatherEffect
    }
    
    package "Chapter" {
        [KeywordHighlight] as KeywordHighlight
        [PromptPanel] as PromptPanel
    }
    
    package "Characters" {
        [CharacterForm] as CharacterForm
    }
    
    package "Weather" {
        [WeatherEffectV2] as WeatherEffectV2
    }
    
    package "Particles" {
        [MagicParticles] as MagicParticles
    }
}

package "Screen Layer" {
    [LoginScreen] as LoginScreen
    [HomeScreen] as HomeScreen
    [BookshelfScreen] as BookshelfScreen
    [CharactersScreen] as CharactersScreen
    [ChapterScreen] as ChapterScreen
    [StoryCreateScreen] as StoryCreateScreen
    [StoryDirectorScreen] as StoryDirectorScreen
    [BookDetailScreen] as BookDetailScreen
    [SettingsScreen] as SettingsScreen
    [ThemeSettingsScreen] as ThemeSettingsScreen
    [ParentControlScreen] as ParentControlScreen
    [AdventureScreen] as AdventureScreen
}

package "Navigation" {
    [AppNavigator] as AppNavigator
    [AuthNavigator] as AuthNavigator
    [MainNavigator] as MainNavigator
}

package "Utils" {
    [constants] as Constants
    [helpers] as Helpers
    [animations] as Animations
    [storage] as Storage
}

' API Dependencies
APIClient <|-- UsersAPI
APIClient <|-- CharactersAPI
APIClient <|-- BooksAPI
APIClient <|-- ChaptersAPI
APIClient <|-- PuzzleAPI
APIClient <|-- StoryAPI
APIClient <|-- ShareAPI

' Context Dependencies
AuthCtx --> UsersAPI
AuthCtx --> Storage
ThemeCtx --> Storage
ToastCtx --> Storage

' Screen Dependencies
LoginScreen --> AuthCtx
LoginScreen --> UsersAPI
HomeScreen --> AuthCtx
HomeScreen --> BooksAPI
HomeScreen --> CharactersAPI
BookshelfScreen --> AuthCtx
BookshelfScreen --> BooksAPI
CharactersScreen --> AuthCtx
CharactersScreen --> CharactersAPI
CharactersScreen --> Card3D
ChapterScreen --> AuthCtx
ChapterScreen --> ChaptersAPI
ChapterScreen --> PuzzleAPI
ChapterScreen --> KeywordHighlight
StoryCreateScreen --> AuthCtx
StoryCreateScreen --> BooksAPI
StoryCreateScreen --> CharactersAPI
StoryCreateScreen --> ChaptersAPI
StoryDirectorScreen --> AuthCtx
StoryDirectorScreen --> ChaptersAPI
StoryDirectorScreen --> CardDeck3D
BookDetailScreen --> AuthCtx
BookDetailScreen --> BooksAPI
BookDetailScreen --> ChaptersAPI
SettingsScreen --> AuthCtx
ThemeSettingsScreen --> ThemeCtx
ParentControlScreen --> AuthCtx

' Component Dependencies
Card3D --> Use3DCard
Card3D --> Animations
CardDeck3D --> Card3D
CardDeck3D --> Animations
KeywordHighlight --> Helpers
WeatherEffectV2 --> Animations
MagicParticles --> UseParticles

' Navigation Dependencies
AppNavigator --> AuthNavigator
AppNavigator --> MainNavigator
AppNavigator --> AuthCtx

@enduml
```

## 二、API 层类图

```plantuml
@startuml API_Layer

class APIClient {
    - baseURL: string
    + request(endpoint, options): Promise
    + get(endpoint, options): Promise
    + post(endpoint, body, options): Promise
    + put(endpoint, body, options): Promise
    + delete(endpoint, options): Promise
    - handleError(error): void
}

class UsersAPI {
    + createOrLogin(username, email?): Promise<{userId, message, isNewUser}>
    + getUser(userId): Promise<{user}>
    + updateUser(userId, data): Promise<{message}>
}

class CharactersAPI {
    + getList(userId?): Promise<{characters}>
    + create(data): Promise<{characterId, message}>
    + update(characterId, data): Promise<{message}>
    + delete(characterId, force?): Promise<{message}>
}

class BooksAPI {
    + getList(userId): Promise<{books}>
    + getDetail(bookId, userId?): Promise<{book, chapters, characters}>
    + create(userId, title): Promise<{bookId, message}>
    + update(bookId, data): Promise<{message}>
    + delete(bookId): Promise<{message}>
}

class BookCharactersAPI {
    + getList(bookId): Promise<{characters}>
    + add(bookId, characterId, customName, roleType?): Promise<{message, id}>
    + update(id, data): Promise<{message}>
    + delete(id, force?): Promise<{message}>
}

class ChaptersAPI {
    + getDetail(chapterId, userId?): Promise<{chapter, puzzle, puzzleRecord}>
    + getListByBook(bookId, userId?): Promise<{chapters}>
    + create(bookId, title, content, puzzle?): Promise<{chapterId, chapterNumber, message}>
    + delete(chapterId): Promise<{message}>
    + complete(bookId, chapterId, userId): Promise<{message}>
    + generate(bookId, userId, plotSelection?, characterIds?): Promise<{chapterId, chapterNumber, title, hasPuzzle, prompt, message}>
}

class PuzzleAPI {
    + getById(puzzleId): Promise<{puzzle}>
    + getByChapter(chapterId): Promise<{puzzle}>
    + submit(puzzleId, userId, userAnswer): Promise<{isCorrect, attempts, attemptsRemaining, hint?, message}>
}

class PlotOptionsAPI {
    + get(): Promise<{plotOptions}>
}

class StoryAPI {
    + generate(params: StoryGenerateParams): Promise<StoryGenerateResult>
}

class ShareAPI {
    + create(bookId, userId, options?): Promise<{shareId, shareCode, message}>
    + getByBook(bookId, userId): Promise<{shares}>
    + getByCode(code): Promise<{share}>
    + delete(shareId): Promise<{message}>
}

APIClient <|-- UsersAPI
APIClient <|-- CharactersAPI
APIClient <|-- BooksAPI
APIClient <|-- ChaptersAPI
APIClient <|-- PuzzleAPI
APIClient <|-- StoryAPI
APIClient <|-- ShareAPI

BooksAPI *-- BookCharactersAPI : contains
PuzzleAPI *-- PlotOptionsAPI : contains

@enduml
```

## 三、Context 层类图

```plantuml
@startuml Context_Layer

class AuthContext {
    - user: User | null
    - isLoading: boolean
    - isAuthenticated: boolean
    + login(username): Promise<void>
    + logout(): void
    + checkAuth(): Promise<void>
}

class ThemeContext {
    - themeId: string
    - theme: ThemeConfig
    - themes: ThemeConfig[]
    - card2DStyle: CardStyle
    - card3DStyle: CardStyle
    - particleEffect: ParticleEffect
    - weatherEffect: WeatherEffect
    + changeTheme(themeId): void
    + changeCard2DStyle(styleId): void
    + changeCard3DStyle(styleId): void
    + changeParticleEffect(effectId): void
    + changeWeatherEffect(effectId): void
}

class ToastContext {
    - toast: ToastState
    + showToast(message, type, duration): void
    + hideToast(): void
    + success(message): void
    + error(message): void
    + warning(message): void
    + info(message): void
}

class User {
    + id: string
    + username: string
    + email?: string
    + avatar?: string
    + createdAt: string
}

class ThemeConfig {
    + id: string
    + name: string
    + colors: ThemeColors
    + isDark: boolean
}

class ToastState {
    + visible: boolean
    + message: string
    + type: 'success' | 'error' | 'warning' | 'info'
    + duration: number
}

AuthContext *-- User
ThemeContext *-- ThemeConfig
ToastContext *-- ToastState

@enduml
```

## 四、组件层类图

### 4.1 通用组件

```plantuml
@startuml Common_Components

class Button {
    + title: string
    + onPress: () => void
    + variant: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
    + size: 'small' | 'medium' | 'large'
    + disabled: boolean
    + loading: boolean
    + icon: string
    + style: StyleProp
    + textStyle: StyleProp
}

class Card {
    + children: ReactNode
    + title: string
    + subtitle: string
    + onPress: () => void
    + variant: 'default' | 'elevated' | 'outlined'
    + style: StyleProp
}

class Header {
    + title: string
    + subtitle: string
    + leftButton: ReactNode
    + rightButton: ReactNode
    + transparent: boolean
    + backgroundColor: string
    + BackButton: FC
}

class Loading {
    + message: string
    + fullScreen: boolean
}

class Modal {
    + visible: boolean
    + onClose: () => void
    + title: string
    + children: ReactNode
    + showCloseButton: boolean
}

class Toast {
    +依赖 useToast()
}

class EmptyState {
    + icon: string
    + title: string
    + description: string
    + action: {label, onPress}
}

class StepIndicator {
    + currentStep: number
    + totalSteps: number
}

@enduml
```

### 4.2 3D卡牌组件

```plantuml
@startuml Card3D_Components

class Card3D {
    + frontContent: ReactNode
    + backContent: ReactNode
    + icon: string
    + name: string
    + isSelected: boolean
    + onPress: () => void
    + onFlip: (isFlipped: boolean) => void
    + width: number
    + height: number
    + style: StyleProp
    + enableTilt: boolean
    + enableFlip: boolean
    + variant: 'default' | 'glow' | 'minimal'
    --
    - flipProgress: SharedValue
    - tiltX: SharedValue
    - tiltY: SharedValue
    + flipCard(): void
    + resetTilt(): void
}

class CardDeck3D {
    + title: string
    + items: CardItem[]
    + selectedId: string
    + onPress: (item) => void
    + iconKey: string
    + nameKey: string
    + emoji: string
    + variant: 'default' | 'compact'
    + showTitle: boolean
    + enableFanSpread: boolean
    + stackOffset: number
    --
    + calculateFanPosition(index, total): {x, y, rotate, scale}
}

class use3DCard {
    + onFlip: () => void
    + onTilt: () => void
    + onPress: () => void
    + enableTilt: boolean
    + enableFlip: boolean
    --
    + frontAnimatedStyle: AnimatedStyle
    + backAnimatedStyle: AnimatedStyle
    + shadowAnimatedStyle: AnimatedStyle
    + glowAnimatedStyle: AnimatedStyle
    + gesture: Gesture
    + flipCard(): void
    + resetTilt(): void
    + updateLayout(width, height): void
    + animateSelect(): void
    + flipProgress: SharedValue
    + isFlipped(): boolean
}

class CardItem {
    + id: string
    + icon: string
    + name: string
    + [key: string]: any
}

Card3D --> use3DCard : uses
CardDeck3D --> Card3D : contains
CardDeck3D --> CardItem : uses

@enduml
```

### 4.3 章节组件

```plantuml
@startuml Chapter_Components

class KeywordHighlight {
    + content: string
    + characters: Character[]
    --
    - characterWords: string[]
    - actionWords: string[]
    - emotionWords: string[]
    - locationWords: string[]
    - weatherWords: string[]
    - itemWords: string[]
    + getHighlightStyle(word, type): StyleObject
    + renderContent(): ReactNode
}

class Character {
    + id: string
    + name: string
    + customName: string
    + roleType: string
    + emoji: string
}

class PromptPanel {
    + prompts: Prompt[]
    + title: string
}

class Prompt {
    + id: string
    + type: string
    + content: string
    + options?: string[]
}

KeywordHighlight --> Character : uses

@enduml
```

### 4.4 故事组件

```plantuml
@startuml Story_Components

class CardDeck {
    + title: string
    + items: CardItem[]
    + selectedId: string
    + onSelect: (item) => void
    + iconKey: string
    + nameKey: string
    + emoji: string
}

class StagePreview {
    + characters: Character[]
    + weather: string
    + terrain: string
    --
    + getTerrainEmoji(terrain): string
    + getCharacterPositions(count): Position[]
}

class WeatherEffect {
    + weather: 'sunny' | 'rainy' | 'thunder' | 'snow'
    --
    + SunEffect: FC
    + RainEffect: FC
    + SnowEffect: FC
}

class WeatherEffectV2 {
    + weather: string
    + intensity: 'light' | 'medium' | 'heavy'
    --
    + RainEffectV2: FC
    + SnowEffectV2: FC
    + SunEffectV2: FC
    + FogEffect: FC
}

class MagicParticles {
    + count: number
    + colors: string[]
    + enabled: boolean
    + showConnections: boolean
}

StagePreview --> WeatherEffect : uses
WeatherEffect <|-- WeatherEffectV2 : extends

@enduml
```

## 五、Screen 层类图

```plantuml
@startuml Screen_Layer

class LoginScreen {
    - username: string
    - isLoading: boolean
    + handleLogin(): Promise<void>
}

class HomeScreen {
    - hotCharacters: Character[]
    - recentBooks: Book[]
    - refreshing: boolean
    + loadData(): Promise<void>
    + onRefresh(): void
    + renderCharacterItem(item): ReactNode
    + renderBookItem(item): ReactNode
}

class BookshelfScreen {
    - books: Book[]
    - refreshing: boolean
    + loadBooks(): Promise<void>
    + onRefresh(): void
    + renderBookItem(item): ReactNode
}

class CharactersScreen {
    - characters: Character[]
    - refreshing: boolean
    - selectedCharacter: Character
    - showForm: boolean
    - showDetail: boolean
    + loadCharacters(): Promise<void>
    + onRefresh(): void
    + handleCreate(): void
    + handleEdit(character): void
    + handleDelete(id): Promise<void>
    + handleFormSubmit(data): Promise<void>
    + openDetail(character): void
    + renderCharacterCard(item): ReactNode
}

class ChapterScreen {
    - chapter: Chapter
    - puzzle: Puzzle
    - loading: boolean
    - plotModalVisible: boolean
    - userAnswer: string
    + loadChapter(): Promise<void>
    + handleAnswer(): Promise<void>
    + openPlotModal(): void
    + handleGenerateNext(): Promise<void>
    + goToChapter(chapterId): void
}

class StoryCreateScreen {
    - step: number
    - books: Book[]
    - characters: Character[]
    - selectedBook: Book
    - selectedPlot: string
    - selectedCharacters: string[]
    - characterRoles: Object
    - characterNames: Object
    + loadData(): Promise<void>
    + selectBook(book): void
    + createNewBook(): Promise<void>
    + selectPlot(plot): void
    + toggleCharacter(id): void
    + updateCharacterRole(id, role): void
    + updateCharacterName(id, name): void
    + handleCreate(): Promise<void>
}

class StoryDirectorScreen {
    - bookId: string
    - characters: Character[]
    - selectedCharacters: string[]
    - characterRoles: Object
    - weather: string
    - adventureType: string
    - terrain: string
    - equipment: string[]
    + loadData(): Promise<void>
    + getRoleCount(): number
    + toggleCharacter(id): void
    + updateCharacterRole(id, role): void
    + handleGenerate(): Promise<void>
    + randomSelect(): void
}

class BookDetailScreen {
    - bookId: string
    - book: Book
    - chapters: Chapter[]
    - characters: Character[]
    + loadData(): Promise<void>
    + handleAddCharacter(): void
    + handleEditCharacter(id): void
    + handleDeleteCharacter(id): Promise<void>
    + handleEditBook(): void
    + handleDeleteBook(): Promise<void>
    + handleViewPrompt(): void
    + handleShare(): void
}

class SettingsScreen {
    + handleLogout(): void
    + handleClearCache(): Promise<void>
    + handleThemeChange(): void
}

class ThemeSettingsScreen {
    - themeId: string
    - previewVisible: boolean
    - previewType: string
    + handleSelect(themeId): void
    + handlePreview(type): void
    + closePreview(): void
}

class ParentControlScreen {
    - timeLimit: number
    - stats: ReadingStats
    + loadData(): Promise<void>
    + handleTimeLimitChange(value): Promise<void>
}

class ReadingStats {
    + totalMinutes: number
    + chaptersRead: number
    + booksCompleted: number
}

@enduml
```

## 六、数据模型类图

```plantuml
@startuml Data_Models

class User {
    + id: string
    + username: string
    + email?: string
    + avatar?: string
    + createdAt: string
    + updatedAt: string
}

class Character {
    + id: string
    + userId: string
    + name: string
    + emoji: string
    + personality: string
    + speakingStyle: string
    + description: string
    + createdAt: string
}

class Book {
    + id: string
    + userId: string
    + title: string
    + coverImage?: string
    + description?: string
    + chapterCount: number
    + isCompleted: boolean
    + createdAt: string
    + updatedAt: string
}

class BookCharacter {
    + id: string
    + bookId: string
    + characterId: string
    + customName?: string
    + roleType: string
    + createdAt: string
}

class Chapter {
    + id: string
    + bookId: string
    + chapterNumber: number
    + title: string
    + content: string
    + hasPuzzle: boolean
    + isCompleted: boolean
    + createdAt: string
}

class Puzzle {
    + id: string
    + chapterId: string
    + type: string
    + question: string
    + options?: string[]
    + answer: string
    + hint?: string
    + points: number
}

class PuzzleRecord {
    + id: string
    + puzzleId: string
    + userId: string
    + attempts: number
    + isCorrect: boolean
    + completedAt?: string
}

class PlotOption {
    + weather: PlotItem[]
    + adventureType: PlotItem[]
    + terrain: PlotItem[]
    + equipment: PlotItem[]
}

class PlotItem {
    + id: string
    + name: string
    + icon: string
    + description?: string
}

class Share {
    + id: string
    + shareCode: string
    + bookId: string
    + userId: string
    + expiresAt?: string
    + createdAt: string
}

User "1" -- "*" Character : owns
User "1" -- "*" Book : owns
Book "1" -- "*" Chapter : contains
Book "1" -- "*" BookCharacter : has
Character "1" -- "*" BookCharacter : appears in
Chapter "1" -- "0..1" Puzzle : has
Puzzle "1" -- "*" PuzzleRecord : records
Book "1" -- "*" Share : shared

@enduml
```

## 七、工具类类图

```plantuml
@startuml Utils

class Constants {
    + COLORS: Object
    + ROLE_COLORS: Object
    + PLOT_ICONS: Object
    + CHARACTER_EMOJIS: string[]
    + PLOT_TYPES: string[]
    + ROLE_TYPES: string[]
    + THEMES: ThemeConfig[]
}

class Helpers {
    + formatDate(dateString): string
    + truncateText(text, maxLength): string
    + formatTime(minutes): string
    + getRoleLabel(roleType): string
    + getPlotNameDisplay(category, id): string
    + escapeRegex(string): string
    + highlightKeywords(content, characters): string
    + generateId(): string
}

class Animations {
    + EASINGS: Object
    + CARD_3D_CONFIG: Object
    + WEATHER_CONFIG: Object
    + PARTICLES_CONFIG: Object
    + TRANSITION_CONFIG: Object
    + MICRO_INTERACTION_CONFIG: Object
    + random(min, max): number
    + randomInt(min, max): number
    + randomChoice(array): any
    + generateParticleConfig(): Object
    + generateRainDropConfig(): Object
    + generateSnowFlakeConfig(): Object
    + calculateTiltAngle(x, y, width, height): {rotateX, rotateY}
    + calculateFanAngle(index, total): number
    + calculateFanPosition(index, total, radius): {x, y, rotate, scale}
    + debounce(func, wait): Function
    + throttle(func, limit): Function
}

class Storage {
    + getUserId(): string
    + setUserId(userId): void
    + getUsername(): string
    + setUsername(username): void
    + getTheme(): string
    + setTheme(theme): void
    + getFontSize(): number
    + setFontSize(size): void
    + get(key): any
    + set(key, value): void
    + remove(key): void
    + getMultiple(keys): Object
    + setMultiple(keyValuePairs): void
    + clearUserData(): void
    + clearAll(): void
}

@enduml
```

## 八、导航类图

```plantuml
@startuml Navigation

class AppNavigator {
    +依赖 AuthContext
    +返回 AuthNavigator | MainNavigator
}

class AuthNavigator {
    + Stack.Navigator
    + LoginScreen
}

class MainNavigator {
    + Tab.Navigator
    + HomeStack
    + BookshelfStack
    + CharactersStack
    + AdventureStack
    + SettingsStack
}

class HomeStack {
    + Stack.Navigator
    + HomeScreen
    + BookDetailScreen
    + ChapterScreen
    + StoryDirectorScreen
}

class BookshelfStack {
    + Stack.Navigator
    + BookshelfScreen
    + BookDetailScreen
    + ChapterScreen
}

class CharactersStack {
    + Stack.Navigator
    + CharactersScreen
}

class AdventureStack {
    + Stack.Navigator
    + AdventureScreen
    + StoryCreateScreen
}

class SettingsStack {
    + Stack.Navigator
    + SettingsScreen
    + ThemeSettingsScreen
    + ParentControlScreen
}

AppNavigator --> AuthNavigator
AppNavigator --> MainNavigator
MainNavigator --> HomeStack
MainNavigator --> BookshelfStack
MainNavigator --> CharactersStack
MainNavigator --> AdventureStack
MainNavigator --> SettingsStack

@enduml
```

---

## 附录：PlantUML 渲染说明

以上 UML 图使用 PlantUML 语法编写，可以通过以下方式渲染：

1. **VS Code 插件**: 安装 "PlantUML" 插件，直接预览
2. **在线工具**: 访问 https://www.plantuml.com/plantuml/uml/
3. **命令行**: 安装 plantuml 后执行 `plantuml diagram.puml`

每个 `@startuml` 和 `@enduml` 之间的内容是一个独立的图，可以单独渲染。
