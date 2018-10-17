var express = require("express")
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// app.get("/", function(req, res) {
//   // res.send('<h1>Hello world</h1>');
//   res.sendFile(__dirname + "/index.html");
// });

app.use(express.static(__dirname + '/public'))

io.on("connection", socket => {
  

  var userName = "U_" + (socket.id).toString().substr(1,6);
  console.log(userName);
  console.log("a " + userName + " connected");

  socket.broadcast.emit('newUserConnect', userName);

  socket.emit('userName', userName);

  socket.on("message", msg => {
    socket.broadcast.emit("message", msg);    
  });

  socket.on('createNewName', (oldName, newName) => {
    socket.broadcast.emit('createNewName', oldName, newName);
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
