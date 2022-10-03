/*
  This file is for handling login request of user.
  It uses bcrypt encryption method to compare the encrypted password and the inputed password by the user.
  Packages imported in this file are:
    moment.js for date and time formatting
    dotenv for fetching configuration
  This file is imported in server.js file
*/

const moment = require("moment");
const bcrypt = require("bcrypt");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const createLoginTimestamp = (user_username, db) => {
  db("login").withSchema("portal").update({login_datetime: db.fn.now()}).where("user_username", "=", user_username)
  .catch(console.log);
}

const resetLoginTimestamp = (timestamp, user_username, db) => {
  const dt = moment(timestamp).fromNow()
  if(dt === "a day ago"){
    db("login").withSchema("portal").update({login_datetime: null, login_attempts: 0}).where("user_username", "=", user_username)
    .catch(console.log);
  }
}


const createLockMessage = (login_lockExpiration) => {
  const accountLockedInfo = `Account is locked for ${moment(login_lockExpiration).fromNow(true)}. You can call your system administrator for assistance`
  return accountLockedInfo;
}

const createResponse = (type="", message="", payload) => {
  const response_data = {
    type, 
    message,
    payload,
  }
  return response_data;
}

const resetLoginAttempt = (user_username, db) => {
  db("login").withSchema("portal").update({login_lockExpiration: null, login_attempts: 0}).where("user_username", "=", user_username)
  .returning("login_attempts")
  .then(data => data)
  .catch(console.log);
}

const handleLogin = (req, res, jwt, db) => {
  const { username, password } = req.body;


  db("login")
    .withSchema("portal")
    .select("*")
    .where( "user_username", '=', username ) // check if user exists
    .then((login_data) => {
      if(login_data.length === 0) {
        return res.status(401).json(createResponse("login_wrong_username", "Wrong Username"))// if username doesn't exist in database
      }
      
      const {user_username, login_hash, login_attempts, login_lockExpiration, login_datetime} = login_data[0]

      resetLoginTimestamp(login_datetime, user_username, db) // reset login timestamp after 1 day

      bcrypt.compare(password, login_hash, function (err, result) {// check if req.password match the hash
        if (result) { // if password is correct
          db("users").withSchema("portal").select("*").where({user_username: user_username})
          .then(user_data => {
            const userData = user_data[0]

            if(userData.user_accountStatus === "activated" && login_lockExpiration === null){// users.user_accountStatus === activated && login.login_lockExpiration === null
              resetLoginAttempt(user_username, db);

              const accessToken = jwt.sign({
                user_id: userData.user_id,
                user_username: userData.user_username,
                role_id: userData.role_id
              }, secretKey)

              const data = {
                user: userData,
                accessToken
              }
              const response_data = createResponse("login_success", "", data)// pass user data sa front end
              res.json(response_data)
            }else if(userData.user_accountStatus === "activated" && login_lockExpiration !== null){// else users.user_accountStatus === activated && login.login_lockExpiration !== null
              if(moment(login_lockExpiration).isAfter(Date.now())){// kung expiration date > now()
                const response_data = createResponse("login_locked", createLockMessage(login_lockExpiration))
                res.json(response_data)
              }else if(moment(login_lockExpiration).isBefore(Date.now())){ //at kung expiration date < now()
                  resetLoginAttempt(user_username, db);//update yung lockexpiration = null tapos attempts = 0

                  const accessToken = jwt.sign({
                    user_id: userData.user_id,
                    user_username: userData.user_username,
                    role_id: userData.role_id
                  }, secretKey)
    
                  const data = {
                    user: userData,
                    accessToken
                  }
                  const response_data = createResponse("login_success", "", data)// pass user data sa front end
                  res.json(response_data)
              }
            }else{
              res.json(createResponse("login_deactivated", "Account is deactivated. Contact system administrator."));// kung deactivated naman inform user na naka deactivate account niya
            }

          });

        } 

        else { // if mali ang password

          if(login_datetime === null){
            createLoginTimestamp(user_username, db); // set timestamp of login
          }

          if(login_attempts !== 5){//kung login_attempts !== 5
            db("login").withSchema("portal").update({login_attempts: login_attempts + 1}).where("user_username", "=", user_username)
            .returning(["login_attempts", "login_lockExpiration"])
            .then(login_attempts_data => {
              if(login_attempts_data[0].login_attempts === 5){
                const expDate = new Date(moment().add(30, "m"))
                db("login").withSchema("portal").update({login_lockExpiration: expDate}).where("user_username", "=", user_username)
                .returning("login_lockExpiration")
                .then(login_lockExpiration_data => {
                  res.json(createResponse("login_locked", createLockMessage(login_lockExpiration_data[0])))
                });// login_lock_expiration = now() + 30minutes 
              }
              else{
                res.json(createResponse("login_wrong_password", "Wrong Password", login_attempts_data[0].login_attempts))
              }
            });// login_attempts + 1
          }
          else{ //kung naka 5 attempts na
            if(moment(login_lockExpiration).isBefore(Date.now())){ //at kung expiration date < now()
              db("login").withSchema("portal").update({login_lockExpiration: null, login_attempts: 1}).where("user_username", "=", user_username)
              .returning("login_attempts")
              .then(data => {
                res.json(createResponse("login_wrong_password", "Wrong Password", data))
              })
              .catch(console.log);
            }else{
              res.json(createResponse("login_locked",  createLockMessage(login_lockExpiration)))
            }
          }

        }


      }); ////// end of bcrypt
    }) // db query data
    .catch((err) => console.log(err)); 
};// end of login handler

module.exports = {
  handleLogin,
};
