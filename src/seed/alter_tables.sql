ALTER TABLE platform_admins
  ADD COLUMN platform_role_id INT NULL AFTER id;

ALTER TABLE users
  ADD COLUMN merchant_role_id INT NULL AFTER branch_id;
