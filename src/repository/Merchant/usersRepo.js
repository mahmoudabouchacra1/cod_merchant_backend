const createRepo = require('../base');

module.exports = createRepo('users', [
  'merchant_id',
  'branch_id',
  'merchant_role_id',
  'first_name',
  'last_name',
  'email',
  'phone',
  'password',
  'status',
  'last_login_at'
]);
