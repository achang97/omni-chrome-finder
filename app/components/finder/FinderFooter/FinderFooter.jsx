import React from 'react';
import { Button, Loader } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import { CARD, FINDER } from 'appConstants';

import finderStyle from '../finder.css';

const s = getStyleApplicationFn(finderStyle);

const FinderFooter = ({
  finderId,
  onSecondaryClick,
  onPrimaryClick,
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
  const getDestinationNode = () => {
    if (selectedNodeIds.length === 0 || selectedNodeIds.length > 1) {
      return activeNode;
    }

    const selectedNode = nodes.find(({ _id }) => _id === selectedNodeIds[0]);
    if (selectedNode && !selectedNode.card) {
      return selectedNode;
    }

    return activeNode;
  };

  const isValidMove = () => {
    if (activePath.type === FINDER.PATH_TYPE.SEGMENT) {
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

  const getFullPath = (destination) => {
    // TODO: this will probably be simplified when we get data
    const fullPath = [];
    let currNode = destination;
    while (currNode && currNode._id !== FINDER.ROOT) {
      const { name, _id } = currNode;
      fullPath.unshift({ name, _id });
      currNode = currNode.parent;
    }
    return fullPath;
  };

  const getFooterProps = () => {
    const destination = getDestinationNode();
    const fullPath = getFullPath(destination);

    if (onSecondaryClick || onPrimaryClick) {
      return {
        onSecondaryButtonClick: onSecondaryClick,
        onPrimaryButtonClick: () => onPrimaryClick(fullPath),
        label: (
          <>
            <span> Selected Folder: </span>
            <b> {destination.name} </b>
          </>
        )
      };
    }

    if (moveNodeIds.length !== 0) {
      return {
        isLoading: isMovingNodes,
        onSecondaryButtonClick: () => cancelMoveFinderNodes(finderId),
        onPrimaryButtonClick: () => requestMoveFinderNodes(finderId, destination._id),
        label: (
          <>
            <span> Moving {moveNodeIds.length} item(s) from </span>
            <b> {moveSource.name} </b>
            <span> to </span>
            <b> {destination.name} </b>
          </>
        ),
        disabled: !isValidMove()
      };
    }

    return null;
  };

  const render = () => {
    const footerProps = getFooterProps();

    if (!footerProps) {
      return null;
    }

    const {
      isLoading,
      onSecondaryButtonClick,
      onPrimaryButtonClick,
      label,
      disabled
    } = footerProps;
    return (
      <div
        className={s('px-lg py-sm flex items-center justify-end border-t finder-border')}
        onTouchEnd={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {!disabled && <div className={s('flex-1 text-xs text-gray-dark truncate')}>{label}</div>}
        <Button
          text="Cancel"
          color="secondary"
          className={s('mr-sm')}
          onClick={onSecondaryButtonClick}
        />
        <Button
          text="Choose"
          color="primary"
          onClick={onPrimaryButtonClick}
          icon={isLoading ? <Loader size="xs" className={s('ml-xs')} color="white" /> : null}
          iconLeft={false}
          disabled={disabled}
        />
      </div>
    );
  };

  return render();
};

export default FinderFooter;
