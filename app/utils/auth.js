export function isLoggedIn(user, integration) {
  // use new userIntegrations here.
  return user &&
    user.integrations &&
    user.integrations[integration] &&
    !!user.integrations[integration].access_token;
}

export { isLoggedIn as default };
