
export function addScript({ code, url, shouldRemove=true }) {
  const scriptElm = document.createElement('script');
  console.log(shouldRemove);
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