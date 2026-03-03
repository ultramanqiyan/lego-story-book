package com.legostory.mobile.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.legostory.mobile.core.model.*
import com.legostory.mobile.domain.repository.AuthRepository
import com.legostory.mobile.domain.repository.BookRepository
import com.legostory.mobile.domain.repository.CharacterRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class AuthState(
    val isLoading: Boolean = true,
    val isAuthenticated: Boolean = false,
    val user: UserResponse? = null,
    val error: String? = null
)

class AuthViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _state = MutableStateFlow(AuthState())
    val state: StateFlow<AuthState> = _state.asStateFlow()
    
    init {
        checkAuth()
    }
    
    fun checkAuth() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true)
            android.util.Log.d("AuthViewModel", "checkAuth: checking current user")
            val user = authRepository.getCurrentUser()
            android.util.Log.d("AuthViewModel", "checkAuth: user=$user")
            _state.value = AuthState(
                isLoading = false,
                isAuthenticated = user != null,
                user = user
            )
        }
    }
    
    fun login(username: String, email: String? = null) {
        android.util.Log.d("AuthViewModel", "login: username=$username, email=$email")
        if (username.isBlank()) {
            _state.value = _state.value.copy(error = "请输入你的名字")
            return
        }
        
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            
            authRepository.login(username.trim(), email?.trim()?.takeIf { it.isNotBlank() })
                .onSuccess { user ->
                    android.util.Log.d("AuthViewModel", "login success: userId=${user.userId}")
                    _state.value = AuthState(
                        isLoading = false,
                        isAuthenticated = true,
                        user = user
                    )
                }
                .onFailure { error ->
                    android.util.Log.e("AuthViewModel", "login failed: ${error.message}")
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = error.message ?: "登录失败，请重试"
                    )
                }
        }
    }
    
    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
            _state.value = AuthState(
                isLoading = false,
                isAuthenticated = false,
                user = null
            )
        }
    }
    
    fun clearError() {
        _state.value = _state.value.copy(error = null)
    }
}

data class HomeState(
    val isLoading: Boolean = true,
    val isRefreshing: Boolean = false,
    val popularCharacters: List<Character> = emptyList(),
    val recentBooks: List<Book> = emptyList(),
    val error: String? = null
)

class HomeViewModel(
    private val bookRepository: BookRepository,
    private val characterRepository: CharacterRepository,
    private val userId: String?
) : ViewModel() {
    
    private val _state = MutableStateFlow(HomeState())
    val state: StateFlow<HomeState> = _state.asStateFlow()
    
    init {
        loadData()
    }
    
    fun loadData() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            
            android.util.Log.d("HomeViewModel", "loadData: userId=$userId")
            
            try {
                val charactersResult = characterRepository.getCharacters(userId)
                    .getOrNull()
                
                android.util.Log.d("HomeViewModel", "loadData: charactersResult=$charactersResult")
                
                val booksResult = if (userId != null) {
                    bookRepository.getBooks(userId).getOrNull()
                } else {
                    null
                }
                
                android.util.Log.d("HomeViewModel", "loadData: booksResult=$booksResult")
                
                val characters = charactersResult?.characters ?: emptyList()
                val books = booksResult?.books ?: emptyList()
                
                android.util.Log.d("HomeViewModel", "loadData: characters=${characters.size}, books=${books.size}")
                
                val popularCharacters = characters
                    .filter { it.resolveCreatorId() == "system" }
                    .take(4)
                
                _state.value = HomeState(
                    isLoading = false,
                    popularCharacters = popularCharacters,
                    recentBooks = books.take(4)
                )
            } catch (e: Exception) {
                android.util.Log.e("HomeViewModel", "loadData failed: ${e.message}", e)
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = "加载失败，请下拉刷新"
                )
            }
        }
    }
    
    fun refresh() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isRefreshing = true)
            loadData()
            _state.value = _state.value.copy(isRefreshing = false)
        }
    }
}

data class BookshelfState(
    val isLoading: Boolean = true,
    val isRefreshing: Boolean = false,
    val books: List<Book> = emptyList(),
    val error: String? = null
)

class BookshelfViewModel(
    private val bookRepository: BookRepository,
    private val userId: String?
) : ViewModel() {
    
    private val _state = MutableStateFlow(BookshelfState())
    val state: StateFlow<BookshelfState> = _state.asStateFlow()
    
    init {
        loadBooks()
    }
    
    fun loadBooks() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            
            android.util.Log.d("BookshelfViewModel", "Loading books for userId: $userId")
            
            if (userId == null) {
                android.util.Log.w("BookshelfViewModel", "userId is null, skipping load")
                _state.value = BookshelfState(isLoading = false)
                return@launch
            }
            
            bookRepository.getBooks(userId)
                .onSuccess { response ->
                    android.util.Log.d("BookshelfViewModel", "Loaded ${response.books.size} books")
                    response.books.forEach { book ->
                        android.util.Log.d("BookshelfViewModel", "Book: id=${book.resolveBookId()}, title=${book.title}")
                    }
                    _state.value = BookshelfState(
                        isLoading = false,
                        books = response.books
                    )
                }
                .onFailure { error ->
                    android.util.Log.e("BookshelfViewModel", "Failed to load books: ${error.message}", error)
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = error.message ?: "加载失败"
                    )
                }
        }
    }
    
    fun refresh() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isRefreshing = true)
            loadBooks()
            _state.value = _state.value.copy(isRefreshing = false)
        }
    }

    fun deleteBook(bookId: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true)
            
            bookRepository.deleteBook(bookId)
                .onSuccess {
                    loadBooks()
                }
                .onFailure { error ->
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = error.message ?: "删除失败"
                    )
                }
        }
    }
}

data class BookDetailState(
    val isLoading: Boolean = true,
    val book: Book? = null,
    val chapters: List<Chapter> = emptyList(),
    val characters: List<BookCharacter> = emptyList(),
    val allCharacters: List<Character> = emptyList(),
    val activeTab: Int = 0,
    val error: String? = null
)

class BookDetailViewModel(
    private val bookRepository: BookRepository,
    private val characterRepository: CharacterRepository,
    private val bookId: String,
    private val userId: String?
) : ViewModel() {
    
    private val _state = MutableStateFlow(BookDetailState())
    val state: StateFlow<BookDetailState> = _state.asStateFlow()
    
    init {
        loadData()
    }
    
    fun loadData() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            
            android.util.Log.d("BookDetailViewModel", "Loading book detail: bookId=$bookId, userId=$userId")
            
            bookRepository.getBookDetail(bookId, userId)
                .onSuccess { detail ->
                    android.util.Log.d("BookDetailViewModel", "Success: book=${detail.book.title}, chapters=${detail.chapters.size}, characters=${detail.characters.size}")
                    detail.chapters.forEachIndexed { index, chapter ->
                        android.util.Log.d("BookDetailViewModel", "Chapter $index: id=${chapter.resolveChapterId()}, title=${chapter.title}")
                    }
                    _state.value = _state.value.copy(
                        isLoading = false,
                        book = detail.book,
                        chapters = detail.chapters,
                        characters = detail.characters
                    )
                }
                .onFailure { error ->
                    android.util.Log.e("BookDetailViewModel", "Failed: ${error.message}", error)
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = error.message ?: "加载失败"
                    )
                }
            
            characterRepository.getCharacters(userId)
                .onSuccess { response ->
                    _state.value = _state.value.copy(
                        allCharacters = response.characters
                    )
                }
        }
    }
    
    fun setActiveTab(tab: Int) {
        _state.value = _state.value.copy(activeTab = tab)
    }
    
    fun deleteBook(bookId: String) {
        viewModelScope.launch {
            bookRepository.deleteBook(bookId)
                .onSuccess {
                    // Book deleted successfully
                }
                .onFailure { error ->
                    _state.value = _state.value.copy(
                        error = error.message ?: "删除失败"
                    )
                }
        }
    }
}

data class ChapterState(
    val isLoading: Boolean = true,
    val chapter: Chapter? = null,
    val puzzle: Puzzle? = null,
    val puzzleRecord: PuzzleRecord? = null,
    val bookCharacters: List<BookCharacter> = emptyList(),
    val navigation: ChapterNavigation? = null,
    val selectedAnswer: String? = null,
    val isCorrect: Boolean = false,
    val attempts: Int = 0,
    val currentChapterIndex: Int = 1,
    val totalChapters: Int = 1,
    val error: String? = null
)

class ChapterViewModel(
    private val chapterRepository: com.legostory.mobile.domain.repository.ChapterRepository,
    private val bookRepository: BookRepository,
    private val chapterId: String,
    private val bookId: String?,
    private val userId: String?
) : ViewModel() {
    
    private val _state = MutableStateFlow(ChapterState())
    val state: StateFlow<ChapterState> = _state.asStateFlow()
    
    init {
        loadChapter()
    }
    
    fun loadChapter() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            
            android.util.Log.d("ChapterViewModel", "Loading chapter: chapterId=$chapterId, userId=$userId")
            
            chapterRepository.getChapter(chapterId, userId)
                .onSuccess { response ->
                    android.util.Log.d("ChapterViewModel", "Success: chapter=${response.chapter.title}, content=${response.chapter.content?.take(100)}")
                    _state.value = _state.value.copy(
                        isLoading = false,
                        chapter = response.chapter,
                        puzzle = response.puzzle,
                        puzzleRecord = response.puzzleRecord,
                        bookCharacters = response.bookCharacters ?: emptyList(),
                        navigation = response.navigation,
                        isCorrect = response.puzzleRecord?.checkIsCorrect() ?: false
                    )
                    
                    val effectiveBookId = bookId ?: response.chapter.book_id
                    if (effectiveBookId != null) {
                        launch {
                            loadBookCharacters(effectiveBookId)
                        }
                    }
                }
                .onFailure { error ->
                    android.util.Log.e("ChapterViewModel", "Failed: ${error.message}")
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = error.message ?: "加载失败"
                    )
                }
        }
    }
    
    private suspend fun loadBookCharacters(bookId: String) {
        bookRepository.getBookDetail(bookId, userId)
            .onSuccess { detail ->
                if (detail.characters.isNotEmpty()) {
                    _state.value = _state.value.copy(
                        bookCharacters = detail.characters,
                        totalChapters = detail.book.resolveChapterCount()
                    )
                }
            }
    }

    fun submitPuzzleAnswer(answer: String?): Boolean {
        val puzzle = _state.value.puzzle ?: return false
        val isCorrect = answer == puzzle.answer
        
        _state.value = _state.value.copy(
            selectedAnswer = answer,
            isCorrect = isCorrect,
            attempts = _state.value.attempts + 1
        )
        
        return isCorrect
    }

    fun loadPreviousChapter() {
        val navigation = _state.value.navigation ?: return
        val prevId = navigation.prev ?: return
        
        _state.value = _state.value.copy(
            currentChapterIndex = (_state.value.currentChapterIndex - 1).coerceAtLeast(1)
        )
    }

    fun loadNextChapter() {
        val navigation = _state.value.navigation ?: return
        val nextId = navigation.next ?: return
        
        _state.value = _state.value.copy(
            currentChapterIndex = (_state.value.currentChapterIndex + 1).coerceAtMost(_state.value.totalChapters)
        )
    }
}

private fun <T> Result<T>.onSuccess(action: (T) -> Unit): Result<T> {
    getOrNull()?.let { action(it) }
    return this
}

private fun <T> Result<T>.onFailure(action: (Throwable) -> Unit): Result<T> {
    exceptionOrNull()?.let { action(it) }
    return this
}

data class CharactersState(
    val isLoading: Boolean = true,
    val characters: List<Character> = emptyList(),
    val error: String? = null
)

class CharactersViewModel(
    private val characterRepository: CharacterRepository,
    private val userId: String?
) : ViewModel() {
    
    private val _state = MutableStateFlow(CharactersState())
    val state: StateFlow<CharactersState> = _state.asStateFlow()
    
    fun loadCharacters() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            
            characterRepository.getCharacters(userId)
                .onSuccess { response ->
                    _state.value = CharactersState(
                        isLoading = false,
                        characters = response.characters
                    )
                }
                .onFailure { error ->
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = error.message ?: "加载失败"
                    )
                }
        }
    }
}
