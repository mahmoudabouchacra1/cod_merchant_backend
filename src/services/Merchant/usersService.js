const repo = require('../../repository/Merchant/usersRepo');
const photosRepo = require('../../repository/Merchant/userPhotosRepo');
const { hashPassword, isHashed } = require('../../utils/password');

module.exports = {
  list: () => repo.findAll(),
  getById: (id) => repo.findById(id),
  create: async (data) => {
    const payload = { ...data };
    if (payload.password && !isHashed(payload.password)) {
      payload.password = await hashPassword(payload.password);
    }
    const avatarUrl = payload.avatar_url;
    delete payload.avatar_url;
    const result = await repo.create(payload);
    if (result.insertId) {
      await photosRepo.setActivePhoto(result.insertId, avatarUrl);
    }
    return result;
  },
  update: async (id, data) => {
    const payload = { ...data };
    if (payload.password && !isHashed(payload.password)) {
      payload.password = await hashPassword(payload.password);
    }
    const avatarUrl = payload.avatar_url;
    delete payload.avatar_url;
    let result = { affectedRows: 0 };
    const hasUpdates = Object.keys(payload).length > 0;
    if (hasUpdates) {
      result = await repo.update(id, payload);
    }
    if (avatarUrl) {
      const shouldCheck = !hasUpdates || !result.affectedRows;
      if (shouldCheck) {
        const existing = await repo.findById(id);
        if (!existing) {
          return { affectedRows: 0 };
        }
      }
      await photosRepo.setActivePhoto(id, avatarUrl);
      return { affectedRows: 1 };
    }
    return result;
  },
  remove: (id) => repo.remove(id)
};
