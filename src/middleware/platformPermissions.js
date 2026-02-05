const platformAdminsRepo = require('../repository/Platform/platformAdminsRepo');

function requirePlatformPermission(permissionMap) {
  return async (req, res, next) => {
    try {
      if (process.env.PLATFORM_ADMIN_FULL_ACCESS === 'true' && req.user?.type === 'platform') {
        return next();
      }
      if (!req.user?.sub) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const method = req.method === 'HEAD' ? 'GET' : req.method;
      const required = permissionMap[method];
      if (!required) {
        return next();
      }

      if (!req.permissions) {
        req.permissions = await platformAdminsRepo.getPermissions(req.user.sub);
      }

      if (!req.permissions.includes(required)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = requirePlatformPermission;
