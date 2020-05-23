import React from 'react';
import PropTypes from 'prop-types';
import { MdChevronRight } from 'react-icons/md';

import { FINDER } from 'appConstants';
import { getFullPath } from 'utils/finder';
import { getStyleApplicationFn } from 'utils/style';
import { NodePropTypes } from 'utils/propTypes';
import MoveFolder from 'assets/images/finder/move-folder.svg';

import style from './card-location.css';

const s = getStyleApplicationFn(style);

const HOME_NODE = { _id: FINDER.ROOT.ID, name: FINDER.ROOT.NAME };

const CardLocation = ({
  finderNode,
  onChangeClick,
  isEditable,
  isPathClickable,
  maxPathLength,
  className,
  pathClassName,
  openFinder,
  pushFinderNode
}) => {
  const onNodeClick = (nodeId) => {
    openFinder();
    pushFinderNode(FINDER.MAIN_STATE_ID, nodeId);
  };

  const fullPath = [HOME_NODE, ...getFullPath(finderNode)];
  if (!maxPathLength) {
    // eslint-disable-next-line no-param-reassign
    maxPathLength = fullPath.length;
  }
  const startIndex = Math.max(0, fullPath.length - maxPathLength);

  return (
    <div className={s(`flex items-start ${className}`)}>
      <div className={s(`card-location-path ${pathClassName}`)}>
        {fullPath && (
          <>
            {fullPath.slice(startIndex).map(({ _id, name }, i) => (
              <React.Fragment key={_id}>
                {i !== 0 && <MdChevronRight className={s('flex-shrink-0')} />}
                <span
                  className={s(isPathClickable ? 'cursor-pointer' : '')}
                  onClick={() => isPathClickable && onNodeClick(_id)}
                >
                  {name}
                </span>
              </React.Fragment>
            ))}
          </>
        )}
      </div>
      {isEditable && (
        <div
          className={s('flex items-center cursor-pointer text-xs text-purple-reg')}
          onClick={onChangeClick}
        >
          <span>Change</span>
          <img src={MoveFolder} className={s('h-lg w-lg ml-xs')} alt="Move Location" />
        </div>
      )}
    </div>
  );
};

CardLocation.propTypes = {
  isEditable: PropTypes.bool,
  isPathClickable: PropTypes.bool,
  onChangeClick: PropTypes.func,
  finderNode: NodePropTypes,
  className: PropTypes.string,
  pathClassName: PropTypes.string,
  maxPathLength: PropTypes.number,

  // Redux Actions
  openFinder: PropTypes.func.isRequired,
  pushFinderNode: PropTypes.func.isRequired
};

CardLocation.defaultProps = {
  isEditable: false,
  isPathClickable: false,
  className: '',
  pathClassName: ''
};

export default CardLocation;
