# 坚持有你 - 健康管理后端服务

一个基于 NestJS 的健康管理应用后端服务，专注于 168 间歇性断食和情侣互动的健康管理平台。

## 📋 项目简介

「坚持有你」是一个健康管理微信小程序的后端服务，旨在帮助情侣用户通过 168 间歇性断食实现健康减肥目标，提供相互监督和鼓励的功能。

### 核心功能

- 🔐 **微信小程序登录认证**
- ⏰ **168 间歇性断食管理**
- ⚖️ **体重记录与趋势分析**
- 🏆 **成就系统与里程碑**
- 💕 **情侣互动与数据同步**
- 🔔 **智能提醒与推送通知**

## 🛠️ 技术栈

- **框架**: NestJS + TypeScript
- **数据库**: MySQL (主数据库) + Redis (缓存) + MongoDB (文档存储)
- **ORM**: Prisma
- **搜索引擎**: Elasticsearch
- **消息队列**: Kafka
- **认证**: JWT + 微信小程序授权
- **日志**: Winston
- **文档**: Swagger/OpenAPI
- **包管理**: pnpm

## 🚀 快速开始

### 环境要求

- Node.js 18.17.1+
- pnpm 8.10.0+
- MySQL 8.0+
- Redis 7.0+

### 安装依赖

```bash
pnpm install
```

### 环境配置

1. 复制环境配置文件：

```bash
cp config.env .env.development
```

2. 配置数据库连接、微信小程序等必要参数

### 数据库初始化

```bash
# 生成 Prisma 客户端
pnpm run db:generate

# 运行数据库迁移
pnpm run db:migrate

# 初始化种子数据
pnpm run db:seed
```

### 启动服务

```bash
# 开发环境（热重载）
pnpm run start:dev

# 生产环境
pnpm run start:prod

# 调试模式
pnpm run start:debug
```

服务启动后，可在以下地址访问：

- API 文档：http://localhost:3000/api
- 健康检查：http://localhost:3000/health

## 📁 项目结构

```
src/
├── modules/               # 业务模块
│   ├── user/             # 用户管理
│   ├── fasting/          # 断食管理
│   │   ├── fasting-plan/     # 断食计划
│   │   └── fasting-record/   # 断食记录
│   ├── weight/           # 体重管理
│   ├── achievement/      # 成就系统
│   ├── auth/             # 认证授权
│   └── system/           # 系统配置
├── common/               # 公共模块
│   ├── guards/           # 路由守卫
│   ├── interceptors/     # 拦截器
│   ├── filters/          # 异常过滤器
│   └── middlewares/      # 中间件
├── config/               # 配置管理
├── datasources/          # 数据源
│   ├── prisma/           # MySQL 数据库
│   ├── redis/            # Redis 缓存
│   ├── mongodb/          # MongoDB 文档库
│   └── es/               # Elasticsearch
└── utils/                # 工具函数
```

## 🔧 开发命令

### 开发与构建

```bash
# 启动开发服务器
pnpm run start:dev

# 构建生产版本
pnpm run build

# 启动生产服务器
pnpm run start:prod
```

### 数据库操作

```bash
# 生成 Prisma 客户端
pnpm run db:generate

# 运行数据库迁移
pnpm run db:migrate

# 推送模式到数据库
pnpm run db:push

# 执行种子数据
pnpm run db:seed
```

### 代码质量

```bash
# 代码格式化
pnpm run format

# 代码检查和自动修复
pnpm run lint

# Git 提交前检查
pnpm run lint:staged
```

### 测试

```bash
# 运行单元测试
pnpm run test

# 监听模式运行测试
pnpm run test:watch

# 运行测试并生成覆盖率报告
pnpm run test:cov

# 运行端到端测试
pnpm run test:e2e
```

## 🏗️ 架构设计

### 分层架构

```
┌─────────────────────────────────────────────┐
│                Controller 层                │ ← API 路由、参数验证
├─────────────────────────────────────────────┤
│                Service 层                   │ ← 业务逻辑处理
├─────────────────────────────────────────────┤
│                Repository 层                │ ← 数据访问封装
├─────────────────────────────────────────────┤
│                Entity 层                    │ ← 数据模型定义
└─────────────────────────────────────────────┘
```

### 核心模块

- **用户模块**: 微信认证、用户档案、情侣关系管理
- **断食模块**: 168 断食计划、实时计时、历史记录
- **体重模块**: 体重记录、BMI 计算、趋势分析
- **成就模块**: 成就规则、进度追踪、徽章系统

## 📊 数据库设计

使用 Prisma ORM 管理 MySQL 数据库，主要实体包括：

- **User**: 用户基础信息和健康档案
- **FastingPlan**: 168 断食计划配置
- **FastingRecord**: 每日断食执行记录
- **WeightRecord**: 体重变化追踪
- **Achievement**: 成就系统和进度管理
- **CoupleRelation**: 情侣关系和互动

## 🔐 安全设计

- JWT 令牌认证
- 微信小程序登录授权
- API 接口鉴权中间件
- 请求频率限制
- 数据输入验证和过滤

## 🌐 API 文档

启动服务后访问 `/api` 路径查看完整的 Swagger API 文档。

主要 API 端点：

- `POST /api/auth/login` - 微信登录
- `GET /api/user/profile` - 获取用户信息
- `POST /api/fasting/plans` - 创建断食计划
- `POST /api/weight/records` - 记录体重
- `GET /api/achievement/list` - 获取成就列表

## 🔧 配置管理

项目使用分环境配置文件：

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `config/` - 模块化配置管理

## 📈 监控与日志

- Winston 日志系统
- 健康检查端点
- 错误追踪和报告
- 性能监控指标

## 🚀 部署

### Docker 部署

```bash
# 构建镜像
docker build -t uni-keep-server .

# 运行容器
docker run -p 3000:3000 uni-keep-server
```

### 生产环境部署

1. 构建生产版本：`pnpm run build`
2. 配置环境变量
3. 运行数据库迁移：`pnpm run db:migrate`
4. 启动服务：`pnpm run start:prod`

## 🤝 开发指南

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 使用 Husky Git hooks 确保代码质量
- 编写单元测试和集成测试

### 提交规范

使用 Conventional Commits 规范：

```bash
feat: 新增功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具变动
```

## 📝 开发进度

详见 [PROGRESS.md](./PROGRESS.md) 文件。

## 📄 许可证

UNLICENSED

---

**开发团队**: 健康管理小组  
**最后更新**: 2025-07-09  
**项目状态**: 开发中
