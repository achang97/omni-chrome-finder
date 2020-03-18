export function isLoggedIn(user, integration) {
  return user && user.integrations[integration] && !!user.integrations[integration].access_token;
}

export { isLoggedIn as default };
