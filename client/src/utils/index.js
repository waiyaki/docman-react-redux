export function getAuthToken() {
  return window && window.localStorage
    ? window.localStorage.getItem('token')
    : null;
}

export function setAuthToken(token) {
  window.localStorage.setItem('token', token);
}

export function removeAuthToken() {
  window.localStorage.removeItem('token');
}

export function parseUserFromToken() {
  return JSON.parse(window.atob(getAuthToken().split('.')[1]));
}
