import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', isShow: false, errMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onShowPassword = () => {
    this.setState(prevState => ({isShow: !prevState.isShow}))
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetail = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const option = {
      method: 'POST',
      body: JSON.stringify(userDetail),
    }
    const fetchedLoginData = await fetch(apiUrl, option)
    if (fetchedLoginData.ok) {
      const data = await fetchedLoginData.json()
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      const data = await fetchedLoginData.json()
      const errMsg = data.error_msg
      console.log(data)
      this.setState({errMsg})
    }
  }

  render() {
    const {username, password, isShow, errMsg} = this.state
    const isError = errMsg !== ''
    const typeAsPerShowPassword = isShow ? 'text' : 'password'
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-img"
          alt="website login"
        />
        <div>
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
              className="login-website-logo-desktop-img"
              alt="website logo"
            />
            <div className="login-input-container">
              <label htmlFor="username" className="label-element">
                USERNAME
              </label>
              <input
                onChange={this.onChangeUsername}
                id="username"
                placeholder="Username"
                className="input-element-login-route"
                type="text"
                value={username}
              />
              <label htmlFor="password" className="label-element">
                PASSWORD
              </label>
              <input
                onChange={this.onChangePassword}
                id="password"
                placeholder="Password"
                className="input-element-login-route"
                type={typeAsPerShowPassword}
                value={password}
              />
              <div>
                <input
                  className="checkbox"
                  onClick={this.onShowPassword}
                  id="checkbox"
                  type="checkbox"
                />
                <label className="checkbox-label" htmlFor="checkbox">
                  Show Password
                </label>
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
              {isError && <p className="error-message">*{errMsg}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
