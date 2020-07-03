import h2p from 'html2plaintext';

export function getModelText(model) {
  const baseStr = h2p(model);
  return baseStr
    .split('\n')
    .filter((section) => !!section)
    .join('\n');
}

export function getVideoEmbeddedCode(link) {
  return `<iframe width="640" height="360" src="${link}" />`;
}

export function convertTextToModel(text) {
  return `<p>${text}</p>`;
}

export default { getModelText, getVideoEmbeddedCode, convertTextToModel };
