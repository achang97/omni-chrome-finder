import React from 'react';
import PropTypes from 'prop-types';

import { CardLocation } from 'components/cards';

import { FINDER, SEGMENT, AUDIT } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';
import FinderFolder from 'assets/images/finder/folder.svg';

import mainStyle from '../styles/suggestion.css';

const s = getStyleApplicationFn(mainStyle);

const SuggestionNode = ({
  className,
  id,
  name,
  path,
  event,
  searchLogId,
  source,
  openFinder,
  pushFinderNode,
  trackEvent
}) => {
  const onClick = () => {
    openFinder();
    pushFinderNode(FINDER.MAIN_STATE_ID, id, { baseLogId: searchLogId, source });

    if (event) {
      const fullPath = [FINDER.ROOT.NAME, ...path.map(({ name: folderName }) => folderName), name];
      trackEvent(event, { Folder: fullPath.join(' > ') });
    }
  };

  return (
    <div
      className={s(`${className} flex justify-between items-center suggestion-elem`)}
      onClick={onClick}
    >
      <div className={s('min-w-0')}>
        <CardLocation
          path={path}
          pathClassName={s('suggestion-elem-path')}
          maxPathLength={3}
          wrap={false}
        />
        <div className={s('suggestion-elem-title')}> {name} </div>
      </div>
      <img src={FinderFolder} alt="Folder" className={s('h-xl w-xl ml-xs')} />
    </div>
  );
};

SuggestionNode.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  event: PropTypes.oneOf(Object.values(SEGMENT.EVENT)),
  className: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  source: PropTypes.oneOf(Object.values(AUDIT.SOURCE)),
  searchLogId: PropTypes.string,

  // Redux Actions
  openFinder: PropTypes.func.isRequired,
  pushFinderNode: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

SuggestionNode.defaultProps = {
  className: ''
};

export default SuggestionNode;
