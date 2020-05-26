export function signInRequest(user_name, password) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { user_name, password },
  };
}

export function signInSuccess(token, user) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { token, user },
  };
}
export function signUpRequest(name, user_name, password) {
  return {
    type: '@auth/SIGN_UP_REQUEST',
    payload: { name, user_name, password },
  };
}

export function signFailure() {
  return {
    type: '@auth/SIGN_FAILURE',
  };
}

export function signOut() {
  return {
    type: '@auth/SIGN_OUT',
  };
}
