import { push } from 'react-router-redux';

import { FETCH_DEFAULT_OPTIONS } from '../utils/http.utils';
import {
  LOGIN_INITIATED,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from '../constants/action-types';

function loginInitiated() {
  return { type: LOGIN_INITIATED };
}

function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
}

function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error,
  };
}

function validateLogin(username, password) {
  let errorMessage;

  if (!username || !password) {
    errorMessage = 'Please enter a username and password.';
  }

  return errorMessage;
}

export function login(username, password) {
  return dispatch => {
    dispatch(loginInitiated());

    const validationError = validateLogin(username, password);
    if (validationError) {
      return dispatch(loginError(validationError));
    }

    let responseStatus;
    const uri = '/api/session';
    const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });

    return fetch(uri, options)
      .then(response => {
        responseStatus = response.status;
        return response.json();
      })
      .then(json => {
        if (responseStatus > 200 && responseStatus < 300) {
          dispatch(loginSuccess(json));
          return dispatch(push('/'));
        } else if (responseStatus === 401) {
          return dispatch(loginError('Incorrect username or password.'));
        } else {
          return dispatch(loginError(json.error));
        }
      })
      .catch((error) => dispatch(loginError(error)));
  };
}
