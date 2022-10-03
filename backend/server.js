/*
  This file is for controlling and handling api requests from the frontend.
  Packages imported in this file are:
    expressjs used for building apis
    dotenv for fetching configuration
    bodyparser for parsing json from the body of requests
    cors Cross-Origin Resource Sharing
    jsonwebtoken creating accesstoken for users
*/

const bodyParser = require("body-parser");
const cors = require("cors");
var jwt = require('jsonwebtoken');
const express = require("express");
const app = express();
const http = require('http').Server(app);
const _ = require('lodash')

const io = require('socket.io')(http, {
  cors: {
    origin: ['http://122.54.74.73', 'http://localhost:3000', 'http://192.168.68.109:3000', 'http://172.16.21.43:3000' ]
  }
});




// require env 
require("dotenv").config();
app.use(cors({
  origin: ['http://122.54.74.73', 'http://localhost:3000' , 'http://192.168.68.109:3000', 'http://172.16.21.43:3000']
}));
app.use(bodyParser.json());

// database connection
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const USER = 'postgres';
const PASSWORD = process.env.PASSWORD;
const SECRET_KEY = process.env.SECRET_KEY;

const db = require("knex")({
  client: "pg",
  connection: {
    host: HOST,
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: "dbPortal",
  },
});

// verify access token middle ware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  });
}

app.use(express.static('uploads'))

  let onlineUsers = []

  const addNewUser = (userData) => {
      // console.log(userData)
      const exist = onlineUsers.filter(user => user.user_id === userData.user_id)
      if(_.isEmpty(exist)){
        onlineUsers.push(userData)
      }
      // console.log(onlineUsers)
  };
    
  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  };

  const getUser = (user_id) => {
    return  onlineUsers.filter((user) => user.user_id === user_id);
  };
  
  const receiveNotification = (to, notification, socket) =>  {
    const users = getUser(to);
    // console.log(users[0])
    users.forEach(user => {
        socket.to(user.socketId).emit('receiveNotification', notification);
    })
    // console.log(onlineUsers)
  }

  io.on('connection', socket => {
      
      socket.on('addNewUser', (user_data) => {
          user_data.user_username &&
          addNewUser(
              {
                  socketId: socket.id, 
                  username: user_data.user_username,
                  user_id: user_data.user_id,
                  fullname: `${user_data.emp_firstname} ${user_data.emp_lastname}`
              }
          )
      });

      require('./routes/portal/portal')(app, authenticateToken, jwt, db, SECRET_KEY);
      // dts/classifications requests
      require('./routes/dts/classifications')(app, authenticateToken, jwt, db, SECRET_KEY);
      // dts/communications requests
      require('./routes/dts/communications')(app, authenticateToken, db, socket, receiveNotification);
      // dts/routing requests
      require('./routes/dts/routing')(app, authenticateToken, db, socket, receiveNotification);
      // dts/action taken
      require('./routes/dts/action_taken')(app, authenticateToken, db, socket, receiveNotification);
      // dts/reports
      require('./routes/dts/reports')(app, authenticateToken, db);
      // dts/uploads
      require('./routes/dts/uploads')(app, authenticateToken, db);
      
      socket.on('disconnect', () => {
          removeUser(socket.id)
      })

  });


// // web sockets
// require('./routes/dts/socket')(io);
// // portal requests
// require('./routes/portal/portal')(app, authenticateToken, jwt, db, SECRET_KEY);
// // dts/classifications requests
// require('./routes/dts/classifications')(app, authenticateToken, jwt, db, SECRET_KEY);
// // dts/communications requests
// require('./routes/dts/communications')(app, authenticateToken, jwt, db, SECRET_KEY, io);
// // dts/routing requests
// require('./routes/dts/routing')(app, authenticateToken, db, io);


const port = 3001;
http.listen(port, () => console.log(`Listening on port ${port}`));