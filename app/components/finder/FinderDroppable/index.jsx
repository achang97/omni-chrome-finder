import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

// const getSelectedMap = memoizeOne((selectedTaskIds) =>
//   selectedTaskIds.reduce((previous, current) => {
//     previous[current] = true;
//     return previous;
//   }, {})
// );

const FinderDroppable = ({ id, children }) => {
  return (
    <Droppable droppableId={id}>
      {({ innerRef, placeholder, droppableProps }) => {
        return (
          <div ref={innerRef} {...droppableProps}>
            {children}
            <span className={s('invisible')}>{placeholder}</span>
          </div>
        )
      }}
    </Droppable>
  );
};

export default FinderDroppable;
