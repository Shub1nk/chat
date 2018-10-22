import React, { Component } from "react";

class MessagesList extends Component {
  constructor(props) {
    super(props);
    this.list = React.createRef();
  }

  shouldComponentUpdate() {
    function scrollTop(el) {
      var height = el.current.children.length * 500;
      el.current.scrollTop = height;
    }
    scrollTop(this.list);
    return true;
  }

  componentDidMount() {}

  render() {
    return (
      <ul id="messages" ref={this.list}>
        {this.props.messages.map(message => {
          return (
            <li
              key={message.id}
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
          );
        })}
      </ul>
    );
  }
}

export default MessagesList;