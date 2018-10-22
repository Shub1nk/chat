import React, { Component } from "react";

class SendMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
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

export default SendMessage;