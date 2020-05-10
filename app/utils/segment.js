import { addScript } from './window';

export function identify(user) {
  const script = `
    analytics.identify(
      '${user._id}',
      {
        'Name': "${`${user.firstname} ${user.lastname}`}",
        'Company': "${user.company.companyName}",
        'Email': "${user.email}",
        'Role': "${user.role}"
      }
    );
  `;
  addScript({ code: script });
}

export function track({ name }) {
  const script = `
	  analytics.track('${name}');
	`;
  addScript({ code: script });
}

export default { identify, track };
