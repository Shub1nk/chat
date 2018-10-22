import React, { Component } from "react";
import { css } from "glamor";
import ScrollToBottom from "react-scroll-to-bottom";

// const ROOT_CSS = css({
//   height: 600,
//   width: 500
// });

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

// function MessagesList(props) {

//   return (
//     // <ScrollToBottom className={ROOT_CSS}>
//       <ul id="messages" ref={this.list}>
//         {props.messages.map(message => {
//           return (
//             <li
//               key={message.id}
//               dangerouslySetInnerHTML={{ __html: message.content }}
//             />
//           );
//         })}
//       </ul>
//     // </ScrollToBottom>
//   );
// }

// const list = document.getElementById('messages');
// console.log(scroll);
// list.scrollTop = list.offsetHeight;

export default MessagesList;
