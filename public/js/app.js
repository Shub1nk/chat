"use strict";

class Chat extends React.Component {
  render() {
    return (
      <div>
        <section className="disconnected">
          <h1>Вы покинули чат!</h1>
        </section>

        <section className="chat">
          <div className="greeting">
            Ваше имя:{" "}
            <input type="text" id="userName" defaultValue="" autoFocus />
            <button id="access" disabled="disabled">
              Sign in
            </button>
          </div>

          <ul id="users-list" />

          <ul id="messages" />
          <form id="form" action="">
            <input id="input" type="text" />
            <button id="send" disabled="disabled">
              Send
            </button>
          </form>

          <div className="b-closeSocket">
            <button id="closeSocket">Покинуть чат</button>
          </div>
        </section>
      </div>
    );
  }
}

ReactDOM.render(<Chat />, document.getElementById("app"));

// class Clock extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       date: new Date()
//     };
//   }

//   componentDidMount() {
//     this.timerId = setInterval(() => this.tick(), 1000);
//   }

//   componentWillUnmoutn() {
//     clearInterval(this.timerID);
//   }

//   tick() {
//     this.setState({
//       date: new Date()
//     });
//   }

//   render() {
//     return (
//       <div>
//         <h1>Hello, world!</h1>
//         <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
//       </div>
//     );
//   }
// }

// ReactDOM.render(<Clock />, document.getElementById("app"));

//-------------------------------------------------
// const e = React.createElement;

// class LikeButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { liked: false };
//   }

//   render() {
//     if (this.state.liked) {
//       return 'You liked this.';
//     }

//     // return e(
//     //   'button',
//     //   { onClick: () => this.setState({ liked: true }) },
//     //   'Like'
//     // );

//     return (
//       <button onClick={() => this.setState({ liked: true })}>
//         Like
//       </button>
//     );
//   }
// };

// const domContainer = document.getElementById('app');
// ReactDOM.render(e(LikeButton), domContainer);
