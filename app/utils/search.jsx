import React from 'react';

import style from 'components/suggestions/styles/suggestion.css';
import { getStyleApplicationFn } from './style';

const s = getStyleApplicationFn(style);

function replaceFrontSlash(text) {
  return text.replace(new RegExp('/', 'g'), '\\/');
}

export function getHighlightRegex(highlightTags) {
  const [startTag, endTag] = highlightTags;
  const pattern = `${replaceFrontSlash(startTag)}(.+?)${replaceFrontSlash(endTag)}`;
  return new RegExp(pattern, 'g');
}

export function replaceHighlights(text, highlightTags) {
  if (!highlightTags) {
    return [text];
  }

  const highlightRegex = getHighlightRegex(highlightTags);
  const matchSections = text.split(highlightRegex);

  let start = 0;
  const sections = [];

  let i;
  for (i = 0; i < matchSections.length; i++) {
    const matchSection = matchSections[i];
    const nextMatchSection = i < matchSections.length - 1 && matchSections[i + 1];

    if (!nextMatchSection || (matchSection !== ' ' && nextMatchSection !== ' ')) {
      const showHighlight = i % 2 === 1;
      const matchElem = (
        <span className={s(showHighlight ? 'suggestion-highlight' : '')}>
          {matchSections.slice(start, i + 1).join('')}
        </span>
      );

      start = i + 1;
      sections.push(matchElem);
    }
  }

  return sections;
}

export function joinSections(sections) {
  return (
    <>
      {sections.map((section, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={`section-${i}`}>{section}</React.Fragment>
      ))}
    </>
  );
}

export function createHighlightedElement(text, highlightTags) {
  return joinSections(replaceHighlights(text, highlightTags));
}

export default { getHighlightRegex, replaceHighlights, joinSections, createHighlightedElement };
