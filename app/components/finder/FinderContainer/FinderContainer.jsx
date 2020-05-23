import React from 'react';
import PropTypes from 'prop-types';

import { MAIN_STATE_ID } from 'appConstants/finder';
import { getFullPath } from 'utils/finder';
import { getArrayIds } from 'utils/array';
import { getStyleApplicationFn } from 'utils/style';
import { NodePropTypes } from 'utils/propTypes';

import FinderView from '../FinderView';
import FinderModal from '../FinderModal';

const s = getStyleApplicationFn();

const MODAL_ID = `${MAIN_STATE_ID}-MODAL`;

const FinderContainer = ({
  moveNodes,
  moveSource,
  isMovingNodes,
  cancelMoveFinderNodes,
  requestMoveFinderNodes
}) => {
  const isValidMove = (destinationNode) => {
    const destinationPath = getFullPath(destinationNode);
    const moveNodeIds = getArrayIds(moveNodes);
    return destinationPath.every(({ _id }) => !moveNodeIds.includes(_id));
  };

  return (
    <div className={s('flex-1 flex flex-col relative')}>
      <FinderView finderId={MAIN_STATE_ID} />
      <FinderModal
        isOpen={moveNodes.length !== 0}
        finderId={MODAL_ID}
        startNodeId={moveSource && moveSource._id}
        onSecondaryClick={() => cancelMoveFinderNodes(MAIN_STATE_ID)}
        onPrimaryClick={(finderNode) =>
          requestMoveFinderNodes(MAIN_STATE_ID, moveNodes, finderNode._id)
        }
        isPrimaryDisabled={(finderNode) => !isValidMove(finderNode)}
        isLoading={isMovingNodes}
      />
    </div>
  );
};

FinderContainer.propTypes = {
  moveNodes: PropTypes.arrayOf(NodePropTypes).isRequired,
  moveSource: NodePropTypes,
  isMovingNodes: PropTypes.bool,

  // Redux Actions
  cancelMoveFinderNodes: PropTypes.func.isRequired,
  requestMoveFinderNodes: PropTypes.func.isRequired
};

export default FinderContainer;
