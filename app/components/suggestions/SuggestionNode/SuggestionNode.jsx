import React from 'react';
import PropTypes from 'prop-types';

import { CardLocation } from 'components/cards';

import { MAIN_STATE_ID } from 'appConstants/finder';
import { getStyleApplicationFn } from 'utils/style';
import FinderFolder from 'assets/images/finder/folder.svg';

import mainStyle from '../suggestion.css';

const s = getStyleApplicationFn(mainStyle);

const SuggestionNode = ({ className, id, name, path, openFinder, pushFinderNode }) => {
  const onClick = () => {
    openFinder();
    pushFinderNode(MAIN_STATE_ID, id);
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
  className: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),

  // Redux Actions
  openFinder: PropTypes.func.isRequired,
  pushFinderNode: PropTypes.func.isRequired
};

SuggestionNode.defaultProps = {
  className: ''
};

export default SuggestionNode;
