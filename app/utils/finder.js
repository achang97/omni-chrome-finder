export function getFullPath(node) {
  if (!node || !node.path) {
    return [];
  }

  const { path } = node;
  return [...path, node].map(({ _id, name }) => ({ _id, name }));
}

export default { getFullPath };
