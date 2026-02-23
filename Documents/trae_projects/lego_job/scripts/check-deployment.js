import fs from 'fs';
import path from 'path';

const errors = [];
const warnings = [];

function checkFileExists(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`缺少文件: ${filePath} (${description})`);
    return false;
  }
  return true;
}

function checkDirectoryExists(dirPath, description) {
  const fullPath = path.join(process.cwd(), dirPath);
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    errors.push(`缺少目录: ${dirPath} (${description})`);
    return false;
  }
  return true;
}

function checkNoWorkersAPI(content, filePath) {
  const workersPatterns = [
    /addEventListener\s*\(/,
    /self\.addEventListener/,
    /event\.respondWith/,
    /FetchEvent/
  ];
  
  for (const pattern of workersPatterns) {
    if (pattern.test(content)) {
      errors.push(`${filePath}: 检测到 Workers 特有 API，应使用 Page Functions`);
    }
  }
}

function checkNoNodeModules(content, filePath) {
  const nodePatterns = [
    /require\s*\(\s*['"]fs['"]\s*\)/,
    /require\s*\(\s*['"]path['"]\s*\)/,
    /require\s*\(\s*['"]http['"]\s*\)/,
    /from\s+['"]fs['"]/,
    /from\s+['"]path['"]/,
    /from\s+['"]http['"]/
  ];
  
  for (const pattern of nodePatterns) {
    if (pattern.test(content)) {
      errors.push(`${filePath}: 检测到 Node.js 特有模块，Page Functions 不支持`);
    }
  }
}

function checkNoDynamicRoutes(content, filePath) {
  const dynamicRoutePatterns = [
    /:id\b/,
    /:name\b/,
    /\[id\]/,
    /\[slug\]/
  ];
  
  for (const pattern of dynamicRoutePatterns) {
    if (pattern.test(content)) {
      warnings.push(`${filePath}: 可能存在动态路由参数，请确认使用静态路由`);
    }
  }
}

function checkNoHardcodedAPIKeys(content, filePath) {
  const apiKeyPatterns = [
    /api[_-]?key\s*[=:]\s*['"][a-zA-Z0-9]{20,}['"]/i,
    /secret[_-]?key\s*[=:]\s*['"][a-zA-Z0-9]{20,}['"]/i,
    /bearer\s+[a-zA-Z0-9]{20,}/i
  ];
  
  for (const pattern of apiKeyPatterns) {
    if (pattern.test(content)) {
      errors.push(`${filePath}: 检测到硬编码的 API Key，应使用环境变量`);
    }
  }
}

function checkFunctionExport(content, filePath) {
  const validExports = [
    /export\s+async\s+function\s+onRequest/,
    /export\s+function\s+onRequest/,
    /export\s+async\s+function\s+onRequestGet/,
    /export\s+async\s+function\s+onRequestPost/,
    /export\s+async\s+function\s+onRequestPut/,
    /export\s+async\s+function\s+onRequestDelete/
  ];
  
  const hasValidExport = validExports.some(pattern => pattern.test(content));
  if (!hasValidExport && content.includes('export')) {
    warnings.push(`${filePath}: Page Function 应导出 onRequest* 函数`);
  }
}

function checkSQLParameterized(content, filePath) {
  const unsafePatterns = [
    /\$\{[^}]+\}.*WHERE/i,
    /\+.*WHERE/i,
    /`.*\$\{.*\}.*`.*WHERE/i
  ];
  
  for (const pattern of unsafePatterns) {
    if (pattern.test(content)) {
      warnings.push(`${filePath}: 可能存在 SQL 注入风险，请使用参数化查询`);
    }
  }
}

console.log('=== Cloudflare Pages 部署规范检查 ===\n');

console.log('1. 检查项目结构...');
checkDirectoryExists('functions', 'Page Functions 目录');
checkDirectoryExists('functions/api', 'API 目录');
checkFileExists('wrangler.toml', 'Cloudflare 配置文件');
checkFileExists('package.json', '项目配置文件');

console.log('2. 检查静态页面文件...');
const htmlFiles = [
  'index.html', 'login.html', 'story-create.html', 'bookshelf.html',
  'book.html', 'characters.html', 'adventure.html', 'parent.html', 'share.html'
];
htmlFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`  ✓ 找到页面: ${file}`);
  } else {
    warnings.push(`缺少页面文件: ${file}`);
  }
});

console.log('3. 检查 Page Functions...');
const functionsDir = path.join(process.cwd(), 'functions');
if (fs.existsSync(functionsDir)) {
  const apiDir = path.join(functionsDir, 'api');
  if (fs.existsSync(apiDir)) {
    const jsFiles = fs.readdirSync(apiDir).filter(f => f.endsWith('.js'));
    jsFiles.forEach(file => {
      const filePath = path.join(apiDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`  检查: functions/api/${file}`);
      checkNoWorkersAPI(content, `functions/api/${file}`);
      checkNoNodeModules(content, `functions/api/${file}`);
      checkNoDynamicRoutes(content, `functions/api/${file}`);
      checkNoHardcodedAPIKeys(content, `functions/api/${file}`);
      checkFunctionExport(content, `functions/api/${file}`);
      checkSQLParameterized(content, `functions/api/${file}`);
    });
  }
}

console.log('4. 检查 wrangler.toml 配置...');
const wranglerPath = path.join(process.cwd(), 'wrangler.toml');
if (fs.existsSync(wranglerPath)) {
  const wranglerContent = fs.readFileSync(wranglerPath, 'utf8');
  
  if (!wranglerContent.includes('d1_databases')) {
    errors.push('wrangler.toml: 缺少 D1 数据库配置');
  } else {
    console.log('  ✓ D1 数据库已配置');
  }
  
  if (wranglerContent.includes('workers')) {
    errors.push('wrangler.toml: 不应包含 Workers 配置');
  }
}

console.log('5. 检查环境变量配置...');
const envExamplePath = path.join(process.cwd(), '.env.example');
if (fs.existsSync(envExamplePath)) {
  console.log('  ✓ 找到 .env.example 文件');
} else {
  warnings.push('缺少 .env.example 环境变量模板文件');
}

const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('  ✓ 找到 .env.local 文件');
} else {
  console.log('  ! 未找到 .env.local 文件（生产环境需要配置）');
}

console.log('\n=== 检查结果 ===\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ 所有检查通过！\n');
  process.exit(0);
}

if (warnings.length > 0) {
  console.log('⚠️  警告:');
  warnings.forEach(w => console.log(`  - ${w}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ 错误:');
  errors.forEach(e => console.log(`  - ${e}`));
  console.log('\n请修复以上错误后再部署。\n');
  process.exit(1);
}

console.log('✅ 检查通过（有警告）\n');
process.exit(0);
