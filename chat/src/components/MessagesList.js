import React from "react";
// import { css } from "glamor";
// import ScrollToBottom from "react-scroll-to-bottom";

// const ROOT_CSS = css({
//   height: 450,
//   width: 500
// });

// window.scrollTo(0,document.getElementById("messages").scrollHeight);

function MessagesList(props) {
  return (
    // <ScrollToBottom className={ROOT_CSS} mode='bottom'>
      <ul id="messages">
        {props.messages.map(message => {
          return (
            <li
              key={message.id}
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
          );
        })}
      </ul>
    // </ScrollToBottom>
  );
}

// const list = document.getElementById('messages');
// console.log(scroll);
// list.scrollTop = list.offsetHeight;

export default MessagesList;
