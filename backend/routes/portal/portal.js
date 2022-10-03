// portal requests
const login = require('../../controllers/portal/login');
const account = require('../../controllers/portal/account')
const offices = require('../../controllers/portal/offices')
const roles = require('../../controllers/portal/roles')
const permission = require('../../controllers/portal/permission')

module.exports = function(app, authenticateToken, jwt, db, SECRET_KEY){
    app.post("/login", (req, res) => {
        login.handleLogin(req, res, jwt, db);
      });
      
      app.post("/createAccount", authenticateToken, (req, res) => {
        account.handleRegister(req, res, db);
      });
      
      app.post("/updateAccount", authenticateToken, (req, res) => {
        account.handleUpdate(req, res, db);
      });
      
      app.post("/deleteAccount", authenticateToken, (req, res) => {
        account.handleDelete(req, res, db);
      });
      
      app.get("/getGroups", authenticateToken, (req, res) => {
        account.handleGetGroups(req, res, db);
      });

      app.post("/accountActivation", authenticateToken, (req, res) => {
        account.handleActivation(req, res, db);
      });
      
      app.post("/accountUnlock", authenticateToken, (req, res) => {
        account.handleUnlockAccount(req, res, db);
      });
      
      app.get("/getUsers", authenticateToken, (req, res) => {
        account.handleGetUsers(req, res, db);
      });
      
      app.post("/getUser", authenticateToken, (req, res) => {
        account.handleGetUser(req, res, db, jwt, SECRET_KEY);
      });
      
      app.get("/getOffices", authenticateToken, (req, res) => {
        offices.handleGetOffices(req, res, db)
      })
      
      app.get("/getRoles", authenticateToken, (req, res) => {
        roles.handleGetRoles(req, res, db)
      })
      
      app.get("/getPermissions", authenticateToken, (req, res) => {
        roles.handleGetPermissions(req, res, db)
      })
      
      app.post("/getRolePermissions", authenticateToken, (req, res) => {
        roles.handleGetRolePermissions(req, res, db);
      })
      
      app.post("/addRole", authenticateToken, (req, res) => {
        roles.handleAddRole(req, res, db);
      })
      
      app.post("/updateRole", authenticateToken, (req, res) => {
        roles.handleUpdateRole(req, res, db);
      })
      
      app.post("/deleteRole", authenticateToken, (req, res) => {
        roles.handleDeleteRole(req, res, db);
      })

      app.get('/getUserRolePermission', authenticateToken, (req, res) => {
        permission.handleGetRolePermissions(req, res, db)
      });
      
}