#!/usr/bin/env node
/**
 * Reanimated Style Checker
 * Scans useAnimatedStyle for unsupported properties
 * 
 * Unsupported properties in Reanimated native animated module:
 * - width, height
 * - margin*, padding*
 * - border*
 * - flex*, gap
 * - position, top, left, right, bottom (use transform instead)
 * - font*
 * - background*
 */

const fs = require('fs');
const path = require('path');

const UNSUPPORTED_PROPS = [
  'width', 'height', 
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical',
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingHorizontal', 'paddingVertical',
  'borderWidth', 'borderRadius', 'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth',
  'flex', 'flexDirection', 'flexWrap', 'flexGrow', 'flexShrink', 'flexBasis', 'gap',
  'top', 'left', 'right', 'bottom',
  'fontSize', 'fontFamily', 'fontWeight', 'fontStyle',
  'backgroundColor'
];

const SAFE_PROPS = [
  'transform', 'opacity', 'elevation', 'zIndex', 'shadowOpacity', 'shadowRadius', 'shadowOffset'
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Find all useAnimatedStyle calls
  const animatedStyleRegex = /useAnimatedStyle\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g;
  let match;
  
  while ((match = animatedStyleRegex.exec(content)) !== null) {
    const body = match[1];
    const returnMatch = body.match(/return\s*\{([\s\S]*?)\};/);
    
    if (returnMatch) {
      const returnBody = returnMatch[1];
      
      // Check for unsupported properties
      UNSUPPORTED_PROPS.forEach(prop => {
        const propRegex = new RegExp(`\\b${prop}\\s*:`, 'g');
        if (propRegex.test(returnBody)) {
          // Get line number
          const beforeMatch = content.substring(0, match.index);
          const lineNumber = beforeMatch.split('\n').length;
          
          issues.push({
            file: filePath,
            line: lineNumber,
            property: prop,
            message: `Property '${prop}' is not supported by native animated module`
          });
        }
      });
    }
  }
  
  return issues;
}

function scanDirectory(dir) {
  const issues = [];
  
  function walk(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git') {
          walk(filePath);
        }
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        const fileIssues = scanFile(filePath);
        issues.push(...fileIssues);
      }
    });
  }
  
  walk(dir);
  return issues;
}

// Run
const srcDir = path.join(__dirname, '..', 'src');
console.log('🔍 Scanning for unsupported Reanimated properties...\n');

const issues = scanDirectory(srcDir);

if (issues.length === 0) {
  console.log('✅ No issues found!');
  process.exit(0);
} else {
  console.log(`❌ Found ${issues.length} issue(s):\n`);
  
  issues.forEach(issue => {
    console.log(`  ${issue.file}:${issue.line}`);
    console.log(`    Property: ${issue.property}`);
    console.log(`    ${issue.message}`);
    console.log('');
  });
  
  process.exit(1);
}
