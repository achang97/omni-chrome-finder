/* TODO: Incorporate this into drag & drop behavior for finder. */
import React from 'react';
import PropTypes from 'prop-types';

import { NodePropTypes } from 'utils/propTypes';

const FinderDroppable = ({
  finderId,
  id,
  children,
  isDragging,
  selectedNodes,
  requestMoveFinderNodes,
  updateDraggingFinderNode
}) => {
  const onDrop = () => {
    if (isDragging) {
      requestMoveFinderNodes(finderId, selectedNodes, id);
      updateDraggingFinderNode(finderId, null);
    }
  };

  return (
    <div onMouseUp={onDrop} onTouchEnd={onDrop}>
      {children}
    </div>
  );
};

FinderDroppable.propTypes = {
  finderId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,

  // Redux State
  isDragging: PropTypes.bool.isRequired,
  selectedNodes: PropTypes.arrayOf(NodePropTypes).isRequired,

  // Redux Actions
  requestMoveFinderNodes: PropTypes.func.isRequired,
  updateDraggingFinderNode: PropTypes.func.isRequired
};

export default FinderDroppable;
