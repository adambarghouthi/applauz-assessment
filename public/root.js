'use strict';

const e = React.createElement

class Root extends React.Component {
  constructor() {
    super()
    this.state = {
      form: 'query',
      name: '',
      email: '',
      users: [],
      loading: false,
      success: null,
      error: null
    }

    this.getUsers = this.getUsers.bind(this)
    this.postUsers = this.postUsers.bind(this)
    this.cleanAlerts = this.cleanAlerts.bind(this)
    this.addUser = this.addUser.bind(this)
    this.removeUser = this.removeUser.bind(this)

    this.handleChange = this.handleChange.bind(this)
    this.handleResult = this.handleResult.bind(this)
  }

  handleChange(e) {
    e.preventDefault()

    this.setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  handleResult(json) {
    if (json.status === 'error') {
      this.setState(prevState => ({
        ...prevState,
        error: json.message
      }))
    } else {
      this.setState(prevState => ({
        ...prevState,
        success: json.body
      }))
    }
  }

  cleanAlerts() {
    if (this.state.success || this.state.error) {
      this.setState(prevState => ({
        ...prevState,
        success: null,
        error: null
      }))
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }

  serialize(obj) {
    let str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  }

  addUser(user) {
    if (!this.validateEmail(user.email) ||
      !user.name) {
      this.handleResult({
        status: 'error',
        message: 'Invalid user, please add a valid name and email.'
      })
      return
    }

    this.setState(prevState => ({
      ...prevState,
      name: '',
      email: '',
      users: [ ...prevState.users, user ]
    }))

    this.cleanAlerts()
  }

  removeUser(index) {
    this.setState(prevState => ({
      ...prevState,
      users: prevState.users.filter((u, i) => i !== index)
    }))
  }

  postUsers() {
    this.cleanAlerts()

    const { users } = this.state
    if (!users.length) {
      this.handleResult({
        status: 'error',
        message: 'Add users before pressing create.'
      })
      return
    }

    fetch('/api/users', {
        method: 'POST',
        headers: {
          Authentication: 'secret',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users: this.state.users })
      })
      .then((res) => {
        res
          .json()
          .then((json) => this.handleResult(json))
      })
      .catch((error) => this.handleResult({
        status: 'error',
        message: error.message
      }))
  }

  getUsers() {
    this.cleanAlerts()

    const { name, email } = this.state
    const query = {}
    let url = '/api/users?'

    if (name.trim()) query.name = name.trim()
    if (email.trim()) query.email = email.trim()

    // urlify the query obj
    url += this.serialize(query)

    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authentication: 'secret'
        }
      })
      .then((res) => {
        res
          .json()
          .then((json) => this.handleResult(json))
      })
      .catch((error) => this.handleResult({
        status: 'error',
        message: error.message
      }))
  }

  render() {
    const { form, success, error, loading } = this.state

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>Applauz Assessment</h2>
            <p>Functionalities:</p>
            <ul>
              <li>Query users</li>
              <li>Create user(s)</li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="btn-group btn-group-toggle mb-4" data-toggle="buttons">
          <label className={`btn btn-secondary ${form === 'query' ? 'active' : ''}`}>
            <input type="radio" name="form" value="query" onChange={this.handleChange} /> User querying
          </label>
          <label className={`btn btn-secondary ${form === 'create' ? 'active' : ''}`}>
            <input type="radio" name="form" value="create" onChange={this.handleChange} /> User creation
          </label>
        </div>
        {
          form === 'query'
            ? <div className="row">
                <div className="col-md-12">
                  <h3>User Querying</h3>
                  <p>
                    Find users by name or email. If both name and email 
                    fields are empty, system fetches all users, otherwise
                    it queries against the set terms.
                  </p>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange} />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange} />
                </div>
                <div className="col-md-12">
                  <button className="btn btn-primary mt-4" onClick={() => this.getUsers()}>
                    Search
                  </button>
                </div>
              </div>
            : null
        }
        {
          form === 'create'
            ? <div className="row">
                <div className="col-md-12">
                  <h3>User Creation</h3>
                  <p>
                    Press the Add button to add a user to the list you want to save. When you're done, press Create.
                  </p>
                </div>
                <div className="col-md-12">
                  <div className="row">
                    {
                      this.state.users.map((user, i) =>
                        <div key={i} className="col-md-12 mb-3">
                          { user.name },&nbsp;
                          { user.email }&nbsp;|&nbsp;
                          <a
                            role="button"
                            tabIndex="0"
                            style={{ color: 'red' }}
                            onClick={() => this.removeUser(i)}>
                            Remove
                          </a>
                        </div>
                      )
                    }
                  </div>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange} />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange} />
                </div>
                <div className="col-md-4">
                  <button className="btn btn-secondary" onClick={() => this.addUser({
                    name: this.state.name.trim(),
                    email: this.state.email.trim()
                  })}>
                    + Add
                  </button>
                </div>
                <div className="col-md-12">
                  <button className="btn btn-primary mt-4" onClick={() => this.postUsers()}>
                    Create
                  </button>
                </div>
              </div>
            : null
        }
        {
          error
            ? <div className="alert alert-danger mt-3" role="alert">
                { error }
              </div>
            : null
        }
        {
          success
            ? <div className="alert alert-success mt-3" role="alert">
                Success!
                <br />
                {
                  success.map(user =>
                    <div key={user.id}>
                      <span>{ user.id }</span>,&nbsp;
                      <span>{ user.name }</span>,&nbsp;
                      <span>{ user.email }</span>
                    </div>
                  )
                }
                <br />
                { success.length } results
              </div>
            : null
        }
      </div>
    )
  }
}

const domContainer = document.querySelector('#root')
ReactDOM.render(e(Root), domContainer)
