import React, { PropTypes, Component } from 'react';

import style from './login.component.scss';

export default class Login extends Component {
  state = {
    username: '',
    password: '',
  };

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  submit(event) {
    // unfocus the button after it was clicked
    event.currentTarget.blur();

    // prevent the form submission
    event.preventDefault();

    const username = this.state.username;
    const password = this.state.password;

    // clear the password field after submission
    this.setState({ password: '' });

    this.props.login(username, password);
  }

  render() {
    let errorBlock;
    if (this.props.error) {
      errorBlock = (
        <div>{this.props.error}</div>
      );
    }

    return (
      <div className={style.login}>
        {errorBlock}
        <div className={style.heading}>Login</div>
        <form>
          <input
            className={style.input}
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={::this.handleChange}
          />
          <input
            className={style.input}
            name="password"
            type="password"
            placeholder="Password"
            value={this.state.password}
            onChange={::this.handleChange}
          />
          <button
            className={style.button}
            type="submit"
            onClick={::this.submit}
            disabled={this.props.isWaiting}
          >Login</button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  isWaiting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  login: PropTypes.func.isRequired,
};
