import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

// const getSelectedMap = memoizeOne((selectedTaskIds) =>
//   selectedTaskIds.reduce((previous, current) => {
//     previous[current] = true;
//     return previous;
//   }, {})
// );

const FinderDroppable = ({ id, children }) => {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          isDraggingOver={snapshot.isDraggingOver}
          {...provided.droppableProps}
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default FinderDroppable;
