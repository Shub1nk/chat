import React from "react";

function UsersStatusList(props) {

  console.log(props)

  return (
    <ul
      id="users-list"
      style={{
        left: (props.usersList.length > 0) ? "-235px" : "0px"
      }}
    >
      <p>
        Пользователей в чате: <b>{props.usersList.length}</b>
      </p>
      {props.usersList.map(user => {

        console.log(user);

        return (
          <li
            dangerouslySetInnerHTML={{ __html: user.html }}
            className={user.isWork ? "pause" : ""}
          />
        );
      })}
    </ul>
  );
}

export default UsersStatusList;
