var express = require("express")
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// app.get("/", function(req, res) {
//   // res.send('<h1>Hello world</h1>');
//   res.sendFile(__dirname + "/index.html");
// });

app.use(express.static(__dirname + '/public'))

var userLists = []

io.on("connection", socket => {

  var userInfo = {}

  var userId = "U_" + (socket.id).toString().substr(1,6);
  console.log(userId);
  console.log("a " + userId + " connected");

  socket.broadcast.emit('newUserConnect', userId);

  socket.emit('userName', userId);

  socket.on("message", msg => {
    socket.broadcast.emit("message", msg);    
  });

  socket.on('statusConnected', (userName, status) => {
    socket.broadcast.emit('statusConnected', userName, status);
  });

  socket.on('killUser', userName => {
    socket.broadcast.emit('killUser', userName);
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
