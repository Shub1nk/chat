var express = require("express")
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// app.get("/", function(req, res) {
//   // res.send('<h1>Hello world</h1>');
//   res.sendFile(__dirname + "/index.html");
// });

app.use(express.static(__dirname + '/public'))

var usersList = []

io.on("connection", socket => {

  if (usersList.length !== 0) {
    io.emit('renderUserStatusList', usersList);
  }

  var userId = (socket.id).toString().substr(0,7);
  // console.log(userId);
  // console.log("a " + userId + " connected");
  
  socket.broadcast.emit('newUserConnect', userId);

  socket.emit('userName', userId); 

  socket.on("message", msg => {
    socket.broadcast.emit("message", msg);    
  });

  socket.on('statusConnected', (userName, status, userObj) => {
    if (usersList.length === 0) {
      usersList.push(userObj);
      // console.log('1 Пользователь подключился')
    } 
    else {
      var count = 0;
      usersList.forEach((user, i) => {
        // console.log(i + '-', user)
        
        if (user.id === userObj.id) {
          count++
          // console.log('Есть совпадение')
          user.isWork = userObj.isWork;
        }
      });

      // console.log('----------')

      if (count === 0) {
        usersList.push(userObj)
      }
      
    }

    socket.broadcast.emit('statusConnected', userName, status);

    io.emit('renderUserStatusList', usersList);
    
  });

  socket.on('killUser', (userName, userObj) => {
    socket.broadcast.emit('killUser', userName);
    // console.log(userObj);

    if (userObj) {
// 
      var index;
      usersList.forEach((user, i) => {
        if(user.id === userObj.id) {
          // console.log('Есть совпадение удалить нужно' + i, user)
          index = i;
        }
      });
// 
      usersList.splice(index, 1);
      // console.log(usersList)
      io.emit('renderUserStatusList', usersList);
    }
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
