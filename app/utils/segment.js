export function getCardProperties(card) {
  const { _id, question, status } = card;
  return { 'Card ID': _id, Question: question, Status: status };
}

export function getExternalCardProperties(card) {
  const { _id, question, status, externalLinkAnswer } = card;
  const { type } = externalLinkAnswer;
  return { 'Card ID': _id, Question: question, Status: status, Type: type };
}

export default { getCardProperties, getExternalCardProperties };
