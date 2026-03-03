package com.legostory.mobile.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.legostory.mobile.LegoStoryApp
import com.legostory.mobile.ui.screens.login.LoginScreen
import com.legostory.mobile.ui.screens.home.HomeScreen
import com.legostory.mobile.ui.screens.bookshelf.BookshelfScreen
import com.legostory.mobile.ui.screens.characters.CharactersScreen
import com.legostory.mobile.ui.screens.adventure.AdventureScreen
import com.legostory.mobile.ui.screens.settings.SettingsScreen
import com.legostory.mobile.ui.screens.story.StoryCreateScreen
import com.legostory.mobile.ui.screens.story.StoryDirectorScreen
import com.legostory.mobile.ui.screens.bookdetail.BookDetailScreen
import com.legostory.mobile.ui.screens.chapter.ChapterScreen
import com.legostory.mobile.ui.screens.demo.DemoScreen
import com.legostory.mobile.ui.screens.charactercreate.CharacterCreateScreen
import com.legostory.mobile.ui.viewmodel.AuthViewModel
import com.legostory.mobile.ui.viewmodel.HomeViewModel
import com.legostory.mobile.ui.viewmodel.BookshelfViewModel
import com.legostory.mobile.ui.viewmodel.BookDetailViewModel
import com.legostory.mobile.ui.viewmodel.ChapterViewModel
import com.legostory.mobile.ui.viewmodel.CharactersViewModel

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Main : Screen("main")
    object Home : Screen("home")
    object Bookshelf : Screen("bookshelf")
    object Characters : Screen("characters")
    object CharacterCreate : Screen("characterCreate")
    object Adventure : Screen("adventure")
    object Settings : Screen("settings")
    object StoryCreate : Screen("storyCreate")
    object StoryDirector : Screen("storyDirector/{bookId}") {
        fun createRoute(bookId: String) = "storyDirector/$bookId"
    }
    object BookDetail : Screen("bookDetail/{bookId}") {
        fun createRoute(bookId: String) = "bookDetail/$bookId"
    }
    object Chapter : Screen("chapter/{chapterId}") {
        fun createRoute(chapterId: String) = "chapter/$chapterId"
    }
    object Demo : Screen("demo/{demoId}") {
        fun createRoute(demoId: String) = "demo/$demoId"
    }
}

@Composable
fun AppNavigation(
    navController: NavHostController = rememberNavController()
) {
    val authViewModel = AuthViewModel(LegoStoryApp.authRepository)
    val authState by authViewModel.state.collectAsState()
    
    val currentUserId = remember(authState.user) { authState.user?.userId }
    
    NavHost(
        navController = navController,
        startDestination = Screen.Login.route
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                viewModel = authViewModel,
                onLoginSuccess = {
                    navController.navigate(Screen.Main.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }
        
        composable(Screen.Main.route) {
            MainScreen(
                userId = currentUserId,
                onNavigateToStoryCreate = {
                    navController.navigate(Screen.StoryCreate.route)
                },
                onNavigateToBookDetail = { bookId ->
                    navController.navigate(Screen.BookDetail.createRoute(bookId))
                },
                onNavigateToChapter = { chapterId ->
                    navController.navigate(Screen.Chapter.createRoute(chapterId))
                },
                onNavigateToStoryDirector = { bookId ->
                    navController.navigate(Screen.StoryDirector.createRoute(bookId))
                },
                onNavigateToDemo = { demoId ->
                    navController.navigate(Screen.Demo.createRoute(demoId))
                },
                onLogout = {
                    authViewModel.logout()
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Main.route) { inclusive = true }
                    }
                }
            )
        }
        
        composable(Screen.StoryCreate.route) {
            StoryCreateScreen(
                onBack = { navController.popBackStack() },
                onComplete = { bookId ->
                    navController.navigate(Screen.BookDetail.createRoute(bookId)) {
                        popUpTo(Screen.Main.route)
                    }
                }
            )
        }
        
        composable(Screen.CharacterCreate.route) {
            CharacterCreateScreen(
                userId = currentUserId,
                onBack = { navController.popBackStack() },
                onCreated = { characterId ->
                    navController.popBackStack()
                }
            )
        }
        
        composable(Screen.StoryDirector.route) { backStackEntry ->
            val bookId = backStackEntry.arguments?.getString("bookId") ?: ""
            StoryDirectorScreen(
                storyId = bookId,
                onBack = { navController.popBackStack() },
                onPreview = { },
                onPublish = { }
            )
        }
        
        composable(Screen.BookDetail.route) { backStackEntry ->
            val bookId = backStackEntry.arguments?.getString("bookId") ?: ""
            android.util.Log.d("Navigation", "BookDetail route: bookId=$bookId, userId=$currentUserId")
            val bookDetailViewModel = BookDetailViewModel(
                bookRepository = LegoStoryApp.bookRepository,
                characterRepository = LegoStoryApp.characterRepository,
                bookId = bookId,
                userId = currentUserId
            )
            BookDetailScreen(
                viewModel = bookDetailViewModel,
                onBack = { navController.popBackStack() },
                onChapterClick = { chapterId ->
                    android.util.Log.d("Navigation", "Chapter clicked: chapterId=$chapterId")
                    navController.navigate(Screen.Chapter.createRoute(chapterId))
                },
                onAddChapter = { 
                    android.util.Log.d("Navigation", "Add chapter clicked: bookId=$bookId")
                    navController.navigate(Screen.StoryDirector.createRoute(bookId))
                },
                onDeleteBook = { bookIdToDelete ->
                    bookDetailViewModel.deleteBook(bookIdToDelete)
                    navController.popBackStack()
                }
            )
        }
        
        composable(Screen.Chapter.route) { backStackEntry ->
            val chapterId = backStackEntry.arguments?.getString("chapterId") ?: ""
            val chapterViewModel = ChapterViewModel(
                chapterRepository = LegoStoryApp.chapterRepository,
                bookRepository = LegoStoryApp.bookRepository,
                chapterId = chapterId,
                bookId = null,
                userId = currentUserId
            )
            ChapterScreen(
                viewModel = chapterViewModel,
                onBack = { navController.popBackStack() },
                onNavigateToChapter = { }
            )
        }
        
        composable(Screen.Demo.route) { backStackEntry ->
            DemoScreen(
                onBack = { navController.popBackStack() }
            )
        }
    }
}

@Composable
fun MainScreen(
    userId: String?,
    onNavigateToStoryCreate: () -> Unit,
    onNavigateToBookDetail: (String) -> Unit,
    onNavigateToChapter: (String) -> Unit,
    onNavigateToStoryDirector: (String) -> Unit,
    onNavigateToDemo: (String) -> Unit,
    onLogout: () -> Unit
) {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            val homeViewModel = HomeViewModel(
                bookRepository = LegoStoryApp.bookRepository,
                characterRepository = LegoStoryApp.characterRepository,
                userId = userId
            )
            HomeScreen(
                viewModel = homeViewModel,
                onNavigateToBookshelf = { navController.navigate(Screen.Bookshelf.route) },
                onNavigateToCharacters = { navController.navigate(Screen.Characters.route) },
                onNavigateToBookDetail = onNavigateToBookDetail,
                onNavigateToStoryCreate = onNavigateToStoryCreate
            )
        }
        
        composable(Screen.Bookshelf.route) {
            val bookshelfViewModel = BookshelfViewModel(
                bookRepository = LegoStoryApp.bookRepository,
                userId = userId
            )
            BookshelfScreen(
                viewModel = bookshelfViewModel,
                onBack = { navController.popBackStack() },
                onBookClick = onNavigateToBookDetail,
                onCreateBook = onNavigateToStoryCreate
            )
        }
        
        composable(Screen.Characters.route) {
            val charactersViewModel = CharactersViewModel(
                characterRepository = LegoStoryApp.characterRepository,
                userId = userId
            )
            CharactersScreen(
                viewModel = charactersViewModel,
                onBack = { navController.popBackStack() },
                onCreateCharacter = { 
                    navController.navigate(Screen.CharacterCreate.route)
                },
                onCharacterClick = { characterId ->
                    navController.navigate(Screen.CharacterCreate.route)
                }
            )
        }
        
        composable(Screen.Adventure.route) {
            AdventureScreen(
                onBack = { navController.popBackStack() },
                onStartAdventure = { }
            )
        }
        
        composable(Screen.Settings.route) {
            SettingsScreen(
                onLogout = onLogout
            )
        }
    }
}
