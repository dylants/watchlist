import React, { PropTypes, Component } from 'react';

import style from './login.component.scss';

export default class Login extends Component {
  submit(event) {
    // unfocus the button after it was clicked
    event.currentTarget.blur();

    // prevent the form submission
    event.preventDefault();

    const username = this.refs.username.value;
    const password = this.refs.password.value;

    // clear the password field after submission
    this.refs.password.value = '';

    this.props.login(username, password);
  }

  render() {
    return (
      <div className={style.login}>
        <div className={style.heading}>Login</div>
        <form>
          <input className={style.input} ref="username" placeholder="Username" />
          <input className={style.input} ref="password" type="password" placeholder="Password" />
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
