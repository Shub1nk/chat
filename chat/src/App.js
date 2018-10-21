import React, { Component } from "react";
import "./App.css";
import LeaveChatMessage from "./components/LeaveChatMessage";
import LeaveChatButton from "./components/LeaveChatButton";
import SendMessage from "./components/SendMessage";
import Greeting from "./components/Greeting";
import UsersStatusList from "./components/UsersStatusList";
import MessagesList from "./components/MessagesList";

import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:8000");

// const socket = io();
// console.log(socket);



class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWork: false,
      showChat: true,
      currentMessage: "",
      messages: [],
      userId: "",
      userName: "",
      currentUserInfo: { id: null, name: "", isWork: false },
      usersList: []
    };
  }

  componentDidMount() {
    // Отрисовываем список пользователей в чате
    socket.on("renderUserStatusList", usersList => {
      usersList.map(user => {
        user.html = `<b>${user.name} </b><i>${
          user.isWork ? "на паузе" : "в работе"
        }`;
      });
      this.setState({ usersList: usersList });
    });

    // Приветствуем пользователя при инициализации чата
    socket.on("userName", userId => {
      this.setState({ userId: userId });

      let messageObj = {
        id: this.state.messages.length + 1,
        content:
          "<div>Добро пожаловать! <br><br> Для Вас был сгенерирован случайный ID: <b>" +
          userId +
          "</b>!<br> Прежде чем подключиться к чату и получить возможность отправлять сообщения, введите Ваше имя. <hr>",
        author: "system"
      };

      this.setState({ messages: [...this.state.messages, messageObj] });
    });

    // Отовещение участников о подключении нового пользователя
    socket.on("newUserConnect", userId => {
      let messageObj = {
        id: this.state.messages.length + 1,
        content:
          "<div class='system-event__emit'>Подключился новый пользователь с ID: <b>" +
          userId +
          "</b></div>",
        author: "system"
      };
      this.setState({ messages: [...this.state.messages, messageObj] });
    });

    // Оповещаем о присоединении пользователя к чату
    socket.on("statusConnected", (userName, status) => {
      let messageObj = {
        id: this.state.messages.length + 1,
        author: "system"
      };

      if (status === "connected") {
        messageObj.content =
          "<div class='system-event__emit'><b>" +
          userName +
          " </b> подключился к чату</div>";
        this.setState({ messages: [...this.state.messages, messageObj] });
      } else {
        messageObj.content =
          "<div class='system-event__emit'><b>" +
          userName +
          " </b> вышел из чата, но все еще может видеть вашу переписку! Будьте внимательны</div>";

        this.setState({ messages: [...this.state.messages, messageObj] });
      }
    });

    // Вывод сообщений от пользователей
    socket.on("message", msg => {

      if (msg.author !== this.state.userName) {
      }

      
      let messageObj = {
        id: this.state.messages.length + 1,
        content:  "<div class='person-2'><span>" +
        msg.author +
        ": </span>" +
        msg.text +
        "</div>",
        author: msg.author,
        text: msg.text
      };
      
      console.log('!!!!!!!!!!!!!!!!!!!!!',messageObj)
      this.setState({ messages: [...this.state.messages, messageObj] });
      } 

    );

    // Оповещаем о выходе пользователя из чата
    socket.on("killUser", userName => {
      let messageObj = {
        id: this.state.messages.length + 1,
        content:
          "<div class='system-event__emit'><b>" +
          userName +
          " </b> закрыл чат и теперь не сможет уже надлюдать за вашим общением</div>",
        author: "system"
      };
      this.setState({ messages: [...this.state.messages, messageObj] });
    });
  }

  // Включаемся/отключаемся от чата
  workStatus = () => {
    this.setState({ isWork: !this.state.isWork });

    let currentUserInfo = {
      id: this.state.userId,
      name: this.state.userName
    };

    let messageObj = {
      id: this.state.messages.length + 1,
      author: "system"
    };

    // Здесь состояние не успевает еще переписаться из-за ассинхронности, поэтому от обратного пока идет ситуация
    if (!this.state.isWork) {
      messageObj.content =
        "<div class='system-event'>Ваше имя в чате <b>" +
        this.state.userName +
        "</b>. Теперь вы можете отправлять сообщения</div>";

      currentUserInfo.isWork = this.state.isWork;

      this.setState({
        messages: [...this.state.messages, messageObj]
      });

      socket.emit(
        "statusConnected",
        this.state.userName,
        "connected",
        currentUserInfo
      );
    } else {
      messageObj.content =
        "<div class='system-event'>Вы отключились от чата</div>";

      this.setState({
        messages: [...this.state.messages, messageObj]
      });

      currentUserInfo.isWork = this.state.isWork;

      socket.emit(
        "statusConnected",
        this.state.userName,
        "disconnected",
        currentUserInfo
      );
    }
  };

  // выход из чата
  leaveChat = () => {
    this.setState({ showChat: !this.state.showChat });

    let currentUserInfo = {
      id: this.state.userId,
      name: this.state.userName,
      isWork: this.state.isWork
    };

    socket.emit("killUser", this.state.userName, currentUserInfo);
  };

  // Записать имя пользователя
  setUserName = userName => {
    this.setState({ userName: userName });
  };

  updateMessagesList = message => {
    socket.emit("message", message);

    this.setState({ messages: [...this.state.messages, message] });
  };

  render() {
    return (
      <div>
        {this.state.showChat ? (
          <section className="chat">
            <Greeting
              // user={this.state.currentUserInfo}
              isWork={this.state.isWork}
              updateStatus={this.workStatus}
              setUserName={this.setUserName}
              userName={this.state.userName}
            />
            <UsersStatusList usersList={this.state.usersList} />
            <MessagesList messages={this.state.messages} />
            {this.state.isWork && (
              <SendMessage
                currentUser={this.state.userName}
                idMessage={this.state.messages.length}
                addMessage={this.updateMessagesList}
              />
            )}

            <LeaveChatButton
              showChat={this.state.showChat}
              leaveChat={this.leaveChat}
            />
          </section>
        ) : (
          <LeaveChatMessage />
        )}
      </div>
    );
  }
}



export default Chat;
