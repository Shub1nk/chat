const io = require('socket.io')();

const usersList = [];

io.on('connection', (socket) => {
  // тут можно генерировать события для клиента
  // console.log(socket);
  console.log(usersList);

  if(usersList !== 0) {
    io.emit('renderUserStatusList', usersList);
  }

  var userId = (socket.id).toString().substr(0,7);
  console.log(`${userId} connected`);

  socket.broadcast.emit('newUserConnect', userId)
  socket.emit('userName', userId); 

  socket.on("message", msg => {
    socket.broadcast.emit("message", msg);    
  });

  socket.on('statusConnected', (userName, status, userObj) => {
    if (usersList.length === 0) {
      usersList.push(userObj);
    } 
    else {
      var count = 0;
      usersList.forEach((user, i) => {
        
        if (user.id === userObj.id) {
          count++
          user.isWork = userObj.isWork;
        }
      });

      if (count === 0) {
        usersList.push(userObj)
      }
    }

    socket.broadcast.emit('statusConnected', userName, status);

    io.emit('renderUserStatusList', usersList);
    
  });

  socket.on('killUser', (userName, userObj) => {
    socket.broadcast.emit('killUser', userName);

    if (userObj) {
 
      var index;
      usersList.forEach((user, i) => {
        if(user.id === userObj.id) {
          index = i;
        }
      });
 
      usersList.splice(index, 1);
      io.emit('renderUserStatusList', usersList);
    }
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);