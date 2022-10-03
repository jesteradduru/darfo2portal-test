/*
  This file is for handles fetching of data from roles table.
  This file is imported in server.js file
*/
const _ = require('lodash')
const handleGetRoles = async (req, res, db) => {
  try {
    await db.transaction(async trx => {
      const role_permission = await trx("roles")
      .withSchema("portal")
      .select("role_id", "role_name")
      .then((res_data) => res_data)


      const users_count = await trx('users')
      .withSchema("portal")
      .select('role_id')
      .count("role_id", {as: "user_role_count"})
      .groupBy("role_id")
      .then(data => data)

      const role_permissions_count = await trx('role_permission')
      .withSchema("portal")
      .select('role_id')
      .count("role_id", {as: "role_permissions_count"})
      .groupBy("role_id")
      .then(data => data)

      const roles = role_permission.map(data => {
        const user_count = users_count.filter(user_role_count => data.role_id === user_role_count.role_id)
        const role_permission_count = role_permissions_count.filter(permission => data.role_id === permission.role_id)
        if(user_count.length !== 0 && role_permission_count !== 0){
          return {
            role_name: data.role_name,
            role_id: data.role_id,
            user_count: user_count[0].user_role_count,
            granted_count: role_permission_count[0].role_permissions_count
         }
        }
        else if(user_count.length !== 0){
          return {
            role_name: data.role_name,
            role_id: data.role_id,
            user_count: user_count[0].user_role_count,
            granted_count: 0
         }
        }
        else if(role_permission_count.length !== 0){
          return {
            role_name: data.role_name,
            role_id: data.role_id,
            user_count: 0,
            granted_count: role_permission_count[0].role_permissions_count
         }
        }
        else{
          return {
            role_name: data.role_name,
            role_id: data.role_id,
            user_count: 0,
            granted_count: 0
         }
        }
      })
      res.json(roles)
    })
  } catch (error) {
    console.log(error)
  }
  
};

const handleGetPermissions = (req, res, db) => {
  db("permissions")
    .withSchema("portal")
    .select("*")
    .then((res_data) => res.json(res_data));
};

const handleGetRolePermissions = (req, res, db) => {
  db("role_permission")
    .withSchema("portal")
    .select("permissions.perm_name")
    .rightJoin("roles", "roles.role_id", "role_permission.role_id")
    .rightJoin("permissions", "permissions.perm_id", "role_permission.perm_id")
    .where("role_permission.role_id", "=", req.body.role_id)
    .then((data) => {
      const permission_names = data.map(row => {
        return row.perm_name
      })
      res.json(permission_names)
    });
};

const handleAddRole = async (req, res, db) => {
  const { role_name, permissions } = req.body;

  try {
    await db.transaction(async (trx) => {
      const role_id = await trx("roles")
        .withSchema("portal")
        .insert({ role_name: role_name })
        .returning("role_id")
        .then((res_data) => res_data[0]);

      const role_permission_to_insert = permissions.map((permission) => {
        return { role_id, perm_id: permission };
      });

      await trx("role_permission")
        .withSchema("portal")
        .insert(role_permission_to_insert)
        .returning("*")
        .then((data) => res.json(data));
    });
  } catch (error) {
    if (error.code === "23505") {
      res.json("Role already exist!");
    } else {
      res.json("Cannot add the role. Something went wrong.");
    }
  }
};

const handleUpdateRole = async (req, res, db) => {
  const { role_id, role_name, permissions } = req.body;

  try {
    await db.transaction(async (trx) => {

      await trx("roles")
      .withSchema("portal")
      .update({role_name: role_name})
      .where("role_id", "=", role_id)

      await trx("role_permission")
        .withSchema("portal")
        .delete()
        .where("role_id", "=", role_id);

      const role_permission_to_insert = permissions.map((permission) => {
        return { role_id, perm_id: permission };
      });

      await trx("role_permission")
        .withSchema("portal")
        .insert(role_permission_to_insert)
        .returning("*")
        .then((data) => res.json(data));

    });
  } catch (error) {
    console.log(error);
  }

};

const handleDeleteRole = async (req, res, db) => {
  const {role_id} = req.body
  try {
    await db.transaction(async trx => {

      const users = await trx('users')
      .withSchema('portal')
      .select('user_id')
      .where('role_id', '=', role_id)
      .then(data => data);
      
      if(_.isEmpty(users)){
        await trx('roles')
        .withSchema('portal')
        .delete()
        .where('role_id', '=', role_id)
  
        await trx('role_permission')
        .withSchema('portal')
        .delete()
        .where('role_id', '=', role_id)
        
        res.json("Role succesfully deleted.")
      }else{
        res.json('role_delete_unable')
      }
      
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  handleGetRoles,
  handleGetRolePermissions,
  handleGetPermissions,
  handleAddRole,
  handleUpdateRole,
  handleDeleteRole
};
