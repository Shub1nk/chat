import React from "react";

function MessagesList(props) {
  return (
    <ul id="messages">
      {props.messages.map(message => {
        return (
          <li
            key={message.id}
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        )

      })}
    </ul>
  );
}

export default MessagesList;
