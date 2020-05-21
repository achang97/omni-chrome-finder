import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components/common';
import { MAIN_STATE_ID } from 'appConstants/finder';
import { getFullPath } from 'utils/finder';
import { getArrayIds } from 'utils/array';
import { getStyleApplicationFn } from 'utils/style';

import FinderView from '../FinderView';

const s = getStyleApplicationFn();

const MODAL_ID = `${MAIN_STATE_ID}-MODAL`;

const FinderContainer = ({
  moveNodes,
  moveSource,
  isMovingNodes,
  cancelMoveFinderNodes,
  requestMoveFinderNodes,
  closeFinder
}) => {
  useEffect(() => {
    if (moveNodes.length === 0) {
      closeFinder(MODAL_ID);
    }
  }, [moveNodes, closeFinder]);

  const isValidMove = (destinationNode) => {
    const destinationPath = getFullPath(destinationNode);
    const moveNodeIds = getArrayIds(moveNodes);
    return !destinationPath || destinationPath.every(({ _id }) => !moveNodeIds.includes(_id));
  };

  return (
    <div className={s('flex-1 flex flex-col relative')}>
      <FinderView finderId={MAIN_STATE_ID} />
      <Modal
        isOpen={moveNodes.length !== 0}
        showHeader={false}
        overlayClassName={s('rounded-b-lg')}
        className={s('h-full')}
        bodyClassName={s('rounded-b-lg flex flex-col h-full')}
        showPrimaryButton={false}
      >
        <FinderView
          finderId={MODAL_ID}
          isModal
          startNodeId={moveSource && moveSource._id}
          onSecondaryClick={() => cancelMoveFinderNodes(MAIN_STATE_ID)}
          onPrimaryClick={(finderNode) =>
            requestMoveFinderNodes(MAIN_STATE_ID, moveNodes, finderNode._id)
          }
          isPrimaryDisabled={(finderNode) => !isValidMove(finderNode)}
          isLoading={isMovingNodes}
        />
      </Modal>
    </div>
  );
};

FinderContainer.propTypes = {
  moveNodes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired
    })
  ).isRequired,
  moveSource: PropTypes.shape({ _id: PropTypes.string }),
  isMovingNodes: PropTypes.bool,

  // Redux Actions
  cancelMoveFinderNodes: PropTypes.func.isRequired,
  requestMoveFinderNodes: PropTypes.func.isRequired,
  closeFinder: PropTypes.func.isRequired
};

export default FinderContainer;
