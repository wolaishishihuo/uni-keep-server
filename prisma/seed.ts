import { PrismaClient } from '@prisma/client';
import { SystemConfigKey } from '../src/enums/system-config.enum';

const prisma = new PrismaClient();

// 成就定义数据
const achievementDefinitions = [
  // 断食相关成就
  {
    code: 'first_fast',
    type: 'fasting' as const,
    title: '断食初体验',
    description: '完成第一次断食计划',
    icon: '🌟',
    points: 10,
    rarity: 'common' as const,
    sortOrder: 1,
    ruleConfig: { target: 1 }
  },
  {
    code: 'fast_7_days',
    type: 'fasting' as const,
    title: '坚持一周',
    description: '连续完成7天断食',
    icon: '🔥',
    points: 50,
    rarity: 'rare' as const,
    sortOrder: 2,
    ruleConfig: { target: 7, consecutive: true }
  },
  {
    code: 'fast_30_days',
    type: 'fasting' as const,
    title: '月度达人',
    description: '连续完成30天断食',
    icon: '💪',
    points: 200,
    rarity: 'epic' as const,
    sortOrder: 3,
    ruleConfig: { target: 30, consecutive: true }
  },
  {
    code: 'fast_100_days',
    type: 'fasting' as const,
    title: '百日修行',
    description: '累计完成100天断食',
    icon: '🏆',
    points: 500,
    rarity: 'legendary' as const,
    sortOrder: 4,
    ruleConfig: { target: 100, consecutive: false }
  },
  {
    code: 'long_fast_18h',
    type: 'fasting' as const,
    title: '延长挑战',
    description: '完成18小时以上断食',
    icon: '⏰',
    points: 30,
    rarity: 'rare' as const,
    sortOrder: 5,
    ruleConfig: { minHours: 18 }
  },
  {
    code: 'long_fast_24h',
    type: 'fasting' as const,
    title: '一日断食',
    description: '完成24小时断食',
    icon: '🌙',
    points: 100,
    rarity: 'epic' as const,
    sortOrder: 6,
    ruleConfig: { minHours: 24 }
  },

  // 体重相关成就
  {
    code: 'first_weight_record',
    type: 'weight' as const,
    title: '记录开始',
    description: '第一次记录体重',
    icon: '⚖️',
    points: 5,
    rarity: 'common' as const,
    sortOrder: 10,
    ruleConfig: { target: 1 }
  },
  {
    code: 'weight_loss_1kg',
    type: 'weight' as const,
    title: '小有成效',
    description: '成功减重1公斤',
    icon: '📉',
    points: 25,
    rarity: 'common' as const,
    sortOrder: 11,
    ruleConfig: { weightLoss: 1.0 }
  },
  {
    code: 'weight_loss_5kg',
    type: 'weight' as const,
    title: '显著进步',
    description: '成功减重5公斤',
    icon: '🎯',
    points: 100,
    rarity: 'rare' as const,
    sortOrder: 12,
    ruleConfig: { weightLoss: 5.0 }
  },
  {
    code: 'weight_loss_10kg',
    type: 'weight' as const,
    title: '重大突破',
    description: '成功减重10公斤',
    icon: '🚀',
    points: 300,
    rarity: 'epic' as const,
    sortOrder: 13,
    ruleConfig: { weightLoss: 10.0 }
  },
  {
    code: 'reach_target_weight',
    type: 'weight' as const,
    title: '目标达成',
    description: '达到目标体重',
    icon: '🎉',
    points: 500,
    rarity: 'legendary' as const,
    sortOrder: 14,
    ruleConfig: { targetReached: true }
  },
  {
    code: 'weight_record_streak_7',
    type: 'weight' as const,
    title: '记录坚持者',
    description: '连续7天记录体重',
    icon: '📊',
    points: 20,
    rarity: 'common' as const,
    sortOrder: 15,
    ruleConfig: { consecutiveDays: 7 }
  },

  // 情侣相关成就
  {
    code: 'couple_linked',
    type: 'couple' as const,
    title: '甜蜜连接',
    description: '成功绑定情侣关系',
    icon: '💕',
    points: 50,
    rarity: 'rare' as const,
    sortOrder: 20,
    ruleConfig: { linked: true }
  },
  {
    code: 'couple_encourage_10',
    type: 'couple' as const,
    title: '鼓励达人',
    description: '发送10次鼓励消息',
    icon: '💌',
    points: 30,
    rarity: 'common' as const,
    sortOrder: 21,
    ruleConfig: { encouragements: 10 }
  },
  {
    code: 'couple_sync_fast',
    type: 'couple' as const,
    title: '同步断食',
    description: '与伴侣同时完成断食',
    icon: '👫',
    points: 75,
    rarity: 'rare' as const,
    sortOrder: 22,
    ruleConfig: { syncFast: true }
  },
  {
    code: 'couple_goal_together',
    type: 'couple' as const,
    title: '共同目标',
    description: '与伴侣同时达到减重目标',
    icon: '🏅',
    points: 200,
    rarity: 'epic' as const,
    sortOrder: 23,
    ruleConfig: { bothReachGoal: true }
  },

  // 坚持性成就
  {
    code: 'daily_check_7',
    type: 'consistency' as const,
    title: '每日打卡',
    description: '连续7天使用应用',
    icon: '📅',
    points: 15,
    rarity: 'common' as const,
    sortOrder: 30,
    ruleConfig: { consecutiveDays: 7 }
  },
  {
    code: 'daily_check_30',
    type: 'consistency' as const,
    title: '月度活跃',
    description: '连续30天使用应用',
    icon: '🗓️',
    points: 100,
    rarity: 'rare' as const,
    sortOrder: 31,
    ruleConfig: { consecutiveDays: 30 }
  },
  {
    code: 'daily_check_100',
    type: 'consistency' as const,
    title: '百日坚持',
    description: '连续100天使用应用',
    icon: '💎',
    points: 500,
    rarity: 'legendary' as const,
    sortOrder: 32,
    ruleConfig: { consecutiveDays: 100 }
  },

  // 特殊成就
  {
    code: 'early_bird',
    type: 'special' as const,
    title: '早起鸟儿',
    description: '在早上6点前开始断食',
    icon: '🐦',
    points: 20,
    rarity: 'common' as const,
    sortOrder: 40,
    ruleConfig: { startBefore: '06:00' }
  },
  {
    code: 'night_owl',
    type: 'special' as const,
    title: '夜猫子',
    description: '在晚上10点后结束断食',
    icon: '🦉',
    points: 20,
    rarity: 'common' as const,
    sortOrder: 41,
    ruleConfig: { endAfter: '22:00' }
  },
  {
    code: 'perfect_week',
    type: 'special' as const,
    title: '完美一周',
    description: '一周内每天都完成断食计划',
    icon: '✨',
    points: 150,
    rarity: 'epic' as const,
    sortOrder: 42,
    ruleConfig: { perfectWeek: true }
  },
  {
    code: 'mood_tracker',
    type: 'special' as const,
    title: '情绪观察者',
    description: '记录断食前后情绪10次',
    icon: '😊',
    points: 25,
    rarity: 'common' as const,
    sortOrder: 43,
    ruleConfig: { moodRecords: 10 }
  }
];

// 系统配置数据
const systemConfigs = [
  // 应用基础配置
  {
    key: SystemConfigKey.APP_VERSION,
    value: '1.0.0',
    description: '应用版本号',
    isPublic: true
  },
  {
    key: SystemConfigKey.APP_NAME,
    value: 'UniKeep健康管理',
    description: '应用名称',
    isPublic: true
  },
  {
    key: SystemConfigKey.AUTO_START,
    value: '1',
    description: '每日自动开始断食',
    isPublic: true
  },
  // 断食相关配置
  {
    key: SystemConfigKey.FASTING_START_NOTIFY,
    value: '1',
    description: '断食开始提醒开关',
    isPublic: true
  },
  {
    key: SystemConfigKey.FASTING_START_ADVANCE,
    value: '30',
    description: '断食开始提前时间(分钟)',
    isPublic: true
  },
  {
    key: SystemConfigKey.EAT_START_NOTIFY,
    value: '1',
    description: '进食窗口开始提醒开关',
    isPublic: true
  },
  {
    key: SystemConfigKey.EAT_START_ADVANCE,
    value: '30',
    description: '进食窗口开始提前时间(分钟)',
    isPublic: true
  },
  {
    key: SystemConfigKey.EAT_END_NOTIFY,
    value: '1',
    description: '进食窗口结束提醒开关',
    isPublic: true
  },
  {
    key: SystemConfigKey.EAT_END_ADVANCE,
    value: '30',
    description: '进食窗口结束提前时间(分钟)',
    isPublic: true
  },
  // 成就系统配置
  {
    key: SystemConfigKey.ENABLE_ACHIEVEMENTS,
    value: '1',
    description: '是否启用成就系统',
    isPublic: true
  },
  {
    key: SystemConfigKey.ACHIEVEMENT_NOTIFY,
    value: '1',
    description: '成就解锁提醒',
    isPublic: true
  },
  {
    key: SystemConfigKey.MILESTONE_NOTIFY,
    value: '1',
    description: '坚持里程碑提醒',
    isPublic: true
  },
  // 伙伴系统配置
  {
    key: SystemConfigKey.PARTNER_STATUS_NOTIFY,
    value: '1',
    description: '伙伴坚持状态提醒',
    isPublic: true
  },
  {
    key: SystemConfigKey.PARTNER_ENCOURAGE_NOTIFY,
    value: '1',
    description: '伙伴鼓励提醒',
    isPublic: true
  }
];

// 测试用户数据（仅开发环境）
const testUsers = [
  {
    openId: 'test_openid_admin_001',
    nickname: '管理员测试账号',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    height: 175.0,
    targetWeight: 70.0,
    currentWeight: 75.5,
    gender: 'male' as const,
    age: 28,
    inviteCode: 'ADMIN001',
    isActive: true
  },
  {
    openId: 'test_openid_user_002',
    nickname: '普通用户测试',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    height: 165.0,
    targetWeight: 55.0,
    currentWeight: 60.0,
    gender: 'female' as const,
    age: 25,
    inviteCode: 'USER002',
    isActive: true
  }
];

async function main() {
  console.log('🌱 开始数据库初始化...');

  // 1. 清理现有数据（开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 清理开发环境数据...');
    await cleanupDevelopmentData();
  }

  // 2. 初始化成就定义
  console.log('🏆 初始化成就定义...');
  await initAchievementDefinitions();

  // 3. 初始化系统配置
  console.log('⚙️ 初始化系统配置...');
  await initSystemConfigs();

  // 4. 开发环境：初始化测试数据
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 初始化测试数据...');
    await initTestData();
  }

  console.log('✅ 数据库初始化完成！');
}

async function cleanupDevelopmentData() {
  // 清理测试数据，但保留成就定义和系统配置
  await prisma.userAchievement.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.encouragement.deleteMany({});
  await prisma.coupleRelation.deleteMany({});
  await prisma.foodRecord.deleteMany({});
  await prisma.weightRecord.deleteMany({});
  await prisma.fastingRecord.deleteMany({});
  await prisma.fastingPlan.deleteMany({});
  await prisma.user.deleteMany({});
}

async function initAchievementDefinitions() {
  for (const achievement of achievementDefinitions) {
    await prisma.achievementDefinition.upsert({
      where: { code: achievement.code },
      update: achievement,
      create: achievement
    });
  }
  console.log(`   ✓ 已创建/更新 ${achievementDefinitions.length} 个成就定义`);
}

async function initSystemConfigs() {
  for (const config of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: config,
      create: config
    });
  }
  console.log(`   ✓ 已创建/更新 ${systemConfigs.length} 个系统配置`);
}

async function initTestData() {
  // 创建测试用户
  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { openId: userData.openId },
      update: userData,
      create: userData
    });

    // 为测试用户创建初始化的用户成就记录
    const achievements = await prisma.achievementDefinition.findMany();
    for (const achievement of achievements) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId: user.id,
            achievementId: achievement.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          achievementId: achievement.id,
          progress: 0,
          target: (achievement.ruleConfig as any)?.target || 1
        }
      });
    }
  }
  console.log(`   ✓ 已创建 ${testUsers.length} 个测试用户及其成就记录`);
}

main()
  .catch((e) => {
    console.error('❌ 数据库初始化失败:', e.message);
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
