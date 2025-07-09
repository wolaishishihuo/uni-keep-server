# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。
总是以中文回答!!!

## 项目概述

这是一个基于 NestJS 的后端服务，用于名为"坚持有你"的健康管理应用。应用提供断食管理、体重跟踪、情侣互动和成就系统，集成微信小程序。

## 常用开发命令

### 开发和构建

```bash
# 启动开发服务器（热重载）
npm run start:dev

# 生产环境构建
npm run build

# 启动生产环境服务器
npm run start:prod

# 调试模式
npm run start:debug
```

### 数据库操作

```bash
# 生成 Prisma 客户端
npm run db:generate

# 运行数据库迁移
npm run db:migrate

# 推送模式到数据库
npm run db:push

# 数据库初始化数据
npm run db:seed
```

### 代码质量

```bash
# 运行 ESLint 并自动修复
npm run lint

# 使用 Prettier 格式化代码
npm run format

# 运行 lint-staged（Git 钩子中使用）
npm run lint:staged
```

### 测试

```bash
# 运行单元测试
npm run test

# 监听模式运行测试
npm run test:watch

# 运行测试并生成覆盖率报告
npm run test:cov

# 运行端到端测试
npm run test:e2e
```

## 架构和核心模块

### 核心应用结构

- **主应用程序**: `src/main.ts` - 启动配置，包含 Winston 日志、CORS、Swagger、全局管道/过滤器
- **应用模块**: `src/app.module.ts` - 根模块，包含所有功能模块和配置
- **配置管理**: `src/config/` - 基于环境的配置管理

### 数据层

- **Prisma ORM**: `src/datasources/prisma/` - 数据库客户端和连接管理
- **Redis**: `src/datasources/redis/` - 缓存和会话管理
- **MongoDB**: `src/datasources/mongodb/` - NoSQL 文档存储
- **Elasticsearch**: `src/datasources/es/` - 搜索和分析

### 核心业务模块

- **用户管理**: `src/modules/user/` - 微信认证、用户档案、情侣关系
- **断食系统**: `src/modules/fasting/` - 断食计划和记录，支持 16:8 间歇性断食
- **体重跟踪**: `src/modules/weight/` - 体重记录和 BMI 计算
- **系统配置**: `src/modules/system/` - 应用配置管理

### 通用基础设施

- **守卫**: `src/common/guards/` - JWT 和本地认证
- **拦截器**: `src/common/interceptors/` - 响应格式化
- **过滤器**: `src/common/filters/` - 全局异常处理
- **中间件**: `src/common/middlewares/` - 请求日志记录

## 数据库模式

应用使用 Prisma 和 MySQL 作为主数据库。核心实体包括：

- **User**: 基于微信的用户认证和健康档案
- **FastingPlan**: 16:8 间歇性断食配置
- **FastingRecord**: 每日断食执行跟踪
- **WeightRecord**: 体重和 BMI 跟踪
- **CoupleRelation**: 伴侣关系管理
- **Achievement**: 游戏化和进度跟踪

## API 文档

- 运行应用时，Swagger UI 可在 `/api` 路径访问
- 所有控制器使用 NestJS 装饰器自动生成 OpenAPI 文档
- 所有路由使用全局前缀 `/api`

## 环境配置

应用使用特定环境的配置文件：

- `.env.development` 用于开发环境
- `.env.production` 用于生产环境
- `.env` 作为备用

配置通过 `src/config/` 中的单独文件管理：

- `app.config.ts` - 应用设置
- `database.config.ts` - 数据库和 Redis 连接
- `auth.config.ts` - 认证设置
- `business.config.ts` - 业务逻辑配置
- `third-party.config.ts` - 外部服务集成

## 开发指南

### 代码组织

- 遵循 NestJS 模块结构，包含控制器、服务和 DTO
- 使用 Prisma 实体作为数据库模型
- 实现带有自定义异常的正确错误处理
- 使用 class-validator 进行请求验证

### 测试策略

- 使用 Jest 进行服务单元测试
- API 端点的 E2E 测试
- 测试文件应与源文件放在同一位置（`*.spec.ts`）

### 认证流程

- 微信小程序登录集成
- 基于 JWT 的认证和刷新令牌
- 适用时的基于角色的访问控制

## 外部集成

- **微信小程序**: 用户认证和推送通知
- **Kafka**: 异步处理的消息队列
- **Elasticsearch**: 搜索和分析能力
- **Apollo**: 配置管理（如果使用）

## 包管理器

此项目使用 **pnpm** 作为包管理器（在 package.json 的 `volta` 部分中配置）。

## 部署

应用使用 Docker 容器化，包括：

- `Dockerfile` 用于容器构建
- `Jenkinsfile` 用于 CI/CD 流水线
- 通过 `/health` 端点进行健康检查
- 从 `/static` 路径提供静态文件服务
