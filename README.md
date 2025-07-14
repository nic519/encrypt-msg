# 文本加密工具 - Preact + TypeScript 版本

一个基于 Preact 和 TypeScript 的现代化文本加密工具，提供安全的文本加密解密功能。

## 主要特性

- 🔒 **安全加密**：使用 AES-GCM 算法进行端到端加密
- 🛡️ **完全本地运行**：所有加密解密操作在浏览器中完成，不会上传任何数据
- 🔄 **每次结果不同**：每次加密都会生成不同的结果，增强安全性
- 📱 **响应式设计**：支持移动端和桌面端，提供优秀的用户体验
- 🎨 **现代化界面**：类似聊天应用的消息气泡界面
- 📋 **便捷复制**：一键复制加密结果和解密内容

## 技术栈

- **前端框架**：Preact + TypeScript
- **构建工具**：Vite
- **样式**：CSS Modules
- **加密算法**：Web Crypto API (AES-GCM)
- **开发语言**：TypeScript
- **模块系统**：ES Modules

## 项目结构

```
encrypt-msg/
├── src/
│   ├── components/          # Preact 组件
│   │   ├── App.tsx         # 主应用组件
│   │   ├── MessageList.tsx # 消息列表组件
│   │   ├── MessageBubble.tsx # 消息气泡组件
│   │   ├── InputArea.tsx   # 输入区域组件
│   │   ├── TipsPanel.tsx   # 帮助提示组件
│   │   └── Notification.tsx # 通知组件
│   ├── services/           # 业务逻辑服务
│   │   ├── crypto.ts       # 加密解密服务
│   │   ├── message.ts      # 消息管理服务
│   │   └── ui.ts           # UI 交互服务
│   ├── types/              # TypeScript 类型定义
│   │   ├── app.ts          # 应用状态类型
│   │   ├── message.ts      # 消息相关类型
│   │   └── services.ts     # 服务接口类型
│   ├── styles/             # 样式文件
│   └── main.tsx           # 应用入口文件
├── dist/                   # 构建输出目录
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
└── vite.config.ts         # Vite 构建配置
```

## 开发指南

### 环境要求

- Node.js 16.0+
- npm 8.0+

### 开始开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```
   应用将在 http://localhost:3000 启动

3. **类型检查**
   ```bash
   npm run type-check
   ```

4. **构建生产版本**
   ```bash
   npm run build
   ```

5. **预览构建结果**
   ```bash
   npm run preview
   ```

### 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果
- `npm run type-check` - 运行 TypeScript 类型检查

## 使用说明

1. **加密文本**
   - 在输入框中输入要加密的文本
   - 点击"加密"按钮或按 Enter 键
   - 加密结果将显示在右侧消息气泡中

2. **解密文本**
   - 将加密的文本粘贴到输入框中，或者
   - 直接点击"粘贴并解密"按钮
   - 解密结果将显示在左侧消息气泡中

3. **复制结果**
   - 点击消息气泡中的"复制"按钮
   - 内容将自动复制到剪贴板

## 安全特性

- 使用 AES-GCM 256 位加密算法
- 每次加密都会生成随机的初始化向量 (IV)
- 所有操作完全在浏览器本地执行
- 不会向服务器发送任何数据

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License
 