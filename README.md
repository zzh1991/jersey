# Jersey - 球衣管理系统

一个现代化的个人生活管理工具。采用深色主题设计，流畅的动画交互体验。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

## 技术栈

- **框架**: React 19 + React Router 7
- **构建工具**: Vite 6
- **状态管理**: Zustand
- **语言**: TypeScript 5
- **包管理器**: pnpm
- **UI 组件**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **图标**: Phosphor Icons
- **数据库**: MySQL + Prisma
- **农历计算**: lunar-typescript

## 快速开始

### 环境要求
- Node.js 18+
- pnpm
- MySQL 数据库

### 安装依赖

```bash
pnpm install
```

### 数据库配置

在 `prisma.config.ts` 中配置数据库连接信息：

```typescript
export const prismaConfig = {
  host: 'your-database-host',
  port: 3306,
  database: 'your-database',
  username: 'your-username',
  password: 'your-password',
};
```

然后执行数据库迁移：

```bash
npx prisma migrate dev
npx prisma generate
```

### 开发模式

```bash
# 启动前端开发服务器
pnpm dev:web

# 启动 Vercel 本地开发（包含 API）
vercel dev
```

### 构建部署

```bash
# 类型检查
pnpm type-check

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```
jersey/
├── api/                       # Vercel Serverless Functions
├── prisma/                    # Prisma schema
├── src/
│   ├── app/                   # 应用入口与全局配置
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── routes/                # 路由页面组件
│   │   ├── landing/
│   │   ├── reminder/
│   │   ├── kanban/
│   │   └── parking/
│   ├── modules/               # 业务模块
│   │   ├── reminder/
│   │   ├── kanban/
│   │   └── parking/
│   ├── shared/                # 共享资源
│   │   ├── components/ui/     # shadcn 组件
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── constants/
│   └── main.tsx
├── index.html
├── vite.config.ts
└── package.json
```

## 部署

本项目使用 **Vercel** 进行前后端一体化部署。

### 部署步骤

1. 安装 Vercel CLI:
```bash
npm i -g vercel
```

2. 登录并部署:
```bash
vercel login
vercel --prod
```

## 开发规范

### 组件规范
- 使用函数声明而非箭头函数
- Props 使用解构接收
- 接口命名：`组件名 + Props`
- 复杂列表项使用 `memo` 优化

### 命名规范
| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserCard.tsx` |
| Hook | camelCase (use前缀) | `useAuth.ts` |
| Store | camelCase | `authStore.ts` |
| 工具函数 | camelCase | `formatDate.ts` |
| 常量 | UPPER_SNAKE_CASE | `CARD_THEMES` |

### 提交规范
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建/工具相关
design: UI/UX 设计改进
```

## 设计系统

### 颜色主题
- **背景**: `#0a0a0b` (深色)
- **卡片**: `#141416`
- **主色**: `#3b82f6` (蓝色)
- **边框**: `rgba(255, 255, 255, 0.08)`

### 卡片主题色
- 梦幻紫: `#8B5CF6`
- 天空蓝: `#3B82F6`
- 薄荷绿: `#10B981`
- 珊瑚橙: `#F97316`
- 玫瑰粉: `#EC4899`
- 日落红: `#EF4444`

## 许可证

MIT
