import React from "react";

function Greeting(props) {

  function getUserName(event) {
    let userName = event.target.value;
    props.setUserName(userName);
  }

  return (
    <div className="greeting">
      Ваше имя:{" "}
      <input
        type="text"
        id="userName"
        value={props.userName}
        autoFocus
        onChange={getUserName} // TODO: Переименовать  метод
      />
      <button
        id="access"
        disabled={(props.userName.length === 0) ? "disabled" : ""}
        onClick={props.updateStatus}
        style={{ backgroundColor: props.isWork ? "orange" : "" }}
      >
        {props.isWork ? "Pause" : "Work"}
      </button>
    </div>
  );
}

export default Greeting;
