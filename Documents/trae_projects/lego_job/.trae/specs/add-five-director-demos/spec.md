# 五种卡牌展示风格 Demo Spec

## Why
当前首页只有一个3D卡牌演示按钮，需要新增5个不同风格的Demo导演页，展示5种截然不同的卡牌展示和堆叠方式，包括2D卡牌、3D卡牌、扇形展开、横向堆叠、纵向堆叠等，为用户提供丰富的视觉体验和交互方式。

## What Changes
- 在首页新增5个Demo导演页入口按钮
- 创建5个新的Demo页面组件（Demo6-Demo10）
- 每个Demo展示独特的卡牌样式和堆叠方式
- 所有开发遵循TDD原则，先写测试再写实现代码
- 确保所有调用的库函数真实存在且有效

## Impact
- Affected specs: 新增5个Demo页面规范
- Affected code: HomeScreen.js, DemoScreens.js
- 新增文件: 5个新的Demo页面组件及测试文件

## ADDED Requirements

### Requirement: Demo 6 - 2D卡牌网格
The system SHALL provide a 2D card grid display demo with traditional Hearthstone-style cards.

#### Scenario: Success case
- **WHEN** user clicks the "2D卡牌网格" button on home screen
- **THEN** a new demo page opens displaying 2D cards in a grid layout
- **AND** cards have flat design with rarity borders and hover effects
- **AND** clicking a card shows detailed information

### Requirement: Demo 7 - 3D翻转卡牌
The system SHALL provide a 3D flip card demo with perspective and flip animations.

#### Scenario: Success case
- **WHEN** user clicks the "3D翻转卡牌" button on home screen
- **THEN** a new demo page opens with 3D cards
- **AND** cards can be flipped with 3D rotation animation
- **AND** cards have depth and shadow effects

### Requirement: Demo 8 - 扇形展开卡牌
The system SHALL provide a fan-style card spread demo with card fan animation.

#### Scenario: Success case
- **WHEN** user clicks the "扇形展开卡牌" button on home screen
- **THEN** a new demo page opens with cards in fan arrangement
- **AND** cards fan out from center with rotation animation
- **AND** clicking a card expands it to show details

### Requirement: Demo 9 - 横向堆叠卡牌
The system SHALL provide a horizontal stacked card demo with horizontal scrolling and stacking effects.

#### Scenario: Success case
- **WHEN** user clicks the "横向堆叠卡牌" button on home screen
- **THEN** a new demo page opens with horizontally stacked cards
- **AND** cards can be swiped horizontally
- **AND** cards have parallax depth effect

### Requirement: Demo 10 - 纵向堆叠卡牌
The system SHALL provide a vertical stacked card demo with vertical stacking and card flip effects.

#### Scenario: Success case
- **WHEN** user clicks the "纵向堆叠卡牌" button on home screen
- **THEN** a new demo page opens with vertically stacked cards
- **AND** cards can be flipped to reveal next card
- **AND** top card has 3D perspective effect

## MODIFIED Requirements
### Requirement: HomeScreen Navigation
Update home screen to include 5 new demo entry buttons.

#### Scenario: Success case
- **WHEN** user opens home screen
- **THEN** user sees 6 demo buttons (existing 3D card demo + 5 new demos)
- **AND** all buttons are clearly labeled and accessible

## REMOVED Requirements
None
