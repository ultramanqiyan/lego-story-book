# 故事导演页技术文档

## 1. 技术栈概览

### 1.1 核心框架

| 框架/库 | 版本 | 用途 |
|---------|------|------|
| React | 18.2.0 | UI框架 |
| React Native | 0.74.5 | 跨平台移动应用框架 |
| Expo | ~51.0.0 | React Native开发工具链 |
| TypeScript | ^5.3.0 | 类型安全 |

### 1.2 动画相关库

| 库 | 版本 | 用途 |
|----|------|------|
| react-native-reanimated | ^3.10.0 | 高性能动画库 |
| react-native-gesture-handler | ^2.16.1 | 手势处理 |
| @react-three/fiber | ^8.15.0 | React Three.js渲染器 |
| @react-three/drei | ^9.88.0 | Three.js实用工具集 |
| three | ^0.158.0 | 3D图形库 |

### 1.3 测试相关库

| 库 | 版本 | 用途 |
|----|------|------|
| Jest | ^30.2.0 | 单元测试框架 |
| @testing-library/react-native | ^13.3.3 | React Native测试工具 |
| WebdriverIO | ^9.24.0 | E2E测试框架 |
| Playwright | - | E2E测试框架 |

### 1.4 构建工具

| 工具 | 版本 | 用途 |
|------|------|------|
| Babel | ^7.24.0 | JavaScript编译器 |
| Metro | ~3.2.3 | React Native打包器 |
| Gradle | 8.8 | Android构建工具 |

---

## 2. 动画实现方案

### 2.1 React Native Reanimated 3.x

#### 核心API使用

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

// Shared Value - 驱动动画的值
const opacity = useSharedValue(0);
const scale = useSharedValue(1);
const translateX = useSharedValue(0);

// Animated Style - 样式绑定
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [
    { scale: scale.value },
    { translateX: translateX.value },
  ],
}));

// 动画配置
opacity.value = withTiming(1, {
  duration: 300,
  easing: Easing.out(Easing.cubic),
});

scale.value = withSpring(1, {
  damping: 15,
  stiffness: 150,
});
```

#### 支持的动画属性

| 属性 | useNativeDriver支持 | 说明 |
|------|---------------------|------|
| opacity | ✅ | 透明度 |
| transform | ✅ | 变换（translate, scale, rotate） |
| width | ❌ | 宽度（需使用transform: scaleX替代） |
| height | ❌ | 高度（需使用transform: scaleY替代） |
| margin | ❌ | 外边距 |
| padding | ❌ | 内边距 |
| backgroundColor | ❌ | 背景色 |

#### 动画类型

1. **Timing动画** - 线性/缓动动画
```typescript
withTiming(toValue, {
  duration: 300,
  easing: Easing.out(Easing.cubic),
});
```

2. **Spring动画** - 物理弹性动画
```typescript
withSpring(toValue, {
  damping: 15,
  stiffness: 150,
  mass: 1,
});
```

3. **循环动画** - 重复播放
```typescript
withRepeat(
  withTiming(toValue, { duration: 1000 }),
  -1, // -1表示无限循环
  true // 是否反向播放
);
```

4. **序列动画** - 按顺序播放
```typescript
withSequence(
  withTiming(value1, { duration: 200 }),
  withSpring(value2),
);
```

5. **延迟动画** - 延迟执行
```typescript
withDelay(500, withTiming(toValue));
```

### 2.2 手势处理

```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan()
  .onUpdate((e) => {
    translateX.value = e.translationX;
    translateY.value = e.translationY;
  })
  .onEnd(() => {
    // 回弹动画
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  });

const tapGesture = Gesture.Tap()
  .onEnd(() => {
    scale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
  });

// 组合手势
const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);
```

### 2.3 3D动画（Three.js）

```typescript
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';

function Model() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta;
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
```

---

## 3. iOS兼容性

### 3.1 已知兼容性问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| useNativeDriver限制 | iOS原生动画驱动限制 | 仅使用opacity和transform属性 |
| Hermes引擎差异 | JS引擎实现差异 | 使用Polyfill或条件渲染 |
| 手势冲突 | iOS手势优先级 | 使用GestureDetector包裹 |
| 阴影性能 | iOS阴影渲染开销 | 使用图片替代或减少阴影 |
| 状态栏高度 | 刘海屏适配 | 使用SafeAreaView |

### 3.2 iOS特定配置

```typescript
// app.json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.legostory.demo",
      "infoPlist": {
        "UIStatusBarHidden": false,
        "UIViewControllerBasedStatusBarAppearance": true
      }
    }
  }
}
```

### 3.3 安全区域适配

```typescript
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function MyComponent() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      {/* 内容 */}
    </View>
  );
}
```

### 3.4 iOS动画性能优化

```typescript
// 使用原生驱动
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [{ scale: scale.value }],
}), []);

// 避免在动画中使用JS线程
// 错误示例
const animatedStyle = useAnimatedStyle(() => {
  runOnJS(someJSFunction)(); // 避免在动画中调用JS函数
  return { opacity: opacity.value };
});

// 正确示例 - 动画结束后调用
opacity.value = withTiming(1, {}, (finished) => {
  if (finished) {
    runOnJS(someJSFunction)();
  }
});
```

---

## 4. 性能优化方案

### 4.1 动画性能优化

#### 4.1.1 使用原生驱动

```typescript
// ✅ 正确 - 使用原生支持的属性
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [
    { translateX: translateX.value },
    { scale: scale.value },
    { rotate: `${rotate.value}deg` },
  ],
}));

// ❌ 错误 - 使用原生不支持的属性
const animatedStyle = useAnimatedStyle(() => ({
  width: width.value, // 不支持
  backgroundColor: color.value, // 不支持
}));
```

#### 4.1.2 减少动画对象数量

```typescript
// ❌ 错误 - 每个元素都有独立动画
{items.map(item => (
  <Animated.View key={item.id} style={useAnimatedStyle(...)}>
    <Text>{item.name}</Text>
  </Animated.View>
))}

// ✅ 正确 - 共享动画值
const sharedOpacity = useSharedValue(0);
const sharedStyle = useAnimatedStyle(() => ({
  opacity: sharedOpacity.value,
}));

{items.map(item => (
  <Animated.View key={item.id} style={sharedStyle}>
    <Text>{item.name}</Text>
  </Animated.View>
))}
```

#### 4.1.3 使用InteractionManager

```typescript
import { InteractionManager } from 'react-native';

useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    // 在动画完成后执行重计算
    startHeavyAnimation();
  });
  
  return () => task.cancel();
}, []);
```

### 4.2 渲染性能优化

#### 4.2.1 使用React.memo

```typescript
const StyleCard = React.memo(({ style, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{style.name}</Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.style.id === nextProps.style.id &&
         prevProps.onPress === nextProps.onPress;
});
```

#### 4.2.2 使用useCallback和useMemo

```typescript
// 缓存回调函数
const handlePress = useCallback((id: string) => {
  setSelectedStyle(id);
}, []);

// 缓存计算结果
const filteredStyles = useMemo(() => {
  return styles.filter(s => s.active);
}, [styles]);

// 缓存样式对象
const cardStyle = useMemo(() => ({
  backgroundColor: style.color,
  borderRadius: 12,
}), [style.color]);
```

#### 4.2.3 虚拟列表

```typescript
import { FlatList } from 'react-native';

const renderItem = useCallback(({ item }) => (
  <StyleCard style={item} onPress={handlePress} />
), [handlePress]);

const keyExtractor = useCallback((item) => item.id, []);

<FlatList
  data={styles}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  })}
/>
```

### 4.3 内存优化

#### 4.3.1 清理动画

```typescript
useEffect(() => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  
  return () => {
    // 动画值会自动清理，但需要取消动画
    cancelAnimation(opacity);
    cancelAnimation(scale);
  };
}, []);
```

#### 4.3.2 图片优化

```typescript
import { Image } from 'react-native';

// 使用缓存
<Image
  source={{ uri: imageUrl, cache: 'force-cache' }}
  resizeMode="contain"
  fadeDuration={0}
/>

// 预加载图片
Image.prefetch(imageUrl);
```

### 4.4 性能监控

```typescript
import { PerformanceObserver } from 'react-native-performance';

// 监控FPS
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log('FPS:', entry.fps);
    if (entry.fps < 60) {
      console.warn('FPS dropped below 60');
    }
  });
});

observer.observe({ entryTypes: ['measure'] });
```

---

## 5. 组件化重构方案

### 5.1 当前架构问题

```
当前结构：
├── App.tsx (过于庞大，包含所有页面状态管理)
├── src/
│   └── screens/
│       ├── StoryDirectorDemo.tsx (包含所有风格渲染逻辑)
│       ├── UIStyleListScreen.tsx
│       └── styles/
│           ├── SideScrollerGameStyle.tsx
│           ├── PixelBlockStyle.tsx
│           ├── MovieFilmStyle.tsx
│           └── HandDrawnStyle.tsx
```

### 5.2 目标架构

```
目标结构：
├── App.tsx (仅负责路由和全局Provider)
├── src/
│   ├── components/           # 通用组件
│   │   ├── common/          # 基础组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── animated/        # 动画组件
│   │   │   ├── FadeInView.tsx
│   │   │   ├── ScaleButton.tsx
│   │   │   ├── SlideInView.tsx
│   │   │   └── index.ts
│   │   └── layout/          # 布局组件
│   │       ├── SafeAreaContainer.tsx
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── index.ts
│   │
│   ├── features/            # 功能模块
│   │   ├── story-director/  # 故事导演模块
│   │   │   ├── components/
│   │   │   │   ├── CharacterSelector.tsx
│   │   │   │   ├── WeatherSelector.tsx
│   │   │   │   ├── MapSelector.tsx
│   │   │   │   ├── ItemSelector.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useStoryState.ts
│   │   │   │   ├── useAnimations.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   └── ui-styles/       # UI风格模块
│   │       ├── components/
│   │       │   ├── StyleCard.tsx
│   │       │   ├── StyleList.tsx
│   │       │   └── index.ts
│   │       ├── screens/
│   │       │   ├── UIStyleListScreen.tsx
│   │       │   └── index.ts
│   │       ├── styles/
│   │       │   ├── BaseStyle.tsx
│   │       │   ├── SideScrollerGameStyle.tsx
│   │       │   ├── PixelBlockStyle.tsx
│   │       │   ├── MovieFilmStyle.tsx
│   │       │   ├── HandDrawnStyle.tsx
│   │       │   └── index.ts
│   │       └── index.ts
│   │
│   ├── hooks/               # 全局Hooks
│   │   ├── useNavigation.ts
│   │   ├── useTheme.ts
│   │   └── index.ts
│   │
│   ├── context/             # 全局Context
│   │   ├── NavigationContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   │
│   ├── types/               # 全局类型
│   │   ├── navigation.ts
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── utils/               # 工具函数
│   │   ├── animations.ts
│   │   ├── helpers.ts
│   │   └── index.ts
│   │
│   ├── constants/           # 常量
│   │   ├── colors.ts
│   │   ├── dimensions.ts
│   │   └── index.ts
│   │
│   └── navigation/          # 导航配置
│       ├── types.ts
│       ├── useAppNavigation.ts
│       └── index.ts
```

### 5.3 重构步骤

#### 第一阶段：提取通用组件

1. 创建 `src/components/common/` 目录
2. 提取 Button、Card、Modal 等基础组件
3. 创建统一的组件API和Props类型

#### 第二阶段：提取动画组件

1. 创建 `src/components/animated/` 目录
2. 封装常用动画效果（淡入、缩放、滑动等）
3. 创建动画配置预设

#### 第三阶段：功能模块化

1. 创建 `src/features/story-director/` 模块
2. 提取角色选择器、天气选择器等组件
3. 创建模块专用的Hooks和Types

#### 第四阶段：导航重构

1. 引入React Navigation或保持状态导航
2. 创建 `src/navigation/` 目录
3. 实现类型安全的导航

#### 第五阶段：状态管理优化

1. 评估是否需要引入Redux/Zustand
2. 创建 `src/context/` 或 `src/store/`
3. 实现全局状态管理

### 5.4 组件设计原则

#### 5.4.1 单一职责原则

```typescript
// ❌ 错误 - 组件职责过多
function StylePage() {
  // 包含数据获取、状态管理、UI渲染、动画
}

// ✅ 正确 - 职责分离
function StylePage() {
  const { data, loading } = useStyleData();  // 数据获取
  const { selected, select } = useStyleSelection();  // 状态管理
  return <StylePageUI data={data} onSelect={select} />;  // UI渲染
}
```

#### 5.4.2 组合优于继承

```typescript
// ✅ 使用组合
function StyleCard({ style, variant, children }) {
  return (
    <Card variant={variant}>
      <StyleHeader style={style} />
      <StyleContent>{children}</StyleContent>
      <StyleFooter style={style} />
    </Card>
  );
}
```

#### 5.4.3 Props设计

```typescript
interface StyleCardProps {
  // 必需属性
  style: StyleType;
  
  // 可选属性
  variant?: 'default' | 'compact';
  onPress?: () => void;
  selected?: boolean;
  
  // 子元素
  children?: React.ReactNode;
  
  // 样式覆盖
  containerStyle?: StyleProp<ViewStyle>;
}
```

### 5.5 代码规范

#### 5.5.1 文件命名

- 组件文件：PascalCase (如 `StyleCard.tsx`)
- 工具文件：camelCase (如 `animations.ts`)
- 常量文件：camelCase (如 `colors.ts`)
- 类型文件：camelCase (如 `types.ts`)

#### 5.5.2 导出规范

```typescript
// components/index.ts
export { Button } from './Button';
export { Card } from './Card';
export type { ButtonProps } from './Button';
export type { CardProps } from './Card';
```

#### 5.5.3 类型定义

```typescript
// types.ts
export interface StyleType {
  id: string;
  name: string;
  color: string;
  route: string;
}

export type StyleVariant = 'default' | 'compact' | 'large';

export interface StyleSelectorProps {
  styles: StyleType[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  variant?: StyleVariant;
}
```

---

## 6. 后续优化计划

### 6.1 短期优化（1-2周）

1. **动画性能优化**
   - 审查所有动画使用useNativeDriver
   - 减少动画对象数量
   - 添加性能监控

2. **组件拆分**
   - 提取通用UI组件
   - 创建动画组件库
   - 统一样式系统

3. **iOS适配**
   - 测试iOS设备兼容性
   - 修复已知问题
   - 优化刘海屏适配

### 6.2 中期优化（1-2月）

1. **架构重构**
   - 实现模块化架构
   - 引入导航库
   - 优化状态管理

2. **性能优化**
   - 实现虚拟列表
   - 图片懒加载
   - 内存优化

3. **测试覆盖**
   - 单元测试覆盖率达到80%
   - E2E测试覆盖核心流程

### 6.3 长期优化（3-6月）

1. **技术升级**
   - 升级React Native版本
   - 升级Reanimated版本
   - 引入新特性

2. **性能极致优化**
   - 实现细粒度更新
   - 优化渲染性能
   - 减少包体积

3. **开发体验优化**
   - 完善开发工具
   - 自动化测试流程
   - 文档完善

---

## 7. 参考资源

### 7.1 官方文档

- [React Native](https://reactnative.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [Expo](https://docs.expo.dev/)
- [Three.js](https://threejs.org/docs/)

### 7.2 性能优化

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Reanimated Performance](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance)
- [React Native Optimization](https://callstack.com/blog/react-native-optimization/)

### 7.3 最佳实践

- [React Native Best Practices](https://github.com/kadirahq/react-native-best-practices)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React Performance](https://react.dev/learn/render-and-commit)

---

*文档版本: 1.0*
*最后更新: 2026-03-06*
*作者: AI Assistant*
