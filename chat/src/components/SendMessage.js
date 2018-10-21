import React, { Component } from "react";

// import openSocket from "socket.io-client";
// const socket = openSocket("http://localhost:8000");

class SendMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  componentDidMount() {
    // socket.on("message", msg => {
    //   console.log('!!!!!!!!!!!!!!!!!!!!MSG!!!!!!!!!!!!!!!!!!!!!!!!!')
    //   let messageObj = {
    //     id: this.props.idMessage + 1,
    //     content:
    //       "<div class='person-2'><span>" +
    //       msg.author +
    //       ": </span>" +
    //       msg.content +
    //       "</div>",
    //     author: this.props.currentUser
    //   };

    //   this.props.addMessage(messageObj);
    // });
  }

  setTextMessage = event => {
    event.preventDefault();

    // чистый объект сообщения
    let messageObj = {
      id: this.props.idMessage + 1,
      author: this.props.currentUser,
      content: 
      "<div class='person-1'><span>Вы: </span>" + this.state.value + "</div>",
      text: this.state.value
    };

    this.props.addMessage(messageObj);

    this.setState({value: ''});

    // socket.emit("message", messageObj);
  };

  getMessage = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <form id="form" onSubmit={this.setTextMessage}>
        <input
          id="input"
          type="text"
          value={this.state.value}
          onChange={this.getMessage}
        />
        <button
          id="send"
          disabled={this.state.value.length > 0 ? "" : "disabled"}
        >
          Send
        </button>
      </form>
    );
  }
}

// function SendMessage(props) {
//   let messageLength = "";

//   function getTextMessage(event) {
//     let messageObj = {
//       id: props.idMessage + 1,
//       author: props.currentUser,
//       content: event.target.value
//     };

//     props.addMessage(messageObj);
//   }

//   function getLengthMessage(event) {
//     messageLength = event.target.value.length;
//     console.log(messageLength);
//   }

//   return (
//     <form id="form" onSubmit={getTextMessage}>
//       <input id="input" type="text" onChange={getLengthMessage} />
//       <button id="send" disabled={messageLength > 0 ? "" : "disabled"}>
//         Send
//       </button>
//     </form>
//   );
// }

export default SendMessage;
