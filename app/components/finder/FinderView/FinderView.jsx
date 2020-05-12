import React, { useEffect, useState } from 'react';

import { getStyleApplicationFn } from 'utils/style';

import FinderHeader from '../FinderHeader';
import FinderSideNav from '../FinderSideNav';
import FinderBody from '../FinderBody';
import FinderFooter from '../FinderFooter';

const s = getStyleApplicationFn();

const getTasks = (entities, columnId) => {
  entities.columns[columnId].taskIds.map((taskId) => entities.tasks[taskId]);
};

const FinderView = ({}) => {
  const [entities, setEntities] = useState([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [draggingTaskId, setDraggingTaskId] = useState(null);

  const unselectAll = () => {
    setSelectedTaskIds([]);
  };

  useEffect(() => {
    const onWindowKeyDown = (event) => {
      if (!event.defaultPrevented && event.key === 'Escape') {
        unselectAll();
      }
    };

    const onWindowClick = (event) => {
      if (!event.defaultPrevented) {
        unselectAll();
      }
    };

    const onWindowTouchEnd = (event) => {
      if (!event.defaultPrevented) {
        unselectAll();
      }
    };

    window.addEventListener('click', onWindowClick);
    window.addEventListener('keydown', onWindowKeyDown);
    window.addEventListener('touchend', onWindowTouchEnd);

    return () => {
      window.removeEventListener('click', onWindowClick);
      window.removeEventListener('keydown', onWindowKeyDown);
      window.removeEventListener('touchend', onWindowTouchEnd);
    };
  });

  const onDragStart = (start) => {
    const id = start.draggableId;
    const selected = selectedTaskIds.find((taskId) => taskId === id);

    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      unselectAll();
    }

    setDraggingTaskId(start.draggableId);
  };

  const onDragEnd = ({ destination, source, reason }) => {
    // nothing to do
    if (!destination || reason === 'CANCEL') {
      setDraggingTaskId(null);
      return;
    }

    // const processed = mutliDragAwareReorder({
    //   entities,
    //   selectedTaskIds,
    //   source,
    //   destination
    // });

    // Order shouldn't really matter for this use case
    // Files + Folders will be sorted in a certain way, not controlled by user
    setDraggingTaskId(null);
  };

  const toggleSelection = (taskId) => {
    const wasSelected = selectedTaskIds.includes(taskId);

    const newTaskIds = (() => {
      // Task was not previously selected
      // now will be the only selected item
      if (!wasSelected) {
        return [taskId];
      }

      // Task was part of a selected group
      // will now become the only selected item
      if (selectedTaskIds.length > 1) {
        return [taskId];
      }

      // task was previously selected but not in a group
      // we will now clear the selection
      return [];
    })();

    setSelectedTaskIds(newTaskIds);
  };

  const toggleSelectionInGroup = (taskId) => {
    const index = selectedTaskIds.indexOf(taskId);

    // if not selected - add it to the selected items
    if (index === -1) {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
      return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow = [...selectedTaskIds];
    shallow.splice(index, 1);
    setSelectedTaskIds(shallow);
  };

  // This behaviour matches the MacOSX finder selection
  const multiSelectTo = (newTaskId) => {
    //     const updated = multiSelect(
    //       entities,
    //       selectedTaskIds,
    //       newTaskId,
    //     );
    //
    //     if (updated == null) {
    //       return;
    //     }
    //
    //     setSelectedTaskIds(updated);
  };

  return (
    <>
      <FinderHeader />
      <div className={s('min-h-0 flex-1 flex')}>
        <FinderSideNav />
        <FinderBody />
      </div>
      <FinderFooter />
    </>
  );
};

export default FinderView;
