# CSS 模块化架构

## 📁 文件结构

```
css/
├── main.css         # 主样式文件（导入所有模块）
├── variables.css    # CSS变量和基础样式
├── layout.css       # 布局相关样式
├── messages.css     # 消息气泡样式
├── inputs.css       # 输入框和按钮样式
├── mobile.css       # 移动端响应式样式
└── README.md        # 说明文档
```

## 🎨 主要优化

### 1. 配色方案优化
- **全新柔和蓝绿色系**: 统一使用柔和的蓝绿色调，营造信任和安全感
- **左侧气泡**: 柔和蓝灰色系 `#F1F8FD` → `#E8F4F8`
- **右侧气泡**: 协调的蓝绿渐变 `#4FC3F7` → `#26A69A`
- **加密消息**: 统一的蓝绿色调
  - 左侧加密消息: 淡绿蓝色系 `#E8F8F5`
  - 右侧加密消息: 统一蓝绿色系 `rgba(38, 166, 154, 0.12)`
- **增强对比度**: 确保所有文字在背景上都有良好的可读性

### 2. 模块化架构
- **variables.css**: 统一的设计token系统
- **layout.css**: 页面布局和容器样式
- **messages.css**: 消息气泡的所有样式
- **inputs.css**: 输入框、按钮和表单元素
- **mobile.css**: 移动端特定样式

### 3. 设计系统
- **颜色系统**: 完整的灰色阶和主题色
- **间距系统**: 统一的spacing token
- **字体系统**: 字号和行高的标准化
- **阴影系统**: 三级阴影深度
- **动画系统**: 统一的过渡效果

## 🚀 使用方法

### 引入样式
```html
<link rel="stylesheet" href="css/main.css">
```

### 使用CSS变量
```css
.custom-element {
    background: var(--primary-color);
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-light);
}
```

### 工具类
```html
<div class="d-flex justify-between align-center p-3 rounded shadow-light">
    <span class="text-primary">主要内容</span>
    <button class="bg-success text-white rounded-small">按钮</button>
</div>
```

## 🎯 关键改进

### 加密消息配色
- **问题**: 原来的加密消息配色不统一，视觉不协调
- **解决**: 
  - 采用统一的蓝绿色调系统
  - 左侧气泡: 淡绿蓝色系，与整体主题协调
  - 右侧气泡: 使用与气泡一致的蓝绿色系背景
  - 整体营造信任和安全感

### 响应式设计
- **桌面端**: 优雅的渐变和阴影效果
- **移动端**: 简化的设计，更好的触控体验
- **自适应**: 断点在768px，确保各种设备的良好体验

### 可维护性
- **模块化**: 每个功能独立的CSS文件
- **变量系统**: 统一的设计token
- **工具类**: 常用样式的快速应用

## 🔧 自定义配置

### 修改主题色
```css
:root {
    --primary-color: #your-color;
    --primary-dark: #your-dark-color;
}
```

### 调整间距
```css
:root {
    --spacing-base: 16px; /* 基础间距 */
}
```

### 修改断点
```css
@media (max-width: 768px) {
    /* 移动端样式 */
}
```

## 📱 移动端优化

- **固定底部输入**: 防止键盘遮挡
- **触控优化**: 按钮大小符合触控标准
- **滚动优化**: 自定义滚动条样式
- **视觉层次**: 简化的阴影和效果

## 🎨 配色指南

### 主色系
- Primary: `#4FC3F7` (主要按钮、链接)
- Secondary: `#26A69A` (次要元素)
- Success: `#66BB6A` (成功状态、解密按钮)
- Danger: `#EF5350` (错误状态、警告)

### 气泡配色
- 左侧: 柔和蓝灰渐变 `#F1F8FD` → `#E8F4F8`
- 右侧: 协调蓝绿渐变 `#4FC3F7` → `#26A69A`

### 加密消息
- 左侧: 淡绿蓝色系 `#E8F8F5`
- 右侧: 统一蓝绿色系 `rgba(38, 166, 154, 0.12)`

## 🔄 迁移指南

如果需要回到单文件CSS，可以：
1. 将所有CSS文件内容合并到一个文件中
2. 将`@import`语句替换为实际的CSS内容
3. 更新HTML中的引用

## 🎯 最佳实践

1. **使用CSS变量**: 避免硬编码颜色和尺寸
2. **遵循BEM命名**: 保持类名的语义化
3. **移动端优先**: 先设计移动端，再适配桌面端
4. **性能优化**: 避免过度嵌套和复杂选择器 