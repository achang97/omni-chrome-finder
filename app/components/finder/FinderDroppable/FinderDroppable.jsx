import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FinderDroppable = ({
  finderId,
  id,
  children,
  isDragging,
  selectedNodes,
  requestMoveFinderNodes,
  updateDraggingFinderNode
}) => {
  const [isOverDroppable, setOverDroppable] = useState(false);

  const onDrop = () => {
    if (isDragging) {
      console.log('here!')
      requestMoveFinderNodes(finderId, selectedNodes, id);
      updateDraggingFinderNode(finderId, null);
    }
  };

  return (
    <div
      onMouseEnter={() => setOverDroppable(true)}
      onMouseLeave={() => setOverDroppable(false)}
      onMouseUp={onDrop}
      onTouchEnd={onDrop}
    >
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
  selectedNodes: PropTypes.arrayOf(PropTypes.object).isRequired,

  // Redux Actions
  requestMoveFinderNodes: PropTypes.func.isRequired,
  updateDraggingFinderNode: PropTypes.func.isRequired
};

export default FinderDroppable;
