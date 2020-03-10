export function isLoggedIn(user, integration) {
  return user && !!user.integrations[integration].access_token;
}