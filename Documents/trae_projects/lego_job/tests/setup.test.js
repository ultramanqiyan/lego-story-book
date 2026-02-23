import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('环境配置测试 - 文件存在性', () => {
  it('package.json 应该存在', () => {
    const packagePath = path.join(process.cwd(), 'package.json');
    expect(fs.existsSync(packagePath)).toBe(true);
  });

  it('wrangler.toml 应该存在', () => {
    const wranglerPath = path.join(process.cwd(), 'wrangler.toml');
    expect(fs.existsSync(wranglerPath)).toBe(true);
  });

  it('vitest.config.js 应该存在', () => {
    const vitestPath = path.join(process.cwd(), 'vitest.config.js');
    expect(fs.existsSync(vitestPath)).toBe(true);
  });

  it('.eslintrc.cjs 应该存在', () => {
    const eslintPath = path.join(process.cwd(), '.eslintrc.cjs');
    expect(fs.existsSync(eslintPath)).toBe(true);
  });
});

describe('环境配置测试 - 目录存在性', () => {
  it('migrations 目录应该存在', () => {
    const migrationsPath = path.join(process.cwd(), 'migrations');
    expect(fs.existsSync(migrationsPath)).toBe(true);
  });

  it('functions/api 目录应该存在', () => {
    const apiPath = path.join(process.cwd(), 'functions', 'api');
    expect(fs.existsSync(apiPath)).toBe(true);
  });

  it('tests 目录应该存在', () => {
    const testsPath = path.join(process.cwd(), 'tests');
    expect(fs.existsSync(testsPath)).toBe(true);
  });
});

describe('环境配置测试 - package.json 内容', () => {
  it('package.json 应包含必要的脚本', () => {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    expect(packageContent.scripts).toBeDefined();
    expect(packageContent.scripts.test).toBeDefined();
    expect(packageContent.scripts['test:coverage']).toBeDefined();
    expect(packageContent.scripts.lint).toBeDefined();
  });

  it('package.json 应包含必要的依赖', () => {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    expect(packageContent.devDependencies).toBeDefined();
    expect(packageContent.devDependencies.vitest).toBeDefined();
    expect(packageContent.devDependencies.eslint).toBeDefined();
  });
});
