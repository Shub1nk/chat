"use strict";

var socket = io();

window.scrollTo(0, document.body.scrollHeight);

var messagesList = document.getElementById("messages");
var greeting = document.getElementById("greeting");
var userName = document.getElementById("userName");
var access = document.getElementById("access");
var send = document.getElementById("send");
var input = document.getElementById("input");
var oldName = "";

// Информация о пользователе
var currentUserInfo = { id: null, name: null, isWork: false };

var closeSocket = document.getElementById("closeSocket");

closeSocket.onclick = () => {
  if (userName.value.length) {
    var li = document.createElement("li");
    li.innerHTML =
      "<b>Вы</b> отключились от чата! Теперь для вас не доступна переписка других пользователей";
    messagesList.appendChild(li);
    socket.emit("killUser", userName.value, currentUserInfo);
  } else {
    var li = document.createElement("li");
    li.innerHTML = "<b>Вот так сразу уходите!? Вы даже не попробовали!</b>";
    messagesList.appendChild(li);
  }
  socket.close();

  setTimeout(() => {
    var disconnected = document.getElementsByClassName("disconnected");
    var chat = document.getElementsByClassName("chat");
    disconnected[0].style.display = "block";
    chat[0].style.display = "none";
  }, 2000);
};

access.addEventListener("click", () => {
  // Навешиваем событие для получения доступа/выхода из чата
  if (access.innerText === "Sign in") {
    access.innerText = "Sign out";
    access.style.background = "red";
    send.disabled = false;
    input.style.border = "2px solid blue";
    var li = document.createElement("li");
    li.innerHTML =
      "Ваше имя в чате <b>" +
      userName.value +
      "</b>. Теперь вы можете отправлять сообщения";
    messagesList.appendChild(li);

    // Добавляем имя пользователя в объект
    currentUserInfo.name = userName.value;
    currentUserInfo.isWork = true;

    console.log(currentUserInfo);

    socket.emit(
      "statusConnected",
      userName.value,
      "connected",
      currentUserInfo
    );
  } else {
    access.innerText = "Sign in";
    access.style.background = "green";
    send.disabled = true;
    input.style.border = "2px solid gray";
    var li = document.createElement("li");
    li.innerHTML = "Вы отключились от чата";
    messagesList.appendChild(li);

    currentUserInfo.isWork = false;
    console.log(currentUserInfo);

    socket.emit(
      "statusConnected",
      userName.value,
      "disconnected",
      currentUserInfo
    );
  }
});

userName.addEventListener("input", () => {
  if (userName.value.length === 0) {
    access.disabled = true;
  } else {
    access.disabled = false;
  }
});

socket.on("statusConnected", (userName, status) => {
  if (status === "connected") {
    var li = document.createElement("li");
    li.innerHTML = "<b>" + userName + " </b> подключился к чату";
    messagesList.appendChild(li);
  } else {
    var li = document.createElement("li");
    li.innerHTML =
      "<b>" +
      userName +
      " </b> вышел из чата, но все еще может видеть вашу переписку! Будьте внимательны";
    messagesList.appendChild(li);
  }
});

socket.on("killUser", userName => {
  var li = document.createElement("li");
  li.innerHTML =
    "<b>" +
    userName +
    " </b> закрыл чат и теперь не сможет уже надлюдать за вашим общением";
  messagesList.appendChild(li);
});

socket.on("userName", userId => {
  currentUserInfo.id = userId;
  console.log(currentUserInfo);

  var li = document.createElement("li");
  li.innerHTML =
    "Добро пожаловать! <br><br> Для Вас был сгенерирован случайный ID - <b>" +
    userId +
    "</b>!<br> Прежде чем подключиться к чату и получить возможность отправлять сообщения, введите Ваше имя. <hr>";
  messagesList.appendChild(li);
  // userName.value = userId;
  oldName = userId;
});

socket.on("newUserConnect", userId => {
  var li = document.createElement("li");
  li.innerHTML = "Подключился новый пользователь с ID <b>" + userId + "</b>!";
  messagesList.appendChild(li);
});

var form = document.getElementById("form");

var message = {};

form.addEventListener("submit", e => {
  e.preventDefault();

  if (input.value) {
    var currentUser = userName.value;

    message.user = currentUser;
    message.textarea = input.value;

    socket.emit("message", message);

    input.value = "";
    var li = document.createElement("li");
    li.innerHTML = "<span>Вы: </span>" + message.textarea;
    li.classList.add("person-1");
    messagesList.appendChild(li);
    window.scrollTo(0, messagesList);
  }
});

socket.on("message", msg => {
  var li = document.createElement("li");
  li.innerHTML = "<span>" + msg.user + ": </span>" + msg.textarea;
  li.classList.add("person-2");
  messagesList.appendChild(li);
});

var usersListBlock = document.getElementById("users-list");
console.log(usersListBlock);

socket.on("renderUserStatusList", usersList => {

  usersListBlock.style.left = -200 + 'px';

  while (usersListBlock.firstChild) {
    usersListBlock.removeChild(usersListBlock.firstChild);
  }

  usersList.map(user => {
    var li = document.createElement("li");
    li.innerHTML =
      "<b>" +
      user.name +
      "</b> <i>" +
      (user.isWork ? "в работе" : "на паузе") +
      "</i>";
    if (!user.isWork) {
      li.classList.add("pause");
    }

    usersListBlock.appendChild(li);
  });

  console.log("В конце рендера");
  console.log(usersListBlock.innerHTML);
});
