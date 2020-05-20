export function getFullPath(node) {
  if (!node || !node.path) {
    return null;
  }

  const { path } = node;
  return [...path, node].map(({ _id, name }) => ({ _id, name }));
}

export default { getFullPath };
