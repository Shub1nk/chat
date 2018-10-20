"use strict";

const socket = io();
console.log(socket);

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWork: false,
      showChat: true,
      currentMessage: "",
      messages: [],
      userId: "",
      userName: "",
      // currentUserInfo: { id: null, name: null, isWork: false },
      usersList: []
    };

    this.workStatus = this.workStatus.bind(this);
    this.workStatusEnterPress = this.workStatusEnterPress.bind(this);
    this.leaveChat = this.leaveChat.bind(this);
    this.alertUser = this.alertUser.bind(this);

    this.writeCurrentMessage = this.writeCurrentMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    // Информация о пользователе

    socket.on("userName", userId => {
      this.setState({ userId: userId });
      // this.state.currentUserInfo.id = userId;

      // системное событие
      let systemEvent =
        "<div>Добро пожаловать! <br><br> Для Вас был сгенерирован случайный ID: <b>" +
        userId +
        "</b>!<br> Прежде чем подключиться к чату и получить возможность отправлять сообщения, введите Ваше имя. <hr>";

      this.setState({ messages: [...this.state.messages, systemEvent] });
    });

    socket.on("newUserConnect", userId => {
      let systemEvent =
        "<div class='system-event__emit'>Подключился новый пользователь с ID: <b>" +
        userId +
        "</b></div>";
      this.setState({ messages: [...this.state.messages, systemEvent] });
    });

    socket.on("statusConnected", (userName, status) => {
      if (status === "connected") {
        let systemEvent =
          "<div class='system-event__emit'><b>" +
          userName +
          " </b> подключился к чату</div>";
        this.setState({ messages: [...this.state.messages, systemEvent] });
      } else {
        let systemEvent =
          "<div class='system-event__emit'><b>" +
          userName +
          " </b> вышел из чата, но все еще может видеть вашу переписку! Будьте внимательны</div>";
        this.setState({ messages: [...this.state.messages, systemEvent] });
      }
    });

    socket.on("message", msg => {
      let systemEvent =
        "<div class='person-2'><span>" +
        msg.author +
        ": </span>" +
        msg.text +
        "</div>";
      this.setState({ messages: [...this.state.messages, systemEvent] });
    });

    socket.on("killUser", userName => {
      let systemEvent =
        "<div class='system-event__emit'><b>" +
        userName +
        " </b> закрыл чат и теперь не сможет уже надлюдать за вашим общением</div>";
      this.setState({ messages: [...this.state.messages, systemEvent] });
    });

    //---------------------
    socket.on("renderUserStatusList", usersList => {
      // let usersInfo = []

      usersList.map(user => {
        user.html =
          "<b>" +
          user.name +
          "</b> <i>" +
          (user.isWork ? "на паузе" : "в работе") +
          "</i>";

        // usersInfo.push(currentUser)
        // if (!user.isWork) {
        //   li.classList.add("pause");
        // }
      });

      this.setState({ usersList: usersList });
    });
  }

  // workStatusEnterPress(event) {
  //   console.log(event);
  //   // if (event.keyCode === 13) {
  //   //   this.workStatus();
  //   // }
  //   if (event.keyCode == 13) {
  //     alert("Adding....");
  //   }
  // }

  // Включаемся в работу/Ставим на паузу
  workStatus() {
    this.setState(state => ({
      isWork: !state.isWork
    }));

    let currentUserInfo = {
      id: this.state.userId,
      name: this.state.userName
    };

    // Здесь состояние не успевает еще переписаться, поэтому от обратного пока идет ситуация
    if (!this.state.isWork) {
      let systemEvent =
        "<div class='system-event'>Ваше имя в чате <b>" +
        this.state.userName +
        "</b>. Теперь вы можете отправлять сообщения</div>";

      currentUserInfo.isWork = this.state.isWork;

      this.setState(state => ({
        messages: [...this.state.messages, systemEvent]
      }));

      socket.emit(
        "statusConnected",
        userName.value,
        "connected",
        currentUserInfo
      );
    } else {
      let systemEvent =
        "<div class='system-event'>Вы отключились от чата</div>";

      this.setState(state => ({
        messages: [...this.state.messages, systemEvent]
      }));

      currentUserInfo.isWork = this.state.isWork;

      socket.emit(
        "statusConnected",
        userName.value,
        "disconnected",
        currentUserInfo
      );
    }
  }

  alertUser(event) {
    this.setState({
      userName: event.target.value
    });
  }

  writeCurrentMessage(event) {
    this.setState({ currentMessage: event.target.value });
  }

  sendMessage(event) {
    let message = {};

    if (this.state.currentMessage) {
      let currentUser = this.state.userName;

      message.author = currentUser;
      message.text = this.state.currentMessage;

      socket.emit("message", message);

      let myMessage =
        "<div class='person-1'><span>Вы: </span>" + message.text + "</div>";

      this.setState({ messages: [...this.state.messages, myMessage] });
      document.getElementById("input").value = "";
    }
    event.preventDefault();
  }

  // Покидаем чат
  leaveChat() {
    let currentUserInfo = {
      id: this.state.userId,
      name: this.state.userName,
      isWork: this.state.isWork
    };

    if (this.state.userName.length) {
      let systemEvent =
        "<div class='system-event'><b>Вы</b> отключились от чата! Теперь для вас не доступна переписка других пользователей</div>";
      socket.emit("killUser", this.state.userName, currentUserInfo);
      this.setState({ messages: [...this.state.messages, systemEvent] });
    } else {
      let systemEvent =
        "<div class='system-event'><b>Вот так сразу уходите!? Вы даже не попробовали!</b></div>";
      this.setState({ messages: [...this.state.messages, systemEvent] });
    }
    socket.close();

    setTimeout(() => {
      this.setState(state => ({
        showChat: !state.showChat
      }));
    }, 5000);
  }

  render() {
    return (
      <div>
        {this.state.showChat ? (
          <section className="chat">
            <div className="greeting">
              Ваше имя:{" "}
              <input
                type="text"
                id="userName"
                value={this.state.userName}
                autoFocus
                onChange={this.alertUser} // TODO: Переименовать  метод
                // onKeyPress={this.workStatusEnterPress}
              />
              <button
                id="access"
                disabled={this.state.userName.length === 0 ? "disabled" : ""}
                onClick={this.workStatus}
                style={{ backgroundColor: this.state.isWork ? "orange" : "" }}
              >
                {this.state.isWork ? "Pause" : "Work"}
              </button>
            </div>

            <ul
              id="users-list"
              style={{
                left: this.state.usersList.length > 0 ? "-235px" : "0px"
              }}
            >
              <p>
                Пользователей в чате: <b>{this.state.usersList.length}</b>
              </p>
              {this.state.usersList.map(user => {
                return (
                  <li
                    dangerouslySetInnerHTML={{ __html: user.html }}
                    className={user.isWork ? "pause" : ""}
                  />
                );
              })}
            </ul>

            <ul id="messages">
              {this.state.messages.map(message => {
                return <li dangerouslySetInnerHTML={{ __html: message }} />;
              })}
            </ul>
            <form id="form" onSubmit={this.sendMessage}>
              <input
                id="input"
                type="text"
                onChange={this.writeCurrentMessage}
              />
              <button id="send" disabled={this.state.isWork ? "" : "disabled"}>
                Send
              </button>
            </form>

            <div className="b-closeSocket">
              <button id="closeSocket" onClick={this.leaveChat}>
                Покинуть чат
              </button>
            </div>
          </section>
        ) : (
          <section className="disconnected">
            <h1>Вы покинули чат!</h1>
          </section>
        )}
      </div>
    );
  }
}

ReactDOM.render(<Chat />, document.getElementById("app"));
