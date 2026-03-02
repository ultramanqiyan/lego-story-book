const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动测试环境...');

const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'lego-backend'),
  shell: true,
  stdio: 'inherit'
});

const frontend = spawn('npx', ['expo', 'start', '--web'], {
  cwd: path.join(__dirname, 'lego-mobile-game'),
  shell: true,
  stdio: 'inherit'
});

let backendReady = false;
let frontendReady = false;

backend.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Server running at')) {
    backendReady = true;
    console.log('✅ 后端服务已启动');
  }
});

frontend.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Local:') || output.includes('http://localhost:8082')) {
    frontendReady = true;
    console.log('✅ 前端服务已启动');
  }
});

setTimeout(() => {
  if (!backendReady) {
    console.log('⚠️ 后端服务启动超时');
  }
  if (!frontendReady) {
    console.log('⚠️ 前端服务启动超时');
  }
  
  if (backendReady && frontendReady) {
    console.log('🎯 服务已就绪，开始运行Playwright测试...');
    
    const playwright = spawn('npx', ['playwright', 'test'], {
      cwd: path.join(__dirname, 'lego-mobile-game'),
      shell: true,
      stdio: 'inherit'
    });
    
    playwright.on('close', (code) => {
      console.log(`\n📊 Playwright测试完成，退出码: ${code}`);
      
      backend.kill();
      frontend.kill();
      process.exit(code || 0);
    });
  } else {
    console.log('❌ 服务启动失败，终止进程');
    backend.kill();
    frontend.kill();
    process.exit(1);
  }
}, 30000);
