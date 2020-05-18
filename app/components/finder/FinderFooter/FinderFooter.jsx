import React from 'react';
import { Button, Loader } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import { PATH_TYPE } from 'appConstants/finder';

import finderStyle from '../finder.css';

const s = getStyleApplicationFn(finderStyle);

const FinderFooter = ({
  nodes,
  activePath,
  activeNode,
  moveNodeIds,
  moveSource,
  selectedNodeIds,
  isMovingNodes,
  cancelMoveFinderNodes,
  requestMoveFinderNodes
}) => {
  if (moveNodeIds.length === 0) {
    return null;
  }

  const getDestinationNode = () => {
    if (selectedNodeIds.length === 0 || selectedNodeIds.length > 1) {
      return activeNode;
    }

    return nodes.find(({ _id }) => _id === selectedNodeIds[0]);
  };

  const isValidMove = () => {
    if (activePath.type === PATH_TYPE.SEGMENT) {
      return false;
    }

    const destination = getDestinationNode();

    // TODO: change this when we get real data
    let currNode = destination;
    while (currNode) {
      if (moveNodeIds.includes(currNode._id)) {
        return false;
      }
      currNode = currNode.parent;
    }

    return true;
  };

  const render = () => {
    const destination = getDestinationNode();
    const isDisabled = !isValidMove();

    return (
      <div
        className={s('px-lg py-sm flex items-center justify-end border-t finder-border')}
        onTouchEnd={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {!isDisabled && (
          <div className={s('flex-1 text-xs text-gray-dark truncate')}>
            Moving {moveNodeIds.length} item(s) from <b>{moveSource.name}</b> to <b>{destination.name}</b>
          </div>
        )}
        <Button
          text="Cancel"
          color="secondary"
          className={s('mr-sm')}
          onClick={cancelMoveFinderNodes}
        />
        <Button
          text="Choose"
          color="primary"
          onClick={() => requestMoveFinderNodes(destination._id)}
          icon={isMovingNodes ? <Loader size="xs" className={s('ml-xs')} color="white" /> : null}
          iconLeft={false}
          disabled={isDisabled}
        />
      </div>
    );
  };

  return render();
};

export default FinderFooter;
