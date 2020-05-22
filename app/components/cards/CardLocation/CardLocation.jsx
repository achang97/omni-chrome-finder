import React from 'react';
import PropTypes from 'prop-types';
import { MdChevronRight } from 'react-icons/md';

import { FINDER, CARD } from 'appConstants';
import { getFullPath } from 'utils/finder';
import { getStyleApplicationFn } from 'utils/style';
import { NodePropTypes } from 'utils/propTypes';
import MoveFolder from 'assets/images/finder/move-folder.svg';

import style from './card-location.css';

const s = getStyleApplicationFn(style);

const HOME_NODE = { _id: FINDER.ROOT.ID, name: FINDER.ROOT.NAME };

const CardLocation = ({
  finderNode,
  isEditable,
  maxPathLength,
  className,
  pathClassName,
  openCardModal,
  closeCardModal,
  openFinder,
  pushFinderNode
}) => {
  const onChangeClick = () => {
    closeCardModal(CARD.MODAL_TYPE.CREATE);
    openCardModal(CARD.MODAL_TYPE.FINDER);
  };

  const onNodeClick = (nodeId) => {
    openFinder();
    pushFinderNode(FINDER.MAIN_STATE_ID, nodeId);
  };

  const fullPath = [HOME_NODE, ...getFullPath(finderNode)];
  if (!maxPathLength) {
    // eslint-disable-next-line no-param-reassign
    maxPathLength = fullPath.length;
  }

  return (
    <div className={s(`flex items-start ${className}`)}>
      <div className={s(`card-location-path ${pathClassName}`)}>
        {fullPath && (
          <>
            {fullPath.slice(fullPath.length - maxPathLength).map(({ _id, name }, i) => (
              <React.Fragment key={_id}>
                {i !== 0 && <MdChevronRight className={s('flex-shrink-0')} />}
                <span className={s('cursor-pointer')} onClick={() => onNodeClick(_id)}>
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
  finderNode: NodePropTypes,
  className: PropTypes.string,
  pathClassName: PropTypes.string,
  maxPathLength: PropTypes.number,

  // Redux Actions
  openCardModal: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired,
  openFinder: PropTypes.func.isRequired,
  pushFinderNode: PropTypes.func.isRequired
};

CardLocation.defaultProps = {
  isEditable: false,
  className: '',
  pathClassName: ''
};

export default CardLocation;
