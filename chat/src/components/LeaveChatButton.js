import React from "react";

function LeaveChatButton(props) {

  return (
    <div className="b-closeSocket">
      <button id="closeSocket" onClick={props.leaveChat}>
        Покинуть чат
      </button>
    </div>
  );
}

export default LeaveChatButton;