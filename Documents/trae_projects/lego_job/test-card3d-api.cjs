/**
 * 自动化测试：检查 Card3D 和 CardDeck3D 的 API 一致性
 * 以及所有使用点的正确性
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'lego-mobile/src');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 读取文件内容
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

// 递归查找所有 JS 文件
function findJsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !item.includes('node_modules')) {
      findJsFiles(fullPath, files);
    } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.jsx'))) {
      files.push(fullPath);
    }
  }
  return files;
}

// 检查 Card3D 的 props 定义
function checkCard3DProps() {
  log('\n=== 检查 Card3D 组件 props 定义 ===', 'blue');
  const card3DPath = path.join(SRC_DIR, 'components/card3d/Card3D.js');
  const content = readFile(card3DPath);
  
  if (!content) {
    log('❌ 无法读取 Card3D.js', 'red');
    return null;
  }

  // 提取 props 定义
  const propsMatch = content.match(/const Card3D = \(\{([^}]+)\}\)/s);
  if (propsMatch) {
    const props = propsMatch[1].split(',').map(p => p.trim().split('=')[0].trim());
    log(`✓ Card3D props: ${props.join(', ')}`, 'green');
    
    // 检查是否有 onPress
    if (props.includes('onPress')) {
      log('✓ Card3D 使用 onPress', 'green');
      return { onPress: true };
    } else if (props.includes('onSelect')) {
      log('⚠ Card3D 使用 onSelect（建议改为 onPress）', 'yellow');
      return { onSelect: true };
    }
  }
  return null;
}

// 检查 CardDeck3D 的 props 定义
function checkCardDeck3DProps() {
  log('\n=== 检查 CardDeck3D 组件 props 定义 ===', 'blue');
  const cardDeck3DPath = path.join(SRC_DIR, 'components/card3d/CardDeck3D.js');
  const content = readFile(cardDeck3DPath);
  
  if (!content) {
    log('❌ 无法读取 CardDeck3D.js', 'red');
    return null;
  }

  // 提取 props 定义
  const propsMatch = content.match(/const CardDeck3D = \(\{([^}]+)\}\)/s);
  if (propsMatch) {
    const props = propsMatch[1].split(',').map(p => p.trim().split('=')[0].trim());
    log(`✓ CardDeck3D props: ${props.join(', ')}`, 'green');
    
    // 检查是否有 onPress
    if (props.includes('onPress')) {
      log('✓ CardDeck3D 使用 onPress', 'green');
      return { onPress: true };
    } else if (props.includes('onSelect')) {
      log('⚠ CardDeck3D 使用 onSelect（建议改为 onPress）', 'yellow');
      return { onSelect: true };
    }
  }
  return null;
}

// 检查所有使用 Card3D/CardDeck3D 的文件
function checkUsage() {
  log('\n=== 检查所有 Card3D/CardDeck3D 使用点 ===', 'blue');
  
  const files = findJsFiles(SRC_DIR);
  const results = [];
  
  for (const file of files) {
    const content = readFile(file);
    if (!content) continue;
    
    // 检查是否使用了 Card3D 或 CardDeck3D
    if (content.includes('Card3D') || content.includes('CardDeck3D')) {
      const relativePath = path.relative(SRC_DIR, file);
      
      // 检查 onPress 和 onSelect 的使用
      const hasOnPress = content.includes('onPress');
      const hasOnSelect = content.includes('onSelect');
      
      // 检查是否是组件定义文件
      const isComponentFile = relativePath.includes('components/card3d');
      
      if (!isComponentFile && (hasOnPress || hasOnSelect)) {
        results.push({
          file: relativePath,
          hasOnPress,
          hasOnSelect
        });
      }
    }
  }
  
  return results;
}

// 检查 CardDeck3D 内部如何调用 Card3D
function checkCardDeck3DInternal() {
  log('\n=== 检查 CardDeck3D 内部调用 Card3D ===', 'blue');
  const cardDeck3DPath = path.join(SRC_DIR, 'components/card3d/CardDeck3D.js');
  const content = readFile(cardDeck3DPath);
  
  if (!content) {
    log('❌ 无法读取 CardDeck3D.js', 'red');
    return null;
  }

  // 查找 Card3D 的使用
  const card3DUsages = content.match(/<Card3D[^>]*>/g);
  if (card3DUsages) {
    log(`找到 ${card3DUsages.length} 处 Card3D 调用:`, 'green');
    card3DUsages.forEach((usage, i) => {
      log(`  ${i + 1}. ${usage}`, 'yellow');
      
      // 检查使用的是 onPress 还是 onSelect
      if (usage.includes('onPress')) {
        log(`     ✓ 使用 onPress`, 'green');
      } else if (usage.includes('onSelect')) {
        log(`     ⚠ 使用 onSelect`, 'yellow');
      }
    });
  }
  
  return card3DUsages;
}

// 主测试函数
function runTests() {
  log('========================================', 'blue');
  log('Card3D/CardDeck3D API 一致性测试', 'blue');
  log('========================================', 'blue');
  
  // 1. 检查 Card3D props
  const card3DProps = checkCard3DProps();
  
  // 2. 检查 CardDeck3D props
  const cardDeck3DProps = checkCardDeck3DProps();
  
  // 3. 检查 CardDeck3D 内部调用
  const internalUsages = checkCardDeck3DInternal();
  
  // 4. 检查所有使用点
  const usages = checkUsage();
  
  log('\n=== 使用点汇总 ===', 'blue');
  for (const usage of usages) {
    const status = usage.hasOnPress && !usage.hasOnSelect ? '✓' : 
                   !usage.hasOnPress && usage.hasOnSelect ? '⚠' : '?';
    const color = usage.hasOnPress && !usage.hasOnSelect ? 'green' : 
                  !usage.hasOnPress && usage.hasOnSelect ? 'yellow' : 'red';
    log(`${status} ${usage.file}: onPress=${usage.hasOnPress}, onSelect=${usage.hasOnSelect}`, color);
  }
  
  // 5. 检查一致性
  log('\n=== API 一致性检查 ===', 'blue');
  
  if (card3DProps && cardDeck3DProps) {
    if (card3DProps.onPress && cardDeck3DProps.onPress) {
      log('✓ Card3D 和 CardDeck3D 都使用 onPress，API 一致', 'green');
    } else if (card3DProps.onSelect && cardDeck3DProps.onSelect) {
      log('✓ Card3D 和 CardDeck3D 都使用 onSelect，API 一致', 'green');
    } else {
      log('❌ API 不一致！', 'red');
      if (card3DProps.onPress) {
        log('  Card3D 使用 onPress', 'green');
      } else {
        log('  Card3D 使用 onSelect', 'yellow');
      }
      if (cardDeck3DProps.onPress) {
        log('  CardDeck3D 使用 onPress', 'green');
      } else {
        log('  CardDeck3D 使用 onSelect', 'yellow');
      }
    }
  }
  
  // 6. 检查使用点是否匹配
  log('\n=== 使用点 API 匹配检查 ===', 'blue');
  const expectedProp = cardDeck3DProps?.onPress ? 'onPress' : 'onSelect';
  
  for (const usage of usages) {
    if (usage.file.includes('StoryDirectorScreen') || usage.file.includes('Card3DDemo')) {
      if (expectedProp === 'onPress' && usage.hasOnSelect && !usage.hasOnPress) {
        log(`❌ ${usage.file}: 应该使用 onPress 但使用了 onSelect`, 'red');
      } else if (expectedProp === 'onSelect' && usage.hasOnPress && !usage.hasOnSelect) {
        log(`❌ ${usage.file}: 应该使用 onSelect 但使用了 onPress`, 'red');
      } else {
        log(`✓ ${usage.file}: API 匹配`, 'green');
      }
    }
  }
  
  log('\n========================================', 'blue');
  log('测试完成', 'blue');
  log('========================================', 'blue');
}

runTests();
