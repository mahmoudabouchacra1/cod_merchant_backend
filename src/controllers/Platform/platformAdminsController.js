const service = require('../../services/Platform/platformAdminsService');
const { isNonEmptyString, isValidEmail, isPositiveNumber } = require('../../utils/validation');

async function list(req, res, next) {
  try {
    const rows = await service.list();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!isPositiveNumber(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const row = await service.getById(id);
    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(row);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const payload = req.body || {};
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Empty payload' });
    }
    const { first_name, last_name, email, password, platform_role_id, status } = payload;
    if (!isNonEmptyString(first_name) || !isNonEmptyString(last_name) || !isValidEmail(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (password.trim().length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (platform_role_id !== undefined && platform_role_id !== null && !isPositiveNumber(platform_role_id)) {
      return res.status(400).json({ error: 'platform_role_id must be a positive number' });
    }
    if (status !== undefined && status !== null && !isNonEmptyString(status)) {
      return res.status(400).json({ error: 'status must be a non-empty string' });
    }
    const result = await service.create(payload);
    if (!result.insertId) {
      return res.status(400).json({ error: 'Insert failed' });
    }
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!isPositiveNumber(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const payload = req.body || {};
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Empty payload' });
    }
    const allowedKeys = ['platform_role_id', 'first_name', 'last_name', 'email', 'password', 'status'];
    const payloadKeys = Object.keys(payload);
    const invalidKey = payloadKeys.find((key) => !allowedKeys.includes(key));
    if (invalidKey) {
      return res.status(400).json({ error: `Unknown field: ${invalidKey}` });
    }
    if (payload.first_name !== undefined && !isNonEmptyString(payload.first_name)) {
      return res.status(400).json({ error: 'first_name must be a non-empty string' });
    }
    if (payload.last_name !== undefined && !isNonEmptyString(payload.last_name)) {
      return res.status(400).json({ error: 'last_name must be a non-empty string' });
    }
    if (payload.email !== undefined && !isValidEmail(payload.email)) {
      return res.status(400).json({ error: 'email must be a valid email' });
    }
    if (payload.password !== undefined) {
      if (!isNonEmptyString(payload.password)) {
        return res.status(400).json({ error: 'password must be a non-empty string' });
      }
      if (payload.password.trim().length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
    }
    if (payload.platform_role_id !== undefined && payload.platform_role_id !== null && !isPositiveNumber(payload.platform_role_id)) {
      return res.status(400).json({ error: 'platform_role_id must be a positive number' });
    }
    if (payload.status !== undefined && payload.status !== null && !isNonEmptyString(payload.status)) {
      return res.status(400).json({ error: 'status must be a non-empty string' });
    }
    const result = await service.update(id, payload);
    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ updated: true });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const result = await service.remove(id);
    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove
};
