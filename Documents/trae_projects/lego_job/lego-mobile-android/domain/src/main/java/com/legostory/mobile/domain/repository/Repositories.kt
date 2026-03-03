package com.legostory.mobile.domain.repository

import com.legostory.mobile.core.model.*

interface AuthRepository {
    suspend fun login(username: String, email: String?): Result<UserResponse>
    suspend fun logout(): Result<Unit>
    suspend fun isLoggedIn(): Boolean
    suspend fun getCurrentUser(): UserResponse?
}

interface BookRepository {
    suspend fun getBooks(userId: String): Result<BookListResponse>
    suspend fun getBookDetail(bookId: String, userId: String?): Result<BookDetailResponse>
    suspend fun createBook(userId: String, title: String): Result<CreateBookResponse>
    suspend fun updateBook(bookId: String, title: String?, status: String?): Result<MessageResponse>
    suspend fun deleteBook(bookId: String): Result<MessageResponse>
}

interface ChapterRepository {
    suspend fun getChapter(chapterId: String, userId: String?): Result<ChapterDetailResponse>
    suspend fun getChaptersByBook(bookId: String, userId: String?): Result<ChapterListResponse>
    suspend fun createChapter(bookId: String, title: String, content: String, puzzle: Puzzle?): Result<CreateChapterResponse>
    suspend fun deleteChapter(chapterId: String): Result<MessageResponse>
    suspend fun generateChapter(bookId: String, userId: String, plotSelection: PlotSelection?, characterIds: List<String>?): Result<GenerateChapterResponse>
}

interface CharacterRepository {
    suspend fun getCharacters(userId: String?): Result<CharacterListResponse>
    suspend fun createCharacter(request: CreateCharacterRequest): Result<CreateCharacterResponse>
    suspend fun updateCharacter(request: UpdateCharacterRequest): Result<MessageResponse>
    suspend fun deleteCharacter(characterId: String, force: Boolean): Result<MessageResponse>
}

interface BookCharacterRepository {
    suspend fun getBookCharacters(bookId: String): Result<BookCharacterListResponse>
    suspend fun addBookCharacter(bookId: String, characterId: String, customName: String, roleType: String?): Result<AddBookCharacterResponse>
    suspend fun updateBookCharacter(id: String, customName: String?, roleType: String?): Result<MessageResponse>
    suspend fun deleteBookCharacter(id: String, force: Boolean): Result<DeleteBookCharacterResponse>
}

interface PuzzleRepository {
    suspend fun submitPuzzle(puzzleId: String, userId: String?, answer: String): Result<SubmitPuzzleResponse>
}

interface StoryRepository {
    suspend fun generateStory(request: StoryGenerateRequest): Result<StoryGenerateResponse>
}

interface PlotOptionsRepository {
    suspend fun getPlotOptions(): Result<PlotOptionsResponse>
}

interface ShareRepository {
    suspend fun createShare(bookId: String, userId: String): Result<ShareResponse>
    suspend fun getShareDetail(shareCode: String): Result<ShareDetailResponse>
}
