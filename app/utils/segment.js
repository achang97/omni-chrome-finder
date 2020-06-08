import { addScript } from './window';

export function identify(user) {
  const script = `
    if (analytics) {
      analytics.identify(
        '${user._id}',
        {
          'Name': "${`${user.firstname} ${user.lastname}`}",
          'Company': "${user.company.companyName}",
          'Email': "${user.email}",
          'Role': "${user.role}"
        }
      );      
    }
  `;
  addScript({ code: script });
}

export function track({ name }) {
  const script = `
    if (analytics) {
      analytics.track('${name}');
    }
	`;
  addScript({ code: script });
}

export default { identify, track };
