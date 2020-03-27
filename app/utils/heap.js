export function addScript({ code, url, shouldRemove=true }) {
  const scriptElm = document.createElement('script');
  if (url) {
    scriptElm.src = url;
  } else if (code) {
    const inlineCode = document.createTextNode(code);
    scriptElm.appendChild(inlineCode); 
  }
  document.body.appendChild(scriptElm); 
  if (shouldRemove) {
    scriptElm.remove();
  }
}

export function isHeap() {
  return /^https:\/\/heapanalytics\.com/.test(window.location.href);
}

export function identifyUser(user) {
  if (!isHeap()) {
    const identify = `
      window.heap.identify("${user.email}"); 
      window.heap.addUserProperties({'Name': "${user.firstname}" + " " + "${user.lastname}",'Company': "${user.company.companyName}", 'Role': "${user.role}"});
    `;
    addScript({code: identify, shouldRemove: true});
  }
}