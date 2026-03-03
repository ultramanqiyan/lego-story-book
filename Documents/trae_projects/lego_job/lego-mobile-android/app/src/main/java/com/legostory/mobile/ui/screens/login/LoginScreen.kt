package com.legostory.mobile.ui.screens.login

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.ui.animation.AnimationUtils
import com.legostory.mobile.ui.components.*
import com.legostory.mobile.ui.viewmodel.AuthViewModel

@Composable
fun LoginScreen(
    viewModel: AuthViewModel,
    onLoginSuccess: () -> Unit
) {
    val state by viewModel.state.collectAsState()
    var username by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var showError by remember { mutableStateOf(false) }

    LaunchedEffect(state.isAuthenticated) {
        if (state.isAuthenticated) {
            onLoginSuccess()
        }
    }

    LaunchedEffect(state.error) {
        showError = state.error != null
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            AnimationUtils.FadeInAnimation(visible = true) {
                LoginHeader()
            }

            Spacer(modifier = Modifier.height(48.dp))

            AnimationUtils.SlideInAnimation(
                visible = true,
                direction = AnimationUtils.SlideDirection.UP
            ) {
                LoginForm(
                    username = username,
                    onUsernameChange = { username = it },
                    email = email,
                    onEmailChange = { email = it },
                    isLoading = state.isLoading
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            AnimationUtils.ScaleAnimation(visible = true) {
                LegoButton(
                    title = if (state.isLoading) "登录中..." else "开始冒险",
                    onClick = {
                        if (username.isNotBlank()) {
                            viewModel.login(username, email.takeIf { it.isNotBlank() })
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    size = ButtonSize.LARGE,
                    enabled = !state.isLoading && username.isNotBlank()
                )
            }

            if (showError && state.error != null) {
                Spacer(modifier = Modifier.height(16.dp))
                ErrorMessage(message = state.error!!)
            }
        }
    }
}

@Composable
private fun LoginHeader() {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "🏰",
            fontSize = 64.sp
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "乐高故事书",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "Lego Story Book",
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "创造属于你的冒险故事",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun LoginForm(
    username: String,
    onUsernameChange: (String) -> Unit,
    email: String,
    onEmailChange: (String) -> Unit,
    isLoading: Boolean
) {
    Column {
        OutlinedTextField(
            value = username,
            onValueChange = onUsernameChange,
            label = { Text("你的名字") },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading,
            singleLine = true,
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null
                )
            },
            keyboardOptions = KeyboardOptions(
                imeAction = ImeAction.Next
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = email,
            onValueChange = onEmailChange,
            label = { Text("邮箱 (可选)") },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading,
            singleLine = true,
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Email,
                    contentDescription = null
                )
            },
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Email,
                imeAction = ImeAction.Done
            )
        )
    }
}

@Composable
private fun ErrorMessage(message: String) {
    LegoCard(
        variant = CardVariant.OUTLINE,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "⚠️",
                fontSize = 20.sp
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = message,
                color = MaterialTheme.colorScheme.error,
                fontSize = 14.sp
            )
        }
    }
}
