package com.legostory.mobile.data.repository

import com.legostory.mobile.core.model.*
import com.legostory.mobile.data.api.*
import com.legostory.mobile.data.storage.StorageManager
import com.legostory.mobile.domain.repository.*

class AuthRepositoryImpl(
    private val usersApi: UsersApi,
    private val storageManager: StorageManager
) : AuthRepository {
    
    override suspend fun login(username: String, email: String?): Result<UserResponse> {
        return try {
            val response = usersApi.createOrLogin(username, email)
            storageManager.setUserId(response.userId)
            storageManager.setUsername(username)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun logout(): Result<Unit> {
        return try {
            storageManager.clearUserData()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun isLoggedIn(): Boolean {
        return storageManager.getUserId() != null
    }
    
    override suspend fun getCurrentUser(): UserResponse? {
        val userId = storageManager.getUserId() ?: return null
        val username = storageManager.getUsername() ?: return null
        return UserResponse(userId, username, null, null)
    }
}

class BookRepositoryImpl(
    private val booksApi: BooksApi
) : BookRepository {
    
    override suspend fun getBooks(userId: String): Result<BookListResponse> {
        return try {
            Result.success(booksApi.getList(userId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun getBookDetail(bookId: String, userId: String?): Result<BookDetailResponse> {
        return try {
            Result.success(booksApi.getDetail(bookId, userId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun createBook(userId: String, title: String): Result<CreateBookResponse> {
        return try {
            Result.success(booksApi.create(userId, title))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun updateBook(bookId: String, title: String?, status: String?): Result<MessageResponse> {
        return try {
            Result.success(booksApi.update(bookId, title, status))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun deleteBook(bookId: String): Result<MessageResponse> {
        return try {
            Result.success(booksApi.delete(bookId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

class ChapterRepositoryImpl(
    private val chaptersApi: ChaptersApi
) : ChapterRepository {
    
    override suspend fun getChapter(chapterId: String, userId: String?): Result<ChapterDetailResponse> {
        return try {
            Result.success(chaptersApi.getDetail(chapterId, userId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun getChaptersByBook(bookId: String, userId: String?): Result<ChapterListResponse> {
        return try {
            Result.success(chaptersApi.getListByBook(bookId, userId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun createChapter(bookId: String, title: String, content: String, puzzle: Puzzle?): Result<CreateChapterResponse> {
        return try {
            Result.success(chaptersApi.create(bookId, title, content, puzzle))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun deleteChapter(chapterId: String): Result<MessageResponse> {
        return try {
            Result.success(chaptersApi.delete(chapterId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun generateChapter(bookId: String, userId: String, plotSelection: PlotSelection?, characterIds: List<String>?): Result<GenerateChapterResponse> {
        return try {
            Result.success(chaptersApi.generate(bookId, userId, plotSelection, characterIds))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

class CharacterRepositoryImpl(
    private val charactersApi: CharactersApi
) : CharacterRepository {
    
    override suspend fun getCharacters(userId: String?): Result<CharacterListResponse> {
        return try {
            Result.success(charactersApi.getList(userId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun createCharacter(request: CreateCharacterRequest): Result<CreateCharacterResponse> {
        return try {
            Result.success(charactersApi.create(request))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun updateCharacter(request: UpdateCharacterRequest): Result<MessageResponse> {
        return try {
            Result.success(charactersApi.update(request))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun deleteCharacter(characterId: String, force: Boolean): Result<MessageResponse> {
        return try {
            Result.success(charactersApi.delete(characterId, force))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

class BookCharacterRepositoryImpl(
    private val bookCharactersApi: BookCharactersApi
) : BookCharacterRepository {
    
    override suspend fun getBookCharacters(bookId: String): Result<BookCharacterListResponse> {
        return try {
            Result.success(bookCharactersApi.getList(bookId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun addBookCharacter(bookId: String, characterId: String, customName: String, roleType: String?): Result<AddBookCharacterResponse> {
        return try {
            Result.success(bookCharactersApi.add(bookId, characterId, customName, roleType))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun updateBookCharacter(id: String, customName: String?, roleType: String?): Result<MessageResponse> {
        return try {
            Result.success(bookCharactersApi.update(id, customName, roleType))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun deleteBookCharacter(id: String, force: Boolean): Result<DeleteBookCharacterResponse> {
        return try {
            Result.success(bookCharactersApi.delete(id, force))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

class PuzzleRepositoryImpl(
    private val puzzleApi: PuzzleApi
) : PuzzleRepository {
    
    override suspend fun submitPuzzle(puzzleId: String, userId: String?, answer: String): Result<SubmitPuzzleResponse> {
        return try {
            Result.success(puzzleApi.submit(puzzleId, userId, answer))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

class StoryRepositoryImpl(
    private val storyApi: StoryApi
) : StoryRepository {
    
    override suspend fun generateStory(request: StoryGenerateRequest): Result<StoryGenerateResponse> {
        return try {
            Result.success(storyApi.generate(request))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

class PlotOptionsRepositoryImpl(
    private val plotOptionsApi: PlotOptionsApi
) : PlotOptionsRepository {
    
    override suspend fun getPlotOptions(): Result<PlotOptionsResponse> {
        return try {
            Result.success(plotOptionsApi.get())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

class ShareRepositoryImpl(
    private val shareApi: ShareApi
) : ShareRepository {
    
    override suspend fun createShare(bookId: String, userId: String): Result<ShareResponse> {
        return try {
            Result.success(shareApi.create(bookId, userId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    override suspend fun getShareDetail(shareCode: String): Result<ShareDetailResponse> {
        return try {
            Result.success(shareApi.get(shareCode))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
