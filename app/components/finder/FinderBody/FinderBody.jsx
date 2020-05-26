import React from 'react';
import PropTypes from 'prop-types';
import { MdSettings } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { Droppable } from 'react-beautiful-dnd';

import { Tooltip, Loader } from 'components/common';
import { CardStatusIndicator } from 'components/cards';

import { FINDER_TYPE, MODAL_TYPE, PATH_TYPE } from 'appConstants/finder';
import { getArrayIds } from 'utils/array';
import { getStyleApplicationFn } from 'utils/style';
import { NodePropTypes } from 'utils/propTypes';

import FinderFolder from 'assets/images/finder/folder.svg';
import FinderCard from 'assets/images/finder/card.svg';
import MoveFolder from 'assets/images/finder/move-folder.svg';

import style from './finder-body.css';

import FinderDraggable from '../FinderDraggable';

const DRAGGABLE_WIDTH = 110;

const s = getStyleApplicationFn(style);

const INFINITE_SCROLL_OFFSET = 300;

const FinderBody = ({
  finderId,
  isModal,
  nodes,
  activePath,
  isGettingNode,
  isMovingNodes,
  isSearchingSegment,
  segmentPage,
  hasReachedSegmentLimit,
  selectedNodes,
  moveNodes,
  pushFinderNode,
  openFinderModal,
  openCard,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  onBottom
}) => {
  const isCardNode = (finderType) => {
    return finderType === FINDER_TYPE.CARD;
  };

  const getNodeLabel = ({ finderType, name, question }) => {
    return isCardNode(finderType) ? question : name;
  };

  const isMovingNode = (nodeId) => {
    return getArrayIds(moveNodes).includes(nodeId);
  };

  const openNode = ({ finderType, _id }) => {
    if (isCardNode(finderType)) {
      openCard({ _id });
    } else if (!isMovingNode(_id)) {
      pushFinderNode(finderId, _id);
    }
  };

  const renderChildNode = (childNode, i) => {
    const { finderType, _id, status } = childNode;
    const isCard = isCardNode(finderType);
    const label = getNodeLabel(childNode);
    const isMoving = isMovingNode(_id);

    return (
      <FinderDraggable
        key={_id}
        finderId={finderId}
        node={childNode}
        index={i}
        isDragDisabled
        isMultiSelectDisabled={isModal || moveNodes.length !== 0}
        width={DRAGGABLE_WIDTH}
        className={s('m-sm')}
        nodes={nodes}
      >
        <div className={s(`finder-body-node`)} onDoubleClick={() => openNode(childNode)}>
          <div className={s('relative')}>
            <img
              src={isCard ? FinderCard : FinderFolder}
              alt={label}
              className={s('finder-body-node-icon')}
            />
            {isMoving && (
              <div className={s('finder-body-node-move-indicator')}>
                <img src={MoveFolder} alt="Move Node" className={s('h-full w-full')} />
              </div>
            )}
            {isCard && (
              <CardStatusIndicator
                status={status}
                className={s('finder-body-node-status-indicator')}
              />
            )}
          </div>
          <Tooltip tooltip={label}>
            <div className={s('line-clamp-3 mt-sm w-full text-xs text-center')}>{label}</div>
          </Tooltip>
        </div>
      </FinderDraggable>
    );
  };

  const renderActionIcons = () => {
    if (moveNodes.length !== 0 || isModal) {
      return null;
    }

    const ICONS = [
      {
        label: 'Edit',
        Icon: MdSettings,
        show: selectedNodes.length === 1 && !isCardNode(selectedNodes[0].finderType),
        onClick: () => {
          const { name, permissions, permissionGroups } = selectedNodes[0];
          updateFinderFolderName(finderId, name);
          openFinderModal(finderId, MODAL_TYPE.EDIT_FOLDER);
          updateFinderFolderPermissions(finderId, permissions);
          updateFinderFolderPermissionGroups(finderId, permissionGroups);
        }
      },
      {
        label: 'Delete',
        Icon: FaRegTrashAlt,
        show: selectedNodes.length !== 0,
        onClick: () => openFinderModal(finderId, MODAL_TYPE.CONFIRM_DELETE)
      }
    ];

    return (
      <div
        className={s('absolute bottom-0 right-0 flex items-end p-reg')}
        onTouchEnd={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {ICONS.filter(({ show }) => show).map(({ label, Icon, onClick }, i) => (
          <div
            key={label}
            onClick={onClick}
            className={s(
              `text-purple-reg flex flex-col items-center cursor-pointer ${
                i !== ICONS.length - 1 ? 'mr-lg' : ''
              }`
            )}
          >
            <Icon className={s('text-xl mb-xs')} />
            <div className={s('text-xs')}> {label} </div>
          </div>
        ))}
      </div>
    );
  };

  const isSegment = () => {
    return activePath.type === PATH_TYPE.SEGMENT;
  };

  const render = () => {
    if (isGettingNode || isMovingNodes || (isSearchingSegment && segmentPage === 0)) {
      return <Loader className={s('w-full')} />;
    }

    if (nodes.length === 0) {
      return (
        <div className={s('flex items-center justify-center w-full h-full text-gray-dark')}>
          Nothing to display
        </div>
      );
    }

    return (
      <div className={s('relative w-full flex flex-col')}>
        {activePath.state.searchText && (
          <div className={s('italic bg-gray-xlight px-lg py-xs text-xs')}>
            Results for &quot;{activePath.state.searchText}&quot;
          </div>
        )}
        <BottomScrollListener onBottom={onBottom} bottomOffset={INFINITE_SCROLL_OFFSET}>
          {(scrollRef) => (
            <div ref={scrollRef} className={s('flex-1 overflow-auto flex flex-col')}>
              <Droppable droppableId={activePath._id}>
                {({ innerRef, placeholder, droppableProps }) => (
                  <div
                    ref={innerRef}
                    className={s('flex flex-wrap items-start content-start')}
                    {...droppableProps}
                  >
                    {nodes.map(renderChildNode)}
                    <span className={s('hidden')}>{placeholder}</span>
                  </div>
                )}
              </Droppable>
              {!isSearchingSegment && !hasReachedSegmentLimit && isSegment() && (
                <div
                  onClick={onBottom}
                  className={s(
                    'text-purple-reg mx-auto text-sm underline-border cursor-pointer my-sm'
                  )}
                >
                  Show More
                </div>
              )}
              {isSearchingSegment && <Loader className={s('my-reg')} size="sm" />}
            </div>
          )}
        </BottomScrollListener>
        {renderActionIcons()}
      </div>
    );
  };

  return render();
};

FinderBody.propTypes = {
  isModal: PropTypes.bool.isRequired,
  nodes: PropTypes.arrayOf(NodePropTypes).isRequired,

  // Redux State
  activePath: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(PATH_TYPE)).isRequired,
    state: PropTypes.object
  }).isRequired,
  isGettingNode: PropTypes.bool,
  isMovingNodes: PropTypes.bool,
  isSearchingSegment: PropTypes.bool,
  segmentPage: PropTypes.number.isRequired,
  hasReachedSegmentLimit: PropTypes.bool.isRequired,
  selectedNodes: PropTypes.arrayOf(NodePropTypes).isRequired,

  // Redux Actions
  pushFinderNode: PropTypes.func.isRequired,
  openFinderModal: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired,
  updateFinderFolderName: PropTypes.func.isRequired,
  updateFinderFolderPermissions: PropTypes.func.isRequired,
  updateFinderFolderPermissionGroups: PropTypes.func.isRequired
};

export default FinderBody;
