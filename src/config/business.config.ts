import { registerAs } from '@nestjs/config';

export interface FastingConfig {
  defaultFastingHours: number;
  defaultEatingHours: number;
  maxFastingHours: number;
  minFastingHours: number;
  defaultReminderMinutes: number;
}

export interface WeightConfig {
  maxDailyRecords: number;
  unit: string;
  heightUnit: string;
  defaultReminderTime: string;
}

export interface NotificationConfig {
  enablePushNotifications: boolean;
  achievementNotification: boolean;
  defaultFastingReminder: number;
  defaultWeightReminderTime: string;
}

export interface UploadConfig {
  maxPhotoSizeMb: number;
  maxNoteLength: number;
  allowedImageTypes: string[];
}

export interface BusinessConfig {
  fasting: FastingConfig;
  weight: WeightConfig;
  notification: NotificationConfig;
  upload: UploadConfig;
  enableAchievements: boolean;
  enableCoupleFeature: boolean;
  maxEncouragementLength: number;
}

export default registerAs(
  'business',
  (): BusinessConfig => ({
    fasting: {
      defaultFastingHours: parseInt(process.env.DEFAULT_FASTING_HOURS || '16', 10),
      defaultEatingHours: parseInt(process.env.DEFAULT_EATING_HOURS || '8', 10),
      maxFastingHours: parseInt(process.env.MAX_FASTING_HOURS || '48', 10),
      minFastingHours: parseInt(process.env.MIN_FASTING_HOURS || '12', 10),
      defaultReminderMinutes: parseInt(process.env.DEFAULT_FASTING_REMINDER || '30', 10)
    },
    weight: {
      maxDailyRecords: parseInt(process.env.MAX_DAILY_WEIGHT_RECORDS || '3', 10),
      unit: process.env.WEIGHT_UNIT || 'kg',
      heightUnit: process.env.HEIGHT_UNIT || 'cm',
      defaultReminderTime: process.env.DEFAULT_WEIGHT_REMINDER_TIME || '08:00'
    },
    notification: {
      enablePushNotifications: process.env.ENABLE_PUSH_NOTIFICATIONS === 'true',
      achievementNotification: process.env.ACHIEVEMENT_NOTIFICATION === 'true',
      defaultFastingReminder: parseInt(process.env.DEFAULT_FASTING_REMINDER || '30', 10),
      defaultWeightReminderTime: process.env.DEFAULT_WEIGHT_REMINDER_TIME || '08:00'
    },
    upload: {
      maxPhotoSizeMb: parseInt(process.env.MAX_PHOTO_SIZE_MB || '5', 10),
      maxNoteLength: parseInt(process.env.MAX_NOTE_LENGTH || '500', 10),
      allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'jpg,jpeg,png,gif').split(',')
    },
    enableAchievements: process.env.ENABLE_ACHIEVEMENTS !== 'false', // 默认启用
    enableCoupleFeature: process.env.ENABLE_COUPLE_FEATURE !== 'false', // 默认启用
    maxEncouragementLength: parseInt(process.env.MAX_ENCOURAGEMENT_LENGTH || '500', 10)
  })
);
