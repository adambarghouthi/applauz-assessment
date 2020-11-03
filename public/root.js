'use strict';

const e = React.createElement

class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = { liked: false }
  }

  getUsers() {

  }

  postUsers() {
    fetch('/api/users', {
        method: 'GET',
        headers: {
          Authentication: 'secret',
          'Content-Type': 'application/json'
        },
      })
      .then(function (res) {
        res
          .json()
          .then((json) => console.log(json))
      })
      .catch(function (error) {
        console.log("Error: " + error)
      })
  }

  render() {
    return (
      <div>
        <h2>User Management</h2>
        <p>Functionalities:</p>
        <ul>
          <li>Query users</li>
          <li>Create user(s)</li>
        </ul>
        <button onClick={() => this.postUsers()}>
          Post
        </button>
      </div>
    )
  }
}

const domContainer = document.querySelector('#root')
ReactDOM.render(e(Root), domContainer)
