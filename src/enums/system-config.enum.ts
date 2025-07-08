/**
 * 系统配置键枚举
 */
export enum SystemConfigKey {
  // 应用基础配置
  APP_VERSION = 'app_version', // 应用版本
  APP_NAME = 'app_name', // 应用名称

  // 断食相关配置
  AUTO_START = 'auto_start', // 每日自动开始断食

  // 通知配置
  FASTING_START_NOTIFY = 'fasting_start_notify', // 断食开始提醒开关
  FASTING_START_ADVANCE = 'fasting_start_advance', // 断食开始提前时间(分钟)
  EAT_START_NOTIFY = 'eat_start_notify', // 进食窗口开始提醒开关
  EAT_START_ADVANCE = 'eat_start_advance', // 进食窗口开始提前时间(分钟)
  EAT_END_NOTIFY = 'eat_end_notify', // 进食窗口结束提醒开关
  EAT_END_ADVANCE = 'eat_end_advance', // 进食窗口结束提前时间(分钟)

  // 成就系统配置
  ENABLE_ACHIEVEMENTS = 'enable_achievements', // 是否启用成就系统
  ACHIEVEMENT_NOTIFY = 'achievement_notify', // 成就解锁提醒
  MILESTONE_NOTIFY = 'milestone_notify', // 坚持里程碑提醒

  // 伙伴系统配置
  PARTNER_STATUS_NOTIFY = 'partner_status_notify', // 伙伴坚持状态提醒
  PARTNER_ENCOURAGE_NOTIFY = 'partner_encourage_notify' // 伙伴鼓励提醒
}
