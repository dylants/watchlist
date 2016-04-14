import { pushPath } from 'redux-simple-router';

export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function isUnauthorized(error) {
  if (error.response && error.response.status === 401) {
    return true;
  } else {
    return false;
  }
}

function sendToLogin(dispatch) {
  dispatch(pushPath('/login'));
}

export function handleHttpError(dispatch, error, errorAction) {
  if (isUnauthorized(error)) {
    sendToLogin(dispatch);
  } else {
    dispatch(errorAction(error));
  }
}
