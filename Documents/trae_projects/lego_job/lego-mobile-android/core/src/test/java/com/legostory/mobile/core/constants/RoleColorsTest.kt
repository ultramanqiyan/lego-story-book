package com.legostory.mobile.core.constants

import org.junit.Test
import org.junit.Assert.*

class RoleColorsTest {
    
    @Test
    fun `test Protagonist colors`() {
        val protagonist = RoleColors.Protagonist
        assertNotNull("Protagonist should not be null", protagonist)
        assertNotNull("Protagonist background should not be null", protagonist.background)
        assertNotNull("Protagonist text should not be null", protagonist.text)
    }
    
    @Test
    fun `test Supporting colors`() {
        val supporting = RoleColors.Supporting
        assertNotNull("Supporting should not be null", supporting)
        assertNotNull("Supporting background should not be null", supporting.background)
        assertNotNull("Supporting text should not be null", supporting.text)
    }
    
    @Test
    fun `test Antagonist colors`() {
        val antagonist = RoleColors.Antagonist
        assertNotNull("Antagonist should not be null", antagonist)
        assertNotNull("Antagonist background should not be null", antagonist.background)
        assertNotNull("Antagonist text should not be null", antagonist.text)
    }
    
    @Test
    fun `test Bystander colors`() {
        val bystander = RoleColors.Bystander
        assertNotNull("Bystander should not be null", bystander)
        assertNotNull("Bystander background should not be null", bystander.background)
        assertNotNull("Bystander text should not be null", bystander.text)
    }
    
    @Test
    fun `test RoleColor data class`() {
        val roleColor = RoleColor(
            background = 0xFFFFF3E0,
            text = 0xFFE65100
        )
        assertEquals("Background should match", 0xFFFFF3E0, roleColor.background)
        assertEquals("Text should match", 0xFFE65100, roleColor.text)
    }
}
