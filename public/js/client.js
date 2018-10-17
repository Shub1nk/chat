"use strict";

var socket = io();

console.log(socket);

var messagesList = document.getElementById("messages");
var greeting = document.getElementById("greeting");
var rename = document.getElementById("rename");
var oldName = '';



rename.addEventListener("blur", e => {

  var newName = e.target.value;

  if (oldName !== newName) {
    socket.emit("createNewName", oldName, newName);

    var li = document.createElement("li");
    li.innerHTML =
      "Вы сменили имя с <b>" + oldName + " </b>на <b>" + newName + "</b>";
    messagesList.appendChild(li);
  }
});

socket.on('createNewName', (oldName, newName) => {
  var li = document.createElement("li");
  li.innerHTML =
    "Пользователь <b>" + oldName + " </b> сменил имя на <b>" + newName + "</b>";
  messagesList.appendChild(li);
})

socket.on("userName", userName => {
  // console.log('Нихуя себе! Твой ник ' + userName + '! Пиздец, да!');
  var li = document.createElement("li");
  li.innerHTML = "Добро пожаловать! <br><br> Для Вас было сгенерировано случайное имя - <b>" + userName + "</b>!<br> Его можно сменить в поле 'Ваше имя'" ;
  messagesList.appendChild(li);
  // greeting.innerHTML = 'Ваш ID: ' + '<span>' + userName + '</span>';
  rename.value = userName;
  oldName = userName;
});

socket.on("newUserConnect", userName => {
  console.log("Подключился новый пользователь " + userName);
  var li = document.createElement("li");
  li.innerHTML = "Подключился новый пользователь <b>" + userName + "</b>!";
  messagesList.appendChild(li);
});

var input = document.getElementById("m");
var form = document.getElementById("form");
// var user = document.getElementById("user");
// var status = document.getElementById("status");

// console.log(status);

var message = {};

form.addEventListener("submit", e => {
  e.preventDefault();

  var currentUser = rename.value;

  message.user = currentUser;
  message.textarea = input.value;

  socket.emit("message", message);

  console.log(input.value);
  input.value = "";
  var li = document.createElement("li");
  li.innerHTML = "<span>Вы: </span>" + message.textarea;
  li.classList.add("person-1");
  messagesList.appendChild(li);
});

socket.on("message", msg => {
  var li = document.createElement("li");
  li.innerHTML = "<span>" + msg.user + ": </span>" + msg.textarea;
  li.classList.add("person-2");
  messagesList.appendChild(li);
});
