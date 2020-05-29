function getElementsByXpath(path) {
  const nodesSnapshot = document.evaluate(
    path,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  const nodes = [];
  let i;
  for (i = 0; i < nodesSnapshot.snapshotLength; i++) {
    nodes.push(nodesSnapshot.snapshotItem(i));
  }

  return nodes;
}

function trimAlphanumeric(text) {
  return text.replace(/^[^a-z\d]+|[^a-z\d]+$/gi, '');
}

function removeAll(nodes, transform) {
  nodes.forEach((node) => {
    if (transform) {
      // eslint-disable-next-line no-param-reassign
      node = transform(node);
    }

    if (node) {
      node.remove();
    }
  });
}

// eslint-disable-next-line import/prefer-default-export
export function getGoogleText(observer, createMutator) {
  let text = '';

  if (document) {
    const mainTable = document.querySelector('div[role="main"] table[role="presentation"]');

    const titleDiv = mainTable.querySelector('[tabindex="-1"]');
    if (titleDiv) {
      text += `${titleDiv.innerText}\n\n`;
    }

    const emailList = mainTable.querySelector('[role="list"]');
    if (emailList) {
      if (!observer) {
        createMutator(emailList, { subtree: true, childList: true });
      }

      for (let i = 0; i < emailList.children.length; i++) {
        const email = emailList.children[i];
        if (email.getAttribute('role') === 'listitem') {
          const emailCopy = email.cloneNode(true);

          const removeFwds = emailCopy.querySelectorAll('.gmail_quote');
          removeAll(removeFwds);

          const removeShowContentToggle = [
            ...emailCopy.querySelectorAll('[aria-label="Show trimmed content"]'),
            ...emailCopy.querySelectorAll('[aria-label="Hide expanded content"]')
          ];
          removeAll(removeShowContentToggle, (toggle) => toggle.parentElement.nextSibling);

          const removeTables = emailCopy.querySelectorAll('table');
          removeAll(removeTables);

          const removeAttachments = getElementsByXpath('//div[text()="Attachments area"]');
          removeAll(removeAttachments, (attachment) => attachment.parentElement);

          const removeAttachmentButton = emailCopy.querySelectorAll(
            '[aria-label="Download all attachments"]'
          );
          removeAll(
            removeAttachmentButton,
            (attachmentButton) => attachmentButton.parentElement.parentElement.parentElement
          );

          const removeSignatures = emailCopy.querySelectorAll('[data-smartmail="gmail_signature"]');
          removeAll(removeSignatures);

          const textContent = trimAlphanumeric(emailCopy.textContent);
          text += `${textContent}\n\n`;
        }
      }
    }
  }

  return text;
}
