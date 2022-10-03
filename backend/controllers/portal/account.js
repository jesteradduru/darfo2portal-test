/*
  This file is for handling CRUD operations from accounts module.
  It uses bcrypt encryption for passwords.
  This file is imported in server.js file
*/

const bcrypt = require("bcrypt");
require("dotenv").config();

const handleRegister = async (req, res, db) => {
  const {
    username,
    supervisor_id,
    password,
    role_id,
    email,
    agency_id,
    position,
    lastname,
    firstname,
    middlename,
    suffix,
    contact_no,
    sex,
    birthdate,
    office_id,
    group_id
  } = req.body;

  const login_data = { login_hash: "", user_username: username };

  const employee_data = {
    emp_agencyIdNo: agency_id,
    emp_firstname: firstname,
    emp_lastname: lastname,
    emp_middlename: middlename,
    emp_extension: suffix,
    emp_dateOfBirth: birthdate,
    emp_sex: sex,
    emp_contact: contact_no,
    office_id: office_id,
    emp_email: email,
    emp_position: position,
  };

  const user_data = {
    user_username: username,
    role_id: role_id,
    user_accountStatus: "activated",
    emp_id: null,
    user_2fa: false,
  };

  supervisor_id && (user_data.user_supervisor_id = supervisor_id)

  group_id && (user_data.group_id = group_id);

  const saltRounds = 10;

  try {
    await bcrypt.hash(password, saltRounds, async (err, hash) => {
      login_data.login_hash = hash;

      await db.transaction(async (trx) => {
        const res_emp = await trx("employees")
          .withSchema("portal")
          .insert(employee_data)
          .returning("*")
          .then((res_emp) => res_emp);

        user_data.emp_id = res_emp[0].emp_id;

        const res_user = await trx("users")
          .withSchema("portal")
          .insert(user_data)
          .returning("*")
          .then((res_user) => res_user)
          .catch((err) => {
            if (err.code === "23505") {
              res.status(400).json("username_already_taken");
            }
          });

        login_data.user_username = res_user[0].user_username;
        const new_user = await trx("login")
          .withSchema("portal")
          .insert(login_data)
          .then(() => {
            trx("users")
              .withSchema("portal")
              .where("user_id", "=", res_user[0].user_id)
              .select("*")
              .rightJoin("employees", "users.emp_id", "employees.emp_id")
              .leftJoin("roles", "users.role_id", "roles.role_id")
              .leftJoin("offices", "employees.office_id", "offices.office_id")
              .then((data) => res.json(data));
          });
      });
    });
  } catch (error) {
    console.log(error)
  }
};

const handleUpdate = (req, res, db) => {
  const {
    user_id,
    username,
    supervisor_id = null,
    password,
    role_id,
    email,
    agency_id,
    position,
    lastname,
    firstname,
    middlename,
    suffix,
    contact_no,
    sex,
    birthdate,
    office_id,
    group_id
  } = req.body;

  let employee_data = {
    emp_agencyIdNo: agency_id,
    emp_firstname: firstname,
    emp_lastname: lastname,
    emp_middlename: middlename,
    emp_extension: suffix,
    emp_dateOfBirth: birthdate,
    emp_sex: sex,
    emp_contact: contact_no,
    office_id: office_id,
    emp_email: email,
    emp_position: position,
  };

  const user_data = {
    user_username: username,
    role_id: role_id,
    user_accountStatus: "activated",
    emp_id: null,
    user_2fa: false,
    group_id: null
  };

  if(supervisor_id){
    user_data.user_supervisor_id = supervisor_id;
  }

  group_id && (user_data.group_id = group_id);

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (!err) {
      let login_data = {};
      if (password !== "") {
        login_data = { login_hash: "", user_username: username };
        login_data.login_hash = hash;
      } else {
        login_data = { user_username: username };
      }
      db.transaction((trx) => {
        let updated_user_data = null;
        trx("users")
          .withSchema("portal")
          .select("emp_id", "user_username", "user_id")
          .where("user_id", "=", user_id)
          .then((res_user_data) => {
            updated_user_data = res_user_data;
            return trx("login")
              .withSchema("portal")
              .update(login_data)
              .where("user_username", "=", res_user_data[0].user_username)
              .then(() => {
                return trx("employees")
                  .withSchema("portal")
                  .update(employee_data)
                  .returning("*")
                  .where("emp_id", "=", res_user_data[0].emp_id)
                  .then((res_emp_data) => {
                    updated_user_data = { ...res_emp_data[0] };
                  })
                  .catch(console.log);
              })
              .then(() => {
                user_data.emp_id = res_user_data[0].emp_id;

                return trx("users")
                  .withSchema("portal")
                  .update(user_data)
                  .returning("*")
                  .where("user_id", "=", res_user_data[0].user_id)
                  .then((res_userData) => {
                    updated_user_data = {
                      ...updated_user_data,
                      ...res_userData[0],
                    };
                    res.json(updated_user_data);
                  })
                  .catch((errr) => console.log(errr));
              });
          })
          .then(trx.commit)
          .then(trx.rollback);
      });
    }
  });
};

const handleDelete = async (req, res, db) => {
  const { user_id } = req.body;
  try {
    await db.transaction(async (trx) => {
      const user = await trx("users")
        .withSchema("portal")
        .select("*")
        .where("user_id", "=", user_id)
        .then((data) => data);
      await trx("employees")
        .withSchema("portal")
        .del()
        .where("emp_id", "=", user[0].emp_id);
      await trx("login")
        .withSchema("portal")
        .del()
        .where("user_username", "=", user[0].user_username);
      await trx("users")
        .withSchema("portal")
        .del()
        .where("user_id", "=", user[0].user_id);
      res.json(`${user[0].user_username} deleted`);
    });
  } catch (error) {
    console.log(error);
  }
};

const handleActivation = async (req, res, db) => {
  const { user_id } = req.body;
  try {
    await db.transaction(async (trx) => {
      const accountStatus = await trx("users")
        .withSchema("portal")
        .select("user_accountStatus")
        .where("user_id", "=", user_id)
        .then((data) => data);
      if (accountStatus[0].user_accountStatus === "activated") {
        await trx("users")
          .withSchema("portal")
          .update({ user_accountStatus: "deactivated" })
          .where("user_id", "=", user_id)
          .returning("user_accountStatus")
          .then((data) => res.json(data[0]));
      } else {
        await trx("users")
          .withSchema("portal")
          .update({ user_accountStatus: "activated" })
          .where("user_id", "=", user_id)
          .returning("user_accountStatus")
          .then((data) => res.json(data[0]));
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const handleUnlockAccount = async (req, res, db) => {
  const { user_username } = req.body;
  const login_data = {
    login_attempts: null,
    login_lockExpiration: null,
    login_datetime: null,
  };
  db("login")
    .withSchema("portal")
    .update(login_data)
    .where("user_username", "=", user_username)
    .returning("*")
    .then((data) => res.json(data));
};

const handleGetUsers = (req, res, db) => {
  db("users")
    .withSchema("portal")
    .select("*")
    .rightJoin("employees", "users.emp_id", "employees.emp_id")
    .leftJoin("roles", "users.role_id", "roles.role_id")
    .leftJoin("offices", "employees.office_id", "offices.office_id")
    .then((data) => res.json(data));
};

const handleGetUser = (req, res, db, jwt, secretKey) => {
  // const decoded_token = jwt.verify(req.body.accessToken, secretKey);
  db("users")
    .withSchema("portal")
    .select("*")
    .rightJoin("employees", "users.emp_id", "employees.emp_id")
    .leftJoin("roles", "users.role_id", "roles.role_id")
    .leftJoin("offices", "employees.office_id", "offices.office_id")
    .where("users.user_id", "=", req.user.user_id)
    .then((data) => res.json(data));
};

const handleGetGroups = (req, res, db) => {
  db('groups')
  .withSchema('portal')
  .select('*')
  .then(data => res.json(data))
}

module.exports = {
  handleRegister,
  handleUpdate,
  handleDelete,
  handleActivation,
  handleUnlockAccount,
  handleGetUsers,
  handleGetUser,
  handleGetGroups
};
