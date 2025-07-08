'use strict';

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 提交类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式调整（不影响功能）
        'refactor', // 重构代码
        'perf', // 性能优化
        'test', // 测试相关
        'chore', // 构建过程或辅助工具的变动
        'ci', // CI/CD相关变更
        'build', // 构建系统或外部依赖变更
        'hotfix', // 紧急修复
        'revert', // 回滚提交
        'merge', // 合并分支
        'init', // 初始化项目
      ],
    ],
    // 提交范围枚举
    'scope-enum': [
      2,
      'always',
      [
        // 模块范围
        'auth', // 认证授权模块
        'user', // 用户管理模块
        'api', // API接口
        'db', // 数据库相关
        'config', // 配置相关
        'middleware', // 中间件
        'guard', // 守卫
        'interceptor', // 拦截器
        'filter', // 过滤器
        'dto', // 数据传输对象
        'service', // 服务层
        'controller', // 控制器
        'module', // 模块
        // 技术范围
        'prisma', // Prisma相关
        'redis', // Redis相关
        'mongodb', // MongoDB相关
        'es', // Elasticsearch相关
        'kafka', // Kafka相关
        'apollo', // Apollo配置中心
        'docker', // Docker相关
        'deps', // 依赖更新
        // 业务模块
        'demo', // 演示模块
        'image', // 图片服务
        'spider', // 爬虫服务
        'health', // 健康检查
        // 其他
        'global', // 全局服务
        'utils', // 工具函数
        'common', // 公共组件
      ],
    ],
    // 主题最大长度
    'subject-max-length': [2, 'always', 100],
    // 主题最小长度
    'subject-min-length': [2, 'always', 5],
    // 主题大小写
    'subject-case': [2, 'always', 'lower-case'],
    // 主题不能为空
    'subject-empty': [2, 'never'],
    // 主题不能以句号结尾
    'subject-full-stop': [2, 'never', '.'],
    // 类型大小写
    'type-case': [2, 'always', 'lower-case'],
    // 类型不能为空
    'type-empty': [2, 'never'],
    // 正文最大行长度
    'body-max-line-length': [2, 'always', 100],
    // 页脚最大行长度
    'footer-max-line-length': [2, 'always', 100],
    // 头部最大长度
    'header-max-length': [2, 'always', 100],
    // 范围大小写
    'scope-case': [2, 'always', 'lower-case'],
  },
  // 忽略特定的提交（如合并提交）
  ignores: [
    (commit) => commit.includes('Merge branch'),
    (commit) => commit.includes('Merge pull request'),
    (commit) => commit.includes('Initial commit'),
  ],
  // 默认忽略规则
  defaultIgnores: true,
  // 帮助URL
  helpUrl:
    'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
};
