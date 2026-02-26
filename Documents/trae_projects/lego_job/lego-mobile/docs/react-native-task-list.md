# React Native动画效果提升任务列表

## 任务概览
将demo.html中的增强动画效果应用到React Native移动端APP。

---

## 任务清单

### 阶段一：动画基础架构

- [ ] **TASK-RN-001**: 创建动画工具函数
  - bounceEasing, smoothEasing, enterEasing, exitEasing
  - 通用动画组件

- [ ] **TASK-RN-002**: 创建粒子系统组件
  - 多形状粒子（星形、菱形、圆形）
  - 发光效果和曲线轨迹
  - 闪烁动画

- [ ] **TASK-RN-003**: 创建天气效果组件
  - 晴天：太阳光芒旋转+光束扩散
  - 雨天：雨滴下落+随机闪电
  - 雪天：雪花旋转飘落+霜冻层

### 阶段二：Demo 1 登录页面

- [ ] **TASK-RN-004**: 标题彩虹光泽+弹跳入场
  - Animated.Text渐变效果
  - 弹跳缓动动画

- [ ] **TASK-RN-005**: 扇形卡牌飞入+旋转
  - Animated.spring弹性入场
  - 3D旋转效果（transform rotateX）
  - 错开延迟入场

- [ ] **TASK-RN-006**: 卡牌选中3D翻转+发光
  - Animated.parallel组合动画
  - 发光脉冲效果
  - 卡牌浮动动画

- [ ] **TASK-RN-007**: 属性宝石旋转发光
  - Animated.timing循环旋转
  - 呼吸效果

- [ ] **TASK-RN-008**: 开始按钮渐变边框+脉冲
  - Animated.View渐变背景
  - 脉冲发光+浮动动画

### 阶段三：Demo 2 主页

- [ ] **TASK-RN-009**: 欢迎卡片3D翻转入场
  - Animated.timing翻转动画
  - 内容逐行淡入

- [ ] **TASK-RN-010**: 角色卡片弹性滑入
  - Animated.spring弹性入场
  - 悬停上浮放大

- [ ] **TASK-RN-011**: 故事卡片入场动画
  - 底部滑入+淡入

### 阶段四：Demo 3 导演台

- [ ] **TASK-RN-012**: 舞台格子虚线流动
  - Animated.timing循环动画
  - 填充内容弹入

- [ ] **TASK-RN-013**: 卡牌选择弹性入场
  - Animated.spring入场
  - 选中上浮+发光

- [ ] **TASK-RN-014**: 晴天效果实现
  - 太阳核心脉冲
  - 8道光芒旋转
  - 光束扩散动画

- [ ] **TASK-RN-015**: 雨天效果实现
  - 80个雨滴下落
  - 拖尾效果
  - 随机闪电（每3秒）

- [ ] **TASK-RN-016**: 雪天效果实现
  - 50个雪花旋转飘落
  - 大小/透明度随机
  - 底部霜冻层

- [ ] **TASK-RN-017**: 底部操作栏动画
  - 需求指示器动画
  - 开拍按钮脉冲发光

### 阶段五：Demo 4 阅读页面

- [ ] **TASK-RN-018**: 章节标题弹跳入场
  - Animated.spring弹跳
  - 下划线展开动画

- [ ] **TASK-RN-019**: 段落文字逐段淡入
  - Animated.timing延迟淡入

- [ ] **TASK-RN-020**: 关键词闪烁浮动
  - Animated.timing循环闪烁
  - 浮动效果

- [ ] **TASK-RN-021**: 谜题卡片3D旋转入场
  - Animated.timing旋转滑入

- [ ] **TASK-RN-022**: 正确答案光芒爆发+星星
  - 绿色光芒脉冲
  - 星星粒子爆发

- [ ] **TASK-RN-023**: 错误答案震动
  - Animated.sequence震动动画

### 阶段六：Demo 5 收集页面

- [ ] **TASK-RN-024**: 卡牌网格中心扩散入场
  - Animated.spring弹性入场
  - 错开延迟

- [ ] **TASK-RN-025**: 选中放大+发光脉冲
  - Animated.spring放大
  - 发光脉冲

- [ ] **TASK-RN-026**: 详情面板底部弹性滑入
  - Animated.spring滑入
  - 内容依次出现

- [ ] **TASK-RN-027**: 新卡牌获得完整动画
  - 飞入+旋转+弹跳
  - 光芒爆发效果
  - 闪光扫过动画
  - 旋转彩虹边框
  - 粒子庆祝效果

### 阶段七：全局交互

- [ ] **TASK-RN-028**: 触摸涟漪效果
  - TouchableOpacity涟漪反馈
  - Animated.timing扩散动画

- [ ] **TASK-RN-029**: 背景光晕动画
  - 金色/紫色渐变光晕
  - 缓慢移动动画

- [ ] **TASK-RN-030**: 性能优化
  - useNativeDriver: true
  - 减少同时运行动画数量
  - 卸载时清理动画

---

## 优先级说明
- **P0（最高）**: TASK-RN-006, TASK-RN-014, TASK-RN-015, TASK-RN-016, TASK-RN-027 - 核心视觉亮点
- **P1（高）**: TASK-RN-001, TASK-RN-004, TASK-RN-008, TASK-RN-024 - 重要交互体验
- **P2（中）**: TASK-RN-009, TASK-RN-010, TASK-RN-018, TASK-RN-020 - 增强体验
- **P3（低）**: TASK-RN-002, TASK-RN-003, TASK-RN-011, TASK-RN-019 - 辅助效果
