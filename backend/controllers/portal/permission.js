/*
  This file is for handles fetching of data from permissions table.
*/
const handleGetRolePermissions = (req, res, db) => {
    
    db("role_permission")
      .withSchema("portal")
      .select("permissions.perm_name")
      .rightJoin("roles", "roles.role_id", "role_permission.role_id")
      .rightJoin("permissions", "permissions.perm_id", "role_permission.perm_id")
      .where("role_permission.role_id", "=", req.user.role_id)
      .then((data) => {
        const permission_names = data.map(row => {
          return row.perm_name
        })
        res.json(permission_names)
      });

  };
  

  module.exports = {
      handleGetRolePermissions
  }