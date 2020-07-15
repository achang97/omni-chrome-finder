export function addScript({ code, url, shouldRemove = true }) {
  const scriptElm = document.createElement('script');
  if (url) {
    scriptElm.src = url;
  } else if (code) {
    const inlineCode = document.createTextNode(code);
    scriptElm.appendChild(inlineCode);
  }
  document.head.appendChild(scriptElm);
  if (shouldRemove) {
    scriptElm.remove();
  }
}

export function copyText(text) {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);

  // Select, copy and remove
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

export const wasCommandKeyUsed = (event) => {
  const isUsingWindows = navigator.platform.indexOf('Win') >= 0;
  return isUsingWindows ? event.ctrlKey : event.metaKey;
};

export default { addScript, copyText, wasCommandKeyUsed };
