import React from 'react';
import { Button, Loader } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import { PATH_TYPE } from 'appConstants/finder';

import finderStyle from '../finder.css';

const s = getStyleApplicationFn(finderStyle);

const FinderFooter = ({
  activePath,
  activeNode,
  moveNodeIds,
  moveSource,
  isMovingNodes,
  cancelMoveFinderNodes,
  requestMoveFinderNodes
}) => {
  if (moveNodeIds.length === 0) {
    return null;
  }

  const isValidMove = () => {
    if (activePath.type === PATH_TYPE.SEGMENT) {
      return false;
    }

    // TODO: change this when we get real data
    let currNode = activeNode;
    while (currNode) {
      if (moveNodeIds.includes(currNode._id)) {
        return false;
      }
      currNode = currNode.parent;
    }

    return true;
  }

  return (
    <div className={s('px-lg py-sm flex items-center border-t finder-border')}>
      <div className={s('flex-1 text-xs text-gray-dark truncate')}>
        Moving {moveNodeIds.length} item(s) from <b>{moveSource.name}</b> to <b>{activeNode.name}</b>
      </div>
      <Button
        text="Cancel"
        color="secondary"
        className={s('mr-sm')}
        onClick={cancelMoveFinderNodes}
      />
      <Button
        text="Choose"
        color="primary"
        onClick={requestMoveFinderNodes}
        icon={isMovingNodes ? <Loader size="xs" className={s('ml-xs')} color="white" /> : null}
        iconLeft={false}
        disabled={!isValidMove()}
      />
    </div>
  );
};

export default FinderFooter;
