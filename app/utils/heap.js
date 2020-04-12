import { addScript } from './window';

export function isHeap() {
  return /^https:\/\/heapanalytics\.com/.test(window.location.href);
}

export function identifyUser(user) {
  if (!isHeap()) {
    const identify = `
      window.heap.identify("${user.email}"); 
      window.heap.addUserProperties({'Name': "${user.firstname}" + " " + "${user.lastname}",'Company': "${user.company.companyName}", 'Role': "${user.role}"});
    `;
    addScript({code: identify });
  }
}

export default { isHeap, identifyUser };