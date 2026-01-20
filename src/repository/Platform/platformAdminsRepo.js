const createRepo = require('../base');

module.exports = createRepo('platform_admins', [
  'platform_role_id',
  'first_name',
  'last_name',
  'email',
  'password',
  'status',
  'last_login_at'
]);
