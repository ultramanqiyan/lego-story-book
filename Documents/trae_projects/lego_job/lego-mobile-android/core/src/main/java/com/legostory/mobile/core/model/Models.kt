package com.legostory.mobile.core.model

import com.google.gson.annotations.SerializedName

data class UserResponse(
    val userId: String,
    val username: String? = null,
    val email: String? = null,
    val createdAt: String? = null,
    val message: String? = null,
    val isNewUser: Boolean? = null
)

data class Book(
    val bookId: String? = null,
    val book_id: String? = null,
    val id: String? = null,
    val title: String = "",
    val user_id: String? = null,
    val chapterCount: Int? = null,
    val chapter_count: Int? = null,
    val status: String? = null,
    val createdAt: String? = null,
    val created_at: String? = null,
    val updated_at: String? = null,
    val plotSelection: PlotSelection? = null
) {
    fun resolveBookId(): String = bookId ?: book_id ?: id ?: ""
    fun resolveChapterCount(): Int = chapterCount ?: chapter_count ?: 0
}

data class BookDetailResponse(
    val book: Book,
    val chapters: List<Chapter> = emptyList(),
    val characters: List<BookCharacter> = emptyList()
)

data class BookListResponse(
    val books: List<Book> = emptyList()
)

data class CreateBookResponse(
    val bookId: String,
    val message: String
)

data class MessageResponse(
    val message: String
)

data class Chapter(
    val chapterId: String? = null,
    val chapter_id: String? = null,
    val id: String? = null,
    val bookId: String? = null,
    val book_id: String? = null,
    val title: String = "",
    val content: String? = null,
    val chapterNumber: Int? = null,
    val chapter_number: Int? = null,
    @SerializedName("has_puzzle") val hasPuzzleRaw: Int? = null,
    val puzzleResult: Int? = null,
    val puzzle_result: Int? = null,
    val wordCount: Int? = null,
    val word_count: Int? = null,
    val storyContext: String? = null,
    val story_context: String? = null,
    val puzzle: Puzzle? = null,
    val isCompleted: Boolean? = null,
    val created_at: String? = null
) {
    fun resolveChapterId(): String = chapterId ?: chapter_id ?: id ?: ""
    fun resolveChapterNumber(): Int = chapterNumber ?: chapter_number ?: 1
    fun resolveHasPuzzle(): Boolean = hasPuzzleRaw == 1
    fun resolvePuzzleResult(): Int? = puzzleResult ?: puzzle_result
    fun resolveWordCount(): Int = wordCount ?: word_count ?: 0
    fun resolveStoryContext(): String? = storyContext ?: story_context
}

data class ChapterDetailResponse(
    val chapter: Chapter,
    val puzzle: Puzzle? = null,
    val puzzleRecord: PuzzleRecord? = null,
    val bookCharacters: List<BookCharacter>? = null,
    val navigation: ChapterNavigation? = null
)

data class ChapterListResponse(
    val chapters: List<Chapter> = emptyList()
)

data class CreateChapterResponse(
    val chapterId: String,
    val chapterNumber: Int,
    val message: String
)

data class GenerateChapterResponse(
    val chapterId: String,
    val chapterNumber: Int,
    val title: String,
    val hasPuzzle: Boolean,
    val prompt: String?,
    val message: String
)

data class ChapterNavigation(
    val prev: String?,
    val next: String?,
    val total: Int,
    val current: Int
)

data class Character(
    val characterId: String? = null,
    val character_id: String? = null,
    val id: String? = null,
    val name: String = "",
    val description: String? = null,
    val personality: String? = null,
    val speakingStyle: String? = null,
    val speaking_style: String? = null,
    val creatorId: String? = null,
    val creator_id: String? = null,
    val imageBase64: String? = null,
    val image_base64: String? = null,
    val created_at: String? = null,
    val updated_at: String? = null
) {
    fun resolveCharacterId(): String = characterId ?: character_id ?: id ?: ""
    fun resolveSpeakingStyle(): String? = speakingStyle ?: speaking_style
    fun resolveCreatorId(): String? = creatorId ?: creator_id
    fun resolveImageBase64(): String? = imageBase64 ?: image_base64
}

data class CharacterListResponse(
    val characters: List<Character> = emptyList()
)

data class CreateCharacterRequest(
    val name: String,
    val imageBase64: String? = null,
    val description: String? = null,
    val personality: String? = null,
    val speakingStyle: String? = null,
    val creatorId: String = "user"
)

data class CreateCharacterResponse(
    val characterId: String,
    val message: String
)

data class UpdateCharacterRequest(
    val characterId: String,
    val name: String? = null,
    val imageBase64: String? = null,
    val description: String? = null,
    val personality: String? = null,
    val speakingStyle: String? = null
)

data class BookCharacter(
    val id: String? = null,
    val bookCharacterId: String? = null,
    val bookId: String? = null,
    val book_id: String? = null,
    val characterId: String? = null,
    val character_id: String? = null,
    val customName: String? = null,
    val custom_name: String? = null,
    val original_name: String? = null,
    val name: String? = null,
    val roleType: String? = null,
    val role_type: String? = null,
    val description: String? = null,
    val personality: String? = null,
    val speakingStyle: String? = null,
    val speaking_style: String? = null,
    val image_base64: String? = null,
    val created_at: String? = null
) {
    fun resolveId(): String = id ?: bookCharacterId ?: ""
    fun resolveCustomName(): String = customName ?: custom_name ?: original_name ?: name ?: ""
    fun resolveRoleType(): String = roleType ?: role_type ?: "supporting"
}

data class BookCharacterListResponse(
    val characters: List<BookCharacter> = emptyList()
)

data class AddBookCharacterRequest(
    val bookId: String,
    val characterId: String,
    val customName: String,
    val roleType: String? = null
)

data class AddBookCharacterResponse(
    val message: String,
    val id: String
)

data class DeleteBookCharacterResponse(
    val message: String? = null,
    val needsConfirm: Boolean? = null,
    val isProtagonist: Boolean? = null,
    val chapterCount: Int? = null
)

data class Puzzle(
    val puzzleId: String? = null,
    val puzzle_id: String? = null,
    val id: String? = null,
    val chapterId: String? = null,
    val chapter_id: String? = null,
    val question: String = "",
    @SerializedName("options") private val optionsJson: String? = null,
    val answer: String? = null,
    val hint: String? = null,
    val puzzle_type: String? = null,
    val type: String? = null,
    val created_at: String? = null
) {
    fun resolvePuzzleId(): String = puzzleId ?: puzzle_id ?: id ?: ""
    fun resolvePuzzleType(): String = puzzle_type ?: type ?: "pattern"
    fun resolveOptionsList(): List<String> {
        return try {
            if (!optionsJson.isNullOrBlank() && optionsJson.startsWith("[")) {
                com.google.gson.Gson().fromJson(optionsJson, Array<String>::class.java).toList()
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            emptyList()
        }
    }
}

data class PuzzleRecord(
    val id: String? = null,
    val puzzleId: String? = null,
    val puzzle_id: String? = null,
    val userId: String? = null,
    val user_id: String? = null,
    val answer: String? = null,
    val isCorrect: Int? = null,
    val is_correct: Int? = null,
    val attempts: Int? = null
) {
    fun checkIsCorrect(): Boolean = (isCorrect ?: is_correct) == 1
}

data class SubmitPuzzleResponse(
    val isCorrect: Boolean,
    val message: String?,
    val hint: String?,
    val attempts: Int
)

data class PlotOption(
    val id: String,
    val name: String,
    val icon: String
)

data class PlotOptionsResponse(
    val plotOptions: Map<String, List<PlotOption>>
)

data class PlotSelection(
    val weather: String? = null,
    val adventureType: String? = null,
    val terrain: String? = null,
    val equipment: String? = null
)

data class StoryGenerateRequest(
    val characters: List<StoryCharacter>,
    val plot: String,
    val chapterCharacters: List<StoryCharacter>? = null,
    val previousSummary: String? = null,
    val previousPuzzle: PreviousPuzzle? = null,
    val plotSelection: PlotSelection? = null,
    val forcePuzzle: Boolean? = null
)

data class StoryCharacter(
    val characterId: String,
    val customName: String,
    val personality: String? = null,
    val speakingStyle: String? = null
)

data class PreviousPuzzle(
    val question: String,
    val answer: String,
    val isCorrect: Boolean
)

data class StoryGenerateResponse(
    val title: String,
    val content: String,
    val puzzle: Puzzle? = null,
    val prompt: String? = null
)

data class ShareResponse(
    val shareCode: String,
    val message: String
)

data class ShareDetailResponse(
    val bookId: String,
    val title: String,
    val chapters: List<Chapter>
)
