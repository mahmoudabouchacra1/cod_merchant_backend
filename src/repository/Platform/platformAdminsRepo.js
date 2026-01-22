const createRepo = require('../base');
const pool = require('../../db');

const repo = createRepo('platform_admins', [
  'platform_role_id',
  'first_name',
  'last_name',
  'email',
  'password',
  'status',
  'last_login_at'
]);

repo.findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM platform_admins WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

repo.getPermissions = async (adminId) => {
  try {
    const [rows] = await pool.query(
      `SELECT pp.key_name
       FROM platform_admins pa
       JOIN platform_role_permissions prp ON prp.platform_role_id = pa.platform_role_id
       JOIN platform_permissions pp ON pp.id = prp.platform_permission_id
       WHERE pa.id = ?`,
      [adminId]
    );
    return rows.map((row) => row.key_name);
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      return [];
    }
    throw err;
  }
};

module.exports = repo;
