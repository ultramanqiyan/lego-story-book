# React Native 开发经验总结

## 动画属性类型问题

### 问题描述
在React Native中，`rotate`、`rotateX`、`rotateY`等动画属性必须使用字符串格式（如`'0deg'`），而不是纯数字。

### 错误示例
```javascript
// ❌ 错误写法
const rotation = spreadAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 36],  // 输出数字
});
{ rotate: `${rotation}deg` }  // rotation是Animated.Value对象，模板字符串会变成 "[object Object]deg"

// ❌ 错误示例2
{ rotate: rotation + 'deg' }  // 同样会变成 "[object Object]deg"
```

### 正确写法
```javascript
// ✅ 正确写法
const rotate = spreadAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '36deg'],  // 直接输出字符串格式
});
{ rotate }  // 直接使用
```

### 错误信息
- Android: `For input string: "[object Object]"`
- Android: `ViewManager for tag xxx could not be found`

### 测试阶段发现能力

| 测试阶段 | 是否能发现 | 原因 |
|---------|-----------|------|
| 单元测试 | ❌ 不能 | 模拟环境不执行真实动画转换 |
| Expo Web | ❌ 不能 | Web使用CSS transform，处理更宽松 |
| Expo Go (真机) | ✅ 能 | 真机环境会执行原生动画 |
| APK构建 | ✅ 能 | 完整的原生环境 |

### 改进单元测试
```javascript
it('rotate属性应该是字符串格式', () => {
  const transform = card.props.style.transform;
  const rotateTransform = transform.find(t => t.rotate !== undefined);
  if (rotateTransform) {
    expect(typeof rotateTransform.rotate).toBe('string');
    expect(rotateTransform.rotate).toMatch(/\d+deg$/);
  }
});
```

### 推荐测试流程
1. 单元测试 (秒级) → 验证基本逻辑
2. Expo Web (秒级) → 验证UI布局
3. **Expo Go真机 (分钟级) → 验证原生动画** ⭐ 关键
4. APK构建 (分钟级) → 最终发布验证

---

## React Native Animated 动画规范

### transform属性类型要求

| 属性 | 类型要求 | 示例 |
|------|---------|------|
| rotate | 字符串 | `'0deg'`, `'45deg'` |
| rotateX | 字符串 | `'0deg'`, `'90deg'` |
| rotateY | 字符串 | `'0deg'`, `'180deg'` |
| scale | 数字 | `1`, `1.5` |
| translateX | 数字 | `0`, `100` |
| translateY | 数字 | `0`, `50` |
| perspective | 数字 | `1000` |

### interpolate使用规范
- `outputRange`的类型必须与目标属性类型匹配
- `rotate`类属性：`outputRange`必须是字符串数组
- `scale`/`translate`类属性：`outputRange`必须是数字数组

---

## 文档更新记录

- 2026-03-02: 添加动画属性类型问题总结
