import React from 'react';
import PropTypes from 'prop-types';

import { MAIN_STATE_ID } from 'appConstants/finder';
import { getStyleApplicationFn } from 'utils/style';
import FinderFolder from 'assets/images/finder/folder.svg';

import mainStyle from '../suggestion.css';

const s = getStyleApplicationFn(mainStyle);

const SuggestionNode = ({ className, id, name, openFinder, pushFinderNode }) => {
  const onClick = () => {
    openFinder();
    pushFinderNode(MAIN_STATE_ID, id);
  };

  return (
    <div className={s(`${className} suggestion-elem`)} onClick={onClick}>
      <div className={s('suggestion-elem-title')}> {name} </div>
      <img src={FinderFolder} alt="Folder" className={s('h-xl w-xl')} />
    </div>
  );
};

SuggestionNode.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,

  // Redux Actions
  openFinder: PropTypes.func.isRequired,
  pushFinderNode: PropTypes.func.isRequired
};

SuggestionNode.defaultProps = {
  className: ''
};

export default SuggestionNode;
