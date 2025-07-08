import UserSchema from '../model/user';

// 入库
export function createUser(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const userModal = new UserSchema({ ...data });
      const result = await userModal.save();
      mongodbRes(null, result, resolve, reject, 'save');
    } catch (err) {
      mongodbRes(err, null, resolve, reject, 'save');
    }
  });
}

// 查询全部
export function findAllUser() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await UserSchema.find();
      mongodbRes(null, data, resolve, reject, 'findAll');
    } catch (err) {
      mongodbRes(err, null, resolve, reject, 'findAll');
    }
  });
}

// 条件查询
export function findByUser(condition) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await UserSchema.find({ ...condition });
      mongodbRes(null, data, resolve, reject, 'findByUser');
    } catch (err) {
      mongodbRes(err, null, resolve, reject, 'findByUser');
    }
  });
}

// 条件查询count
export function findByUserCount(condition) {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await UserSchema.countDocuments({ ...condition });
      mongodbRes(null, count, resolve, reject, 'findByUserCount');
    } catch (err) {
      mongodbRes(err, null, resolve, reject, 'findByUserCount');
    }
  });
}

// 更新
export function updateUserById(id, newData) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await UserSchema.findByIdAndUpdate(id, { ...newData }, { new: true });
      mongodbRes(null, data, resolve, reject, 'updateUserById');
    } catch (err) {
      mongodbRes(err, null, resolve, reject, 'updateUserById');
    }
  });
}

// 删除
export function deleteUserById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await UserSchema.findByIdAndDelete(id);
      mongodbRes(null, data, resolve, reject, 'deleteUserById');
    } catch (err) {
      mongodbRes(err, null, resolve, reject, 'deleteUserById');
    }
  });
}

// mongodb响应统一封装
export function mongodbRes(err, data, resolve, reject, method) {
  if (err) {
    console.log(`UserSchema ${method} err:`, err);
    reject(err);
    return;
  }
  // 数据太长只显示前3
  console.log(`UserSchema ${method} success:`, !Array.isArray(data) ? [data] : data);
  resolve?.(data);
}
