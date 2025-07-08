import * as mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
const connectLogger = new Logger('connectMongoDB');

// 建立连接
// url格式: mongodb://username:pwd@ip:27017,ip:27017,ip:27017/dbname?retryWrites=true
export async function connectMongoDB(connectUrl, logger = connectLogger) {
  let MONGODB_CONNECTSTRING = connectUrl;

  if (MONGODB_CONNECTSTRING) {
    // 记录连接字符串到环境变量（保持向后兼容）
    process.env['MONGODB_DATABASE_URL'] = MONGODB_CONNECTSTRING;

    // Mongodb v6.17.0 mongoose v8.16.1
    const mongodb = await mongoose
      .connect(MONGODB_CONNECTSTRING, {
        serverSelectionTimeoutMS: 30000
      })
      .then(() => logger.log(`Connected to MongoDB Cluster: ${MONGODB_CONNECTSTRING}`))
      .catch((err) => logger.error(`MongoDB Connection Error: ${err}`));
    return mongodb;
  } else {
    logger.warn('MongoDB connection string not provided');
  }
}
