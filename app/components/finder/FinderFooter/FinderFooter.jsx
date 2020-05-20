import React from 'react';
import PropTypes from 'prop-types';
import { Button, Loader } from 'components/common';

import { getArrayIds } from 'utils/array';
import { getFullPath } from 'utils/finder';
import { getStyleApplicationFn } from 'utils/style';
import { PATH_TYPE, FINDER_TYPE } from 'appConstants/finder';

import finderStyle from '../finder.css';

const s = getStyleApplicationFn(finderStyle);

const FinderFooter = ({
  finderId,
  onSecondaryClick,
  onPrimaryClick,
  activePath,
  activeNode,
  moveNodes,
  moveSource,
  selectedNodes,
  isMovingNodes,
  cancelMoveFinderNodes,
  requestMoveFinderNodes
}) => {
  const getDestinationNode = () => {
    if (selectedNodes.length === 0 || selectedNodes.length > 1) {
      return activeNode;
    }

    const selectedNode = selectedNodes[0];
    if (selectedNode && selectedNode.finderType === FINDER_TYPE.NODE) {
      return selectedNode;
    }

    return activeNode;
  };

  const isValidMove = () => {
    if (activePath.type === PATH_TYPE.SEGMENT) {
      return false;
    }

    const destinationPath = getFullPath(getDestinationNode());
    const moveNodeIds = getArrayIds(moveNodes);
    return !destinationPath || destinationPath.every(({ _id }) => !moveNodeIds.includes(_id));
  };

  const getFooterProps = () => {
    const destination = getDestinationNode();

    if (onSecondaryClick || onPrimaryClick) {
      return {
        onSecondaryButtonClick: onSecondaryClick,
        onPrimaryButtonClick: () => onPrimaryClick(destination),
        label: (
          <>
            <span> Selected Folder: </span>
            <b> {destination.name} </b>
          </>
        )
      };
    }

    if (moveNodes.length !== 0) {
      return {
        isLoading: isMovingNodes,
        onSecondaryButtonClick: () => cancelMoveFinderNodes(finderId),
        onPrimaryButtonClick: () => requestMoveFinderNodes(finderId, moveNodes, destination._id),
        label: (
          <>
            <span> Moving {moveNodes.length} item(s) from </span>
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

FinderFooter.propTypes = {
  finderId: PropTypes.string.isRequired,
  onSecondaryClick: PropTypes.func,
  onPrimaryClick: PropTypes.func,
  activePath: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(PATH_TYPE)).isRequired,
    state: PropTypes.object
  }).isRequired,
  activeNode: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    path: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  moveNodes: PropTypes.arrayOf(PropTypes.shape({ _id: PropTypes.string.isRequired })).isRequired,
  moveSource: PropTypes.shape({ name: PropTypes.string }),
  selectedNodes: PropTypes.arrayOf(
    PropTypes.shape({
      finderType: PropTypes.oneOf(Object.values(FINDER_TYPE))
    })
  ).isRequired,
  isMovingNodes: PropTypes.bool,

  // Redux Actions
  cancelMoveFinderNodes: PropTypes.func.isRequired,
  requestMoveFinderNodes: PropTypes.func.isRequired
};

export default FinderFooter;
