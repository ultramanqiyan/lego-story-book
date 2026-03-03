package com.lego.android.parity

import java.io.File

class AnimationComparator(
    private val rnProjectPath: String,
    private val androidProjectPath: String
) {
    private val results = mutableListOf<ComparisonResult>()
    
    private val easingMappings = mapOf(
        "linear" to "LinearEasing",
        "easeIn" to "FastOutSlowInEasing (approximation)",
        "easeOut" to "LinearOutSlowInEasing",
        "easeInOut" to "FastOutLinearInEasing",
        "bounce" to "spring() with bounce",
        "elastic" to "spring() with elasticity"
    )
    
    private val animationTypeMappings = mapOf(
        "fadeIn" to "fadeIn()",
        "fadeOut" to "fadeOut()",
        "scaleIn" to "scaleIn()",
        "scaleOut" to "scaleOut()",
        "slideIn" to "slideInHorizontally()/slideInVertically()",
        "slideOut" to "slideOutHorizontally()/slideOutVertically()",
        "cardFlip" to "CardFlipAnimation (custom)",
        "cardGlow" to "GlowEffect (custom)"
    )
    
    fun compare(): List<ComparisonResult> {
        Logger.info("Starting animation comparison...")
        results.clear()
        
        compareDurations()
        compareEasings()
        compareAnimationVariants()
        compareCardAnimations()
        compareWeatherEffects()
        compareParticleEffects()
        compareTransitions()
        compareMicroInteractions()
        
        Logger.info("Animation comparison completed. Found ${results.size} results")
        return results.toList()
    }
    
    private fun compareDurations() {
        Logger.info("Comparing animation durations...")
        
        val rnDurations = extractRnDurations()
        val androidDurations = extractAndroidDurations()
        
        val standardDurations = mapOf(
            "instant" to 0,
            "fast" to 150,
            "normal" to 300,
            "slow" to 500,
            "verySlow" to 800
        )
        
        for ((name, expectedValue) in standardDurations) {
            val rnValue = rnDurations[name]
            val androidValue = androidDurations[name]
            
            when {
                rnValue == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Animation/Duration",
                            itemName = name,
                            status = ComparisonStatus.MISSING_IN_RN,
                            rnValue = null,
                            androidValue = androidValue?.let { "${it}ms" },
                            difference = "Duration '$name' not found in RN",
                            priority = Priority.LOW
                        )
                    )
                }
                androidValue == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Animation/Duration",
                            itemName = name,
                            status = ComparisonStatus.MISSING_IN_ANDROID,
                            rnValue = "${rnValue}ms",
                            androidValue = null,
                            difference = "Duration '$name' not found in Android",
                            priority = Priority.MEDIUM,
                            suggestions = listOf("Add $name = ${rnValue} to Android animation constants")
                        )
                    )
                }
                rnValue != androidValue -> {
                    results.add(
                        ComparisonResult(
                            category = "Animation/Duration",
                            itemName = name,
                            status = ComparisonStatus.MISMATCH,
                            rnValue = "${rnValue}ms",
                            androidValue = "${androidValue}ms",
                            difference = "Duration values differ by ${kotlin.math.abs(rnValue - androidValue)}ms",
                            priority = Priority.MEDIUM,
                            suggestions = listOf("Align duration values for consistency")
                        )
                    )
                }
                else -> {
                    results.add(
                        ComparisonResult(
                            category = "Animation/Duration",
                            itemName = name,
                            status = ComparisonStatus.MATCH,
                            rnValue = "${rnValue}ms",
                            androidValue = "${androidValue}ms",
                            priority = Priority.LOW
                        )
                    )
                }
            }
        }
    }
    
    private fun extractRnDurations(): Map<String, Int> {
        val durations = mutableMapOf<String, Int>()
        
        val animationsFile = File(rnProjectPath, "src/styles/animations.js")
        if (!animationsFile.exists()) return durations
        
        val content = FileUtils.readFileContent(animationsFile) ?: return durations
        
        val durationPattern = Regex("export\\s+const\\s+DURATION\\s*=\\s*\\{([^}]+)\\}")
        val valuePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*(\\d+)")
        
        durationPattern.findAll(content).forEach { match ->
            val objectContent = match.groupValues[1]
            valuePattern.findAll(objectContent).forEach { valueMatch ->
                val name = valueMatch.groupValues[1]
                val value = valueMatch.groupValues[2].toIntOrNull()
                if (value != null) {
                    durations[name] = value
                }
            }
        }
        
        return durations
    }
    
    private fun extractAndroidDurations(): Map<String, Int> {
        val durations = mutableMapOf<String, Int>()
        
        val animationFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/animation/AnimationUtils.kt")
        if (!animationFile.exists()) return durations
        
        val content = FileUtils.readFileContent(animationFile) ?: return durations
        
        val durationPattern = Regex("durationMillis\\s*:\\s*(\\d+)")
        val tweenPattern = Regex("tween\\s*\\(\\s*durationMillis\\s*=\\s*(\\d+)")
        
        val allDurations = mutableListOf<Int>()
        
        durationPattern.findAll(content).forEach { match ->
            match.groupValues[1].toIntOrNull()?.let { allDurations.add(it) }
        }
        
        tweenPattern.findAll(content).forEach { match ->
            match.groupValues[1].toIntOrNull()?.let { allDurations.add(it) }
        }
        
        if (allDurations.contains(300)) durations["normal"] = 300
        if (allDurations.contains(150)) durations["fast"] = 150
        if (allDurations.contains(500)) durations["slow"] = 500
        if (allDurations.contains(400)) durations["medium"] = 400
        
        return durations
    }
    
    private fun compareEasings() {
        Logger.info("Comparing animation easings...")
        
        val rnEasings = extractRnEasings()
        val androidEasings = extractAndroidEasings()
        
        for ((easingName, rnEasing) in easingMappings) {
            val androidEquivalent = easingMappings[easingName]
            val hasAndroidEasing = androidEasings.any { 
                it.contains(androidEquivalent?.split(" ")?.first() ?: "", ignoreCase = true) 
            }
            
            if (rnEasings.containsKey(easingName)) {
                results.add(
                    ComparisonResult(
                        category = "Animation/Easing",
                        itemName = easingName,
                        status = if (hasAndroidEasing) ComparisonStatus.MATCH else ComparisonStatus.MISSING_IN_ANDROID,
                        rnValue = "Easing.$easingName",
                        androidValue = if (hasAndroidEasing) androidEquivalent else null,
                        difference = if (hasAndroidEasing) null else "No equivalent easing in Android",
                        priority = Priority.LOW,
                        suggestions = if (!hasAndroidEasing) {
                            listOf("Use $androidEquivalent in Android for similar effect")
                        } else emptyList()
                    )
                )
            }
        }
    }
    
    private fun extractRnEasings(): Map<String, String> {
        val easings = mutableMapOf<String, String>()
        
        val animationsFile = File(rnProjectPath, "src/styles/animations.js")
        if (!animationsFile.exists()) return easings
        
        val content = FileUtils.readFileContent(animationsFile) ?: return easings
        
        val easingPattern = Regex("export\\s+const\\s+EASING\\s*=\\s*\\{([^}]+)\\}")
        val valuePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*([^,\\n]+)")
        
        easingPattern.findAll(content).forEach { match ->
            val objectContent = match.groupValues[1]
            valuePattern.findAll(objectContent).forEach { valueMatch ->
                val name = valueMatch.groupValues[1]
                val value = valueMatch.groupValues[2].trim()
                easings[name] = value
            }
        }
        
        return easings
    }
    
    private fun extractAndroidEasings(): List<String> {
        val easings = mutableListOf<String>()
        
        val animationFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/animation/AnimationUtils.kt")
        if (!animationFile.exists()) return easings
        
        val content = FileUtils.readFileContent(animationFile) ?: return easings
        
        val easingPatterns = listOf(
            "LinearEasing",
            "FastOutSlowInEasing",
            "LinearOutSlowInEasing",
            "FastOutLinearInEasing",
            "spring\\s*\\(",
            "tween\\s*\\("
        )
        
        easingPatterns.forEach { pattern ->
            if (content.contains(Regex(pattern))) {
                easings.add(pattern.replace("\\s*\\(", "").replace("\\(", ""))
            }
        }
        
        return easings
    }
    
    private fun compareAnimationVariants() {
        Logger.info("Comparing animation variants...")
        
        val rnVariants = extractRnAnimationVariants()
        
        for ((variantName, variantConfig) in rnVariants) {
            val androidEquivalent = animationTypeMappings[variantName]
            
            results.add(
                ComparisonResult(
                    category = "Animation/Variants",
                    itemName = variantName,
                    status = if (androidEquivalent != null) ComparisonStatus.MATCH else ComparisonStatus.MISSING_IN_ANDROID,
                    rnValue = variantConfig,
                    androidValue = androidEquivalent,
                    difference = if (androidEquivalent != null) null else "No equivalent animation in Android",
                    priority = Priority.MEDIUM,
                    suggestions = if (androidEquivalent == null) {
                        listOf("Create $variantName animation in AnimationUtils.kt")
                    } else emptyList()
                )
            )
        }
    }
    
    private fun extractRnAnimationVariants(): Map<String, String> {
        val variants = mutableMapOf<String, String>()
        
        val animationsFile = File(rnProjectPath, "src/styles/animations.js")
        if (!animationsFile.exists()) return variants
        
        val content = FileUtils.readFileContent(animationsFile) ?: return variants
        
        val variantPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}")
        val variantsSectionPattern = Regex("ANIMATION_VARIANTS\\s*=\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}")
        
        variantsSectionPattern.findAll(content).forEach { sectionMatch ->
            val sectionContent = sectionMatch.groupValues[1]
            
            variantPattern.findAll(sectionContent).forEach { match ->
                val variantName = match.groupValues[1]
                val variantContent = match.groupValues[2].take(50)
                variants[variantName] = variantContent
            }
        }
        
        return variants
    }
    
    private fun compareCardAnimations() {
        Logger.info("Comparing card animations...")
        
        val rnCardConfig = extractRnCardAnimationConfig()
        val androidCardConfig = extractAndroidCardAnimationConfig()
        
        val cardProperties = listOf(
            "perspective" to "3D perspective value",
            "flipDuration" to "Card flip duration",
            "tiltMaxAngle" to "Maximum tilt angle",
            "cardWidth" to "Card width",
            "cardHeight" to "Card height",
            "fanAngle" to "Fan spread angle"
        )
        
        for ((propName, description) in cardProperties) {
            val rnValue = rnCardConfig[propName]
            val androidValue = androidCardConfig[propName]
            
            when {
                rnValue == null && androidValue == null -> {
                    continue
                }
                rnValue == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Animation/Card",
                            itemName = propName,
                            status = ComparisonStatus.MISSING_IN_RN,
                            rnValue = null,
                            androidValue = androidValue,
                            difference = "$description not found in RN",
                            priority = Priority.LOW
                        )
                    )
                }
                androidValue == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Animation/Card",
                            itemName = propName,
                            status = ComparisonStatus.MISSING_IN_ANDROID,
                            rnValue = rnValue,
                            androidValue = null,
                            difference = "$description not found in Android",
                            priority = Priority.MEDIUM,
                            suggestions = listOf("Add $propName to Android card animation config")
                        )
                    )
                }
                rnValue != androidValue -> {
                    results.add(
                        ComparisonResult(
                            category = "Animation/Card",
                            itemName = propName,
                            status = ComparisonStatus.MISMATCH,
                            rnValue = rnValue,
                            androidValue = androidValue,
                            difference = "$description values differ",
                            priority = Priority.LOW,
                            suggestions = listOf("Align $propName values")
                        )
                    )
                }
                else -> {
                    results.add(
                        ComparisonResult(
                            category = "Animation/Card",
                            itemName = propName,
                            status = ComparisonStatus.MATCH,
                            rnValue = rnValue,
                            androidValue = androidValue,
                            priority = Priority.LOW
                        )
                    )
                }
            }
        }
    }
    
    private fun extractRnCardAnimationConfig(): Map<String, String> {
        val config = mutableMapOf<String, String>()
        
        val animationsFile = File(rnProjectPath, "src/utils/animations.js")
        if (!animationsFile.exists()) return config
        
        val content = FileUtils.readFileContent(animationsFile) ?: return config
        
        val configPattern = Regex("CARD_3D_CONFIG\\s*=\\s*\\{([^}]+)\\}")
        val valuePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*([^,\\n]+)")
        
        configPattern.findAll(content).forEach { match ->
            val objectContent = match.groupValues[1]
            valuePattern.findAll(objectContent).forEach { valueMatch ->
                val name = valueMatch.groupValues[1]
                val value = valueMatch.groupValues[2].trim()
                config[name] = value
            }
        }
        
        return config
    }
    
    private fun extractAndroidCardAnimationConfig(): Map<String, String> {
        val config = mutableMapOf<String, String>()
        
        val animationFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/animation/AnimationUtils.kt")
        if (!animationFile.exists()) return config
        
        val content = FileUtils.readFileContent(animationFile) ?: return config
        
        if (content.contains("CardFlipAnimation")) {
            config["flipDuration"] = "400"
        }
        
        return config
    }
    
    private fun compareWeatherEffects() {
        Logger.info("Comparing weather effects...")
        
        val rnWeatherConfig = extractRnWeatherConfig()
        
        val weatherTypes = listOf("rain", "snow", "sun", "fog")
        
        for (weatherType in weatherTypes) {
            val hasRnConfig = rnWeatherConfig.containsKey(weatherType)
            
            results.add(
                ComparisonResult(
                    category = "Animation/Weather",
                    itemName = weatherType,
                    status = if (hasRnConfig) ComparisonStatus.MATCH else ComparisonStatus.MISSING_IN_RN,
                    rnValue = if (hasRnConfig) "Configured" else null,
                    androidValue = "Check WeatherEffect.kt",
                    priority = Priority.LOW,
                    suggestions = if (!hasRnConfig) {
                        listOf("Add $weatherType configuration to RN")
                    } else emptyList()
                )
            )
        }
    }
    
    private fun extractRnWeatherConfig(): Map<String, String> {
        val config = mutableMapOf<String, String>()
        
        val animationsFile = File(rnProjectPath, "src/utils/animations.js")
        if (!animationsFile.exists()) return config
        
        val content = FileUtils.readFileContent(animationsFile) ?: return config
        
        val weatherPattern = Regex("WEATHER_CONFIG\\s*=\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}")
        val typePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{")
        
        weatherPattern.findAll(content).forEach { match ->
            val sectionContent = match.groupValues[1]
            typePattern.findAll(sectionContent).forEach { typeMatch ->
                val typeName = typeMatch.groupValues[1]
                config[typeName] = "Configured"
            }
        }
        
        return config
    }
    
    private fun compareParticleEffects() {
        Logger.info("Comparing particle effects...")
        
        val rnParticleConfig = extractRnParticleConfig()
        
        val particleTypes = listOf("magic", "burst", "trail")
        
        for (particleType in particleTypes) {
            val hasRnConfig = rnParticleConfig.containsKey(particleType)
            
            results.add(
                ComparisonResult(
                    category = "Animation/Particles",
                    itemName = particleType,
                    status = if (hasRnConfig) ComparisonStatus.MATCH else ComparisonStatus.MISSING_IN_RN,
                    rnValue = if (hasRnConfig) "Configured" else null,
                    androidValue = "Check ParticleBackground.kt",
                    priority = Priority.LOW,
                    suggestions = if (!hasRnConfig) {
                        listOf("Add $particleType particle configuration")
                    } else emptyList()
                )
            )
        }
    }
    
    private fun extractRnParticleConfig(): Map<String, String> {
        val config = mutableMapOf<String, String>()
        
        val animationsFile = File(rnProjectPath, "src/utils/animations.js")
        if (!animationsFile.exists()) return config
        
        val content = FileUtils.readFileContent(animationsFile) ?: return config
        
        val particlePattern = Regex("PARTICLES_CONFIG\\s*=\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}")
        val typePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{")
        
        particlePattern.findAll(content).forEach { match ->
            val sectionContent = match.groupValues[1]
            typePattern.findAll(sectionContent).forEach { typeMatch ->
                val typeName = typeMatch.groupValues[1]
                config[typeName] = "Configured"
            }
        }
        
        return config
    }
    
    private fun compareTransitions() {
        Logger.info("Comparing transition animations...")
        
        val rnTransitions = extractRnTransitions()
        val androidTransitions = extractAndroidTransitions()
        
        val transitionTypes = listOf("slide", "scale", "fade", "sharedElement")
        
        for (transitionType in transitionTypes) {
            val hasRn = rnTransitions.containsKey(transitionType)
            val hasAndroid = androidTransitions.containsKey(transitionType)
            
            val status = when {
                hasRn && hasAndroid -> ComparisonStatus.MATCH
                hasRn && !hasAndroid -> ComparisonStatus.MISSING_IN_ANDROID
                !hasRn && hasAndroid -> ComparisonStatus.MISSING_IN_RN
                else -> ComparisonStatus.ERROR
            }
            
            results.add(
                ComparisonResult(
                    category = "Animation/Transitions",
                    itemName = transitionType,
                    status = status,
                    rnValue = if (hasRn) rnTransitions[transitionType] else null,
                    androidValue = if (hasAndroid) androidTransitions[transitionType] else null,
                    priority = Priority.MEDIUM,
                    suggestions = when (status) {
                        ComparisonStatus.MISSING_IN_ANDROID -> listOf("Add $transitionType transition to Android")
                        ComparisonStatus.MISSING_IN_RN -> listOf("Add $transitionType transition to RN")
                        else -> emptyList()
                    }
                )
            )
        }
    }
    
    private fun extractRnTransitions(): Map<String, String> {
        val transitions = mutableMapOf<String, String>()
        
        val animationsFile = File(rnProjectPath, "src/utils/animations.js")
        if (!animationsFile.exists()) return transitions
        
        val content = FileUtils.readFileContent(animationsFile) ?: return transitions
        
        val transitionPattern = Regex("TRANSITION_CONFIG\\s*=\\s*\\{([^}]+)\\}")
        val typePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{")
        
        transitionPattern.findAll(content).forEach { match ->
            val sectionContent = match.groupValues[1]
            typePattern.findAll(sectionContent).forEach { typeMatch ->
                val typeName = typeMatch.groupValues[1]
                transitions[typeName] = "Configured"
            }
        }
        
        return transitions
    }
    
    private fun extractAndroidTransitions(): Map<String, String> {
        val transitions = mutableMapOf<String, String>()
        
        val animationFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/animation/AnimationUtils.kt")
        if (!animationFile.exists()) return transitions
        
        val content = FileUtils.readFileContent(animationFile) ?: return transitions
        
        if (content.contains("slideIn") || content.contains("slideOut")) {
            transitions["slide"] = "Configured"
        }
        if (content.contains("scaleIn") || content.contains("scaleOut")) {
            transitions["scale"] = "Configured"
        }
        if (content.contains("fadeIn") || content.contains("fadeOut")) {
            transitions["fade"] = "Configured"
        }
        
        val pageTransitionsFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/animation/AnimationUtils.kt")
        if (pageTransitionsFile.exists()) {
            val pageContent = FileUtils.readFileContent(pageTransitionsFile) ?: return transitions
            if (pageContent.contains("PageTransitions")) {
                transitions["page"] = "Configured"
            }
        }
        
        return transitions
    }
    
    private fun compareMicroInteractions() {
        Logger.info("Comparing micro-interactions...")
        
        val rnMicroConfig = extractRnMicroInteractions()
        
        val interactionTypes = listOf("button", "card", "input")
        
        for (interactionType in interactionTypes) {
            val hasRnConfig = rnMicroConfig.containsKey(interactionType)
            
            results.add(
                ComparisonResult(
                    category = "Animation/MicroInteractions",
                    itemName = interactionType,
                    status = if (hasRnConfig) ComparisonStatus.MATCH else ComparisonStatus.MISSING_IN_ANDROID,
                    rnValue = if (hasRnConfig) "Configured" else null,
                    androidValue = "Check components",
                    priority = Priority.LOW,
                    suggestions = if (!hasRnConfig) {
                        listOf("Add $interactionType micro-interaction config")
                    } else emptyList()
                )
            )
        }
    }
    
    private fun extractRnMicroInteractions(): Map<String, String> {
        val config = mutableMapOf<String, String>()
        
        val animationsFile = File(rnProjectPath, "src/utils/animations.js")
        if (!animationsFile.exists()) return config
        
        val content = FileUtils.readFileContent(animationsFile) ?: return config
        
        val microPattern = Regex("MICRO_INTERACTION_CONFIG\\s*=\\s*\\{([^}]+)\\}")
        val typePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{")
        
        microPattern.findAll(content).forEach { match ->
            val sectionContent = match.groupValues[1]
            typePattern.findAll(sectionContent).forEach { typeMatch ->
                val typeName = typeMatch.groupValues[1]
                config[typeName] = "Configured"
            }
        }
        
        return config
    }
    
    fun getAnimationMappingReport(): Map<String, String> {
        return animationTypeMappings
    }
    
    fun getEasingMappingReport(): Map<String, String> {
        return easingMappings
    }
}

fun main() {
    val rnPath = "../lego-mobile"
    val androidPath = "."
    
    val comparator = AnimationComparator(rnPath, androidPath)
    val results = comparator.compare()
    
    println("\n=== Animation Comparison Report ===\n")
    
    val groupedByCategory = results.groupBy { it.category }
    groupedByCategory.forEach { (category, items) ->
        println("[$category]")
        val groupedByStatus = items.groupBy { it.status }
        groupedByStatus.forEach { (status, statusItems) ->
            println("  $status: ${statusItems.size} items")
            statusItems.take(3).forEach { item ->
                println("    - ${item.itemName}: ${item.difference ?: "OK"}")
            }
            if (statusItems.size > 3) {
                println("    ... and ${statusItems.size - 3} more")
            }
        }
        println()
    }
    
    val statistics = ReportStatistics(
        totalComparisons = results.size,
        matchCount = results.count { it.status == ComparisonStatus.MATCH },
        mismatchCount = results.count { it.status == ComparisonStatus.MISMATCH },
        missingInAndroidCount = results.count { it.status == ComparisonStatus.MISSING_IN_ANDROID },
        missingInRnCount = results.count { it.status == ComparisonStatus.MISSING_IN_RN },
        errorCount = results.count { it.status == ComparisonStatus.ERROR },
        highPriorityCount = results.count { it.priority == Priority.HIGH },
        mediumPriorityCount = results.count { it.priority == Priority.MEDIUM },
        lowPriorityCount = results.count { it.priority == Priority.LOW }
    )
    
    println("=== Statistics ===")
    println("Total: ${statistics.totalComparisons}")
    println("Matches: ${statistics.matchCount}")
    println("Mismatches: ${statistics.mismatchCount}")
    println("Missing in Android: ${statistics.missingInAndroidCount}")
    println("Missing in RN: ${statistics.missingInRnCount}")
}
