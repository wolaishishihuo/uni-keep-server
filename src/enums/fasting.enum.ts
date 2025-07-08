export enum FastingType {
  TIME_16_8 = 'TIME_16_8', // 16:8时间限制断食
  TIME_18_6 = 'TIME_18_6', // 18:6时间限制断食
  CUSTOM = 'CUSTOM' // 自定义模式
}

export enum FastingStatus {
  ACTIVE = 'active', // 进行中
  COMPLETED = 'completed', // 已完成
  BROKEN = 'broken' // 已中断
}

export enum MoodBefore {
  EXCITED = 'excited', // 兴奋期待
  NORMAL = 'normal', // 平静正常
  WORRIED = 'worried' // 担心焦虑
}

export enum MoodAfter {
  GREAT = 'great', // 感觉很棒
  GOOD = 'good', // 感觉良好
  TIRED = 'tired' // 感觉疲惫
}
