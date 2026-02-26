# 移动端功能缺失反思规范

## Why

通过对比网页端和移动端的功能实现，发现移动端存在大量功能缺失。本规范旨在深入分析这些功能缺失的根本原因，并通过苏格拉底式提问反思开发流程中的问题，避免未来重复出现类似情况。

## What Changes

- 扫描网页端代码功能实现
- 对比APP端UI功能实现
- 形成功能缺失清单文档
- 创建苏格拉底式反思文档

## Impact

- Affected specs: mobile-feature-parity
- Affected code: 仅扫描分析，不修改代码

---

## 分析范围

### 网页端代码扫描范围
- `src/components/` - 所有UI组件
- `src/pages/` - 所有页面组件
- `src/hooks/` - 自定义Hooks
- `src/utils/` - 工具函数

### APP端代码扫描范围
- `lego-mobile/src/screens/` - 所有屏幕组件
- `lego-mobile/src/components/` - 所有UI组件
- `lego-mobile/src/utils/` - 工具函数
- `lego-mobile/src/api/` - API调用层

---

## 输出文档

### 1. 功能缺失清单 (gap-analysis.md)
详细列出网页端有但APP端缺失的功能

### 2. 苏格拉底式反思文档 (socratic-reflection.md)
通过连续提问深入分析功能缺失的根本原因
