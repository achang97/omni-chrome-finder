import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdChevronRight, MdChevronLeft, MdSearch } from 'react-icons/md';
import { IoMdCloseCircle } from 'react-icons/io';
import { FiPlus } from 'react-icons/fi';

import { Dropdown, ContextMenu, CircleButton } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';
import { FINDER, ROUTES } from 'appConstants';

import MoveFolder from 'assets/images/finder/move-folder.svg';

import finderStyle from '../finder.css';
import headerStyle from './finder-header.css';

const s = getStyleApplicationFn(finderStyle, headerStyle);

const FinderHeader = ({
  isBackDisabled,
  activePath,
  activeNode,
  selectedNodeIds,
  moveNodeIds,
  isTemplateView,
  goBackFinder,
  pushFinderNode,
  updateFinderSearchText,
  openFinderModal,
  openCard,
  toggleCards,
  toggleTemplateView,
  startMoveFinderNodes,
  history
}) => {
  const [isNewDropdownOpen, setNewDropdownOpen] = useState(false);

  const renderNavigationSection = () => {
    let mainSectionName;
    switch (activePath.type) {
      case FINDER.PATH_TYPE.NODE: {
        mainSectionName = activeNode.name;
        break;
      }
      case FINDER.PATH_TYPE.SEGMENT: {
        mainSectionName = activePath.state.name;
        break;
      }
      default:
        break;
    }

    return (
      <div className={s('flex-1 flex items-center min-w-0')}>
        <CircleButton
          buttonClassName={s('finder-header-icon')}
          content={<MdChevronLeft />}
          onClick={goBackFinder}
          disabled={isBackDisabled}
          size="auto"
        />
        {mainSectionName && (
          <div className={s('finder-header-icon min-w-0 flex items-center ml-reg text-sm')}>
            {activeNode.parent && (
              <>
                <div
                  className={s('truncate cursor-pointer')}
                  onClick={() => pushFinderNode(activeNode.parent._id)}
                >
                  {activeNode.parent.name}
                </div>
                <MdChevronRight className={s('mx-xs')} />
              </>
            )}
            <div className={s('truncate')}> {mainSectionName} </div>
          </div>
        )}
      </div>
    );
  };

  const renderActionSection = () => {
    const onClickWrapper = (onClick) => {
      return () => {
        onClick();
        setNewDropdownOpen(false);
      };
    };

    const onTemplateClick = () => {
      history.push(ROUTES.CREATE);
      toggleCards();
      if (!isTemplateView) {
        toggleTemplateView();
      }
    };

    // TODO: account for current "path" and pass that to template and new blank card
    const NEW_BUTTON_OPTIONS = [
      {
        label: 'New Card',
        options: [
          { label: 'Blank Card', onClick: onClickWrapper(() => openCard({}, true)) },
          { label: 'From Template', onClick: onClickWrapper(onTemplateClick) }
        ]
      },
      {
        label: 'New Folder',
        onClick: onClickWrapper(() => openFinderModal(FINDER.MODAL_TYPE.CREATE_FOLDER))
      }
    ];

    const isSegment = activePath.type === FINDER.PATH_TYPE.SEGMENT;
    const isMoving = moveNodeIds.length !== 0;

    return (
      <div className={s('flex-1 flex items-center ml-sm')}>
        <Dropdown
          isOpen={isNewDropdownOpen}
          onToggle={setNewDropdownOpen}
          disabled={isSegment}
          isLeft={false}
          toggler={
            <CircleButton
              size="auto"
              buttonClassName={s('finder-header-icon mr-sm')}
              content={<FiPlus />}
              disabled={isSegment}
            />
          }
          body={
            <ContextMenu
              options={NEW_BUTTON_OPTIONS}
              outerClassName={s('mt-sm')}
              className={s('finder-header-new-dropdown')}
            />
          }
        />
        <CircleButton
          size="auto"
          buttonClassName={s('finder-header-icon mr-sm')}
          content={<img src={MoveFolder} alt="Move Folder" />}
          disabled={isSegment || selectedNodeIds.length === 0 || isMoving}
          onClick={startMoveFinderNodes}
        />
        <div className={s('finder-header-input-container')}>
          <MdSearch />
          <input
            placeholder="Search"
            className={s('border-0 shadow-none')}
            value={activePath.state.searchText}
            onChange={(e) => updateFinderSearchText(e.target.value)}
          />
          {activePath.state.searchText && (
            <IoMdCloseCircle
              onClick={() => updateFinderSearchText('')}
              className={s('ml-xs cursor-pointer text-purple-gray-50')}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={s('px-lg py-reg rounded-t-lg border-b finder-border flex items-center')}
      onTouchEnd={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {renderNavigationSection()}
      {renderActionSection()}
    </div>
  );
};

FinderHeader.propTypes = {
  // Redux State
  isBackDisabled: PropTypes.bool.isRequired,
  activePath: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(FINDER.PATH_TYPE)).isRequired,
    state: PropTypes.object
  }).isRequired,
  activeNode: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    parent: PropTypes.object.isRequired
  }).isRequired,
  selectedNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  isTemplateView: PropTypes.bool.isRequired,

  // Redux Actions
  goBackFinder: PropTypes.func.isRequired,
  pushFinderNode: PropTypes.func.isRequired,
  updateFinderSearchText: PropTypes.func.isRequired,
  openFinderModal: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired,
  toggleCards: PropTypes.func.isRequired,
  toggleTemplateView: PropTypes.func.isRequired,
  startMoveFinderNodes: PropTypes.func.isRequired
};

export default FinderHeader;
