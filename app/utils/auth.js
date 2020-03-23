export function isLoggedIn(user, integration) {
  return false // user && user.integrations[integration] && !!user.integrations[integration].access_token;
}

export { isLoggedIn as default };
