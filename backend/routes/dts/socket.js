/*
  This file is for handles websockets events for notifications.
*/
module.exports = (io) => {
    let onlineUsers = []

    const addNewUser = (userData) => {
        // console.log(userData)
        const exist = onlineUsers.filter(user => user.userid === userData.user_id)
        exist.length === 0 && onlineUsers.push(userData)
      };
      

      const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
      };

      const getUser = (user_id) => {
        return onlineUsers.filter((user) => user.user_id === user_id);
      };
      


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


        socket.on('sendNotification', async ({to, notification}) => {
            // console.log(to + " " + message)
            // socket.emit('receiveNotification', to + " " + message)
            const users = getUser(to);
            users.forEach(user => {
                socket.to(user.socketId).emit('receiveNotification', notification);
            })
            
        });
        
        socket.on('disconnect', () => {
            removeUser(socket.id)
        })
    })
}