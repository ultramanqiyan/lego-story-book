package com.legostory.mobile

import android.app.Application
import com.legostory.mobile.data.api.*
import com.legostory.mobile.data.storage.StorageManager
import com.legostory.mobile.domain.repository.*
import com.legostory.mobile.data.repository.*

class LegoStoryApp : Application() {
    
    lateinit var apiClient: ApiClient
    lateinit var storageManager: StorageManager
    lateinit var authRepository: AuthRepository
    lateinit var bookRepository: BookRepository
    lateinit var chapterRepository: ChapterRepository
    lateinit var characterRepository: CharacterRepository
    lateinit var bookCharacterRepository: BookCharacterRepository
    lateinit var puzzleRepository: PuzzleRepository
    lateinit var storyRepository: StoryRepository
    lateinit var plotOptionsRepository: PlotOptionsRepository
    lateinit var shareRepository: ShareRepository
    
    override fun onCreate() {
        super.onCreate()
        
        instance = this
        
        apiClient = ApiClient()
        storageManager = StorageManager(this)
        
        val usersApi = UsersApi(apiClient)
        val booksApi = BooksApi(apiClient)
        val bookCharactersApi = BookCharactersApi(apiClient)
        val chaptersApi = ChaptersApi(apiClient)
        val charactersApi = CharactersApi(apiClient)
        val puzzleApi = PuzzleApi(apiClient)
        val storyApi = StoryApi(apiClient)
        val plotOptionsApi = PlotOptionsApi(apiClient)
        val shareApi = ShareApi(apiClient)
        
        authRepository = AuthRepositoryImpl(usersApi, storageManager)
        bookRepository = BookRepositoryImpl(booksApi)
        chapterRepository = ChapterRepositoryImpl(chaptersApi)
        characterRepository = CharacterRepositoryImpl(charactersApi)
        bookCharacterRepository = BookCharacterRepositoryImpl(bookCharactersApi)
        puzzleRepository = PuzzleRepositoryImpl(puzzleApi)
        storyRepository = StoryRepositoryImpl(storyApi)
        plotOptionsRepository = PlotOptionsRepositoryImpl(plotOptionsApi)
        shareRepository = ShareRepositoryImpl(shareApi)
    }
    
    companion object {
        lateinit var instance: LegoStoryApp
            private set
        
        val authRepository: AuthRepository get() = instance.authRepository
        val bookRepository: BookRepository get() = instance.bookRepository
        val chapterRepository: ChapterRepository get() = instance.chapterRepository
        val characterRepository: CharacterRepository get() = instance.characterRepository
    }
}
