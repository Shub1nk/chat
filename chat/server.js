const io = require('socket.io')();

const usersList = [];

io.on('connection', (socket) => {
  
  // если есть пользователи, отправляем событие для рендера списка пользователей и их статусов слева от чата
  if(usersList !== 0) {
    io.emit('renderUserStatusList', usersList);
  }

  // Вновь подключившемуся пользователю присваиваем уникальный идентификатор - 7 символов от идентификатора сокета
  var userId = (socket.id).toString().substr(0,7);
  console.log(`${userId} connected`);

  // Отправляем сообщение пользователям 
  socket.broadcast.emit('newUserConnect', userId)
  socket.emit('userName', userId); 

  // Слушаем событие отправки сообщения в чат
  socket.on("message", msg => {
    socket.broadcast.emit("message", msg);    
  });

  // Подключаем пользователя к чату
  socket.on('statusConnected', (userName, status, userObj) => {
    // Первого пользователя добавляем сразу, остальных только если при проверке нет совпадений идентификаторов
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

    // Отправляем сообщение пользователям об изменении статуса текущего пользователя
    socket.broadcast.emit('statusConnected', userName, status);

    // Повторный рендеринг списка пользователей слева от чата
    io.emit('renderUserStatusList', usersList);
    
  });

  // Слушаем событие выхода пользователя из чата (перезагрузка/закрытие странички/нажатие кнопки "Покинуть чат")
  socket.on('killUser', (userName, userObj) => {
    
    // Сообщаем другим, что пользователь покинул чат
    socket.broadcast.emit('killUser', userName);

    // Удаляем из списка пользователей
    if (userObj) {
 
      var index;
      usersList.forEach((user, i) => {
        if(user.id === userObj.id) {
          index = i;
        }
      });
 
      usersList.splice(index, 1);

      // Рендерим список пользователей
      io.emit('renderUserStatusList', usersList);
    }
  });

  // Слушаем событие разрыва соединения сокета и удаляем из списка пользователя с текущим идентификатором
  socket.on("disconnect", function() {
    // console.log("user disconnected", userId);
    // console.log("user disconnected");
    // console.log("users " + usersList.length);

    var index;
      usersList.forEach((user, i) => {
        console.log(user.id + '=' + userId);
        if(user.id === userId) {
          index = i;
        }
      });
 
      usersList.splice(index, 1);
      io.emit('renderUserStatusList', usersList);

  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);