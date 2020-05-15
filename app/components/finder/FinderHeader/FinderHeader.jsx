import React from 'react';
import PropTypes from 'prop-types';
import { MdChevronRight, MdSearch } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';

import { BackButton, Dropdown } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';
import { PATH_TYPE } from 'appConstants/finder';

import MoveFolder from 'assets/images/finder/move-folder.svg';

import finderStyle from '../finder.css';
import headerStyle from './finder-header.css';

const s = getStyleApplicationFn(finderStyle, headerStyle);

const FinderHeader = ({
  isBackDisabled,
  activePath,
  activeNode,
  searchText,
  goBackFinder,
  pushFinderNode,
  updateFinderSearchText
}) => {
  const renderNavigationSection = () => {
    let mainSectionName;
    switch (activePath.type) {
      case PATH_TYPE.NODE: {
        mainSectionName = activeNode.name;
        break;
      }
      case PATH_TYPE.SEGMENT: {
        mainSectionName = activePath.state.name;
        break;
      }
      default:
        break;
    }

    return (
      <div className={s('flex-1 flex items-center min-w-0')}>
        <BackButton
          className={s('finder-header-icon w-auto h-auto')}
          onClick={goBackFinder}
          disabled={isBackDisabled}
        />
        {mainSectionName && (
          <div className={s('finder-header-icon min-w-0 flex items-center ml-reg text-sm')}>
            {activeNode.parent && (
              <>
                <div
                  className={s('truncate')}
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

  const renderNewCardDropdown = () => null;

  const renderActionSection = () => {
    return (
      <div className={s('flex-1 flex items-center ml-sm')}>
        <Dropdown
          toggler={
            <div className={s('finder-header-icon mr-sm')}>
              <FiPlus />
            </div>
          }
          body={
            <div>
              {renderNewCardDropdown()}
              <div> New Folder </div>
            </div>
          }
        />
        <div className={s('finder-header-icon mr-sm')}>
          <img src={MoveFolder} alt="Move Folder" />
        </div>
        <div className={s('finder-header-input-container')}>
          <MdSearch />
          <input
            placeholder="Search"
            className={s('border-0 shadow-none')}
            value={searchText}
            onChange={(e) => updateFinderSearchText(e.target.value)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={s('px-lg py-reg rounded-t-lg border-b finder-border flex items-center')}>
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
    type: PropTypes.oneOf(Object.values(PATH_TYPE)).isRequired,
    state: PropTypes.object
  }).isRequired,
  activeNode: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    parent: PropTypes.object.isRequired
  }).isRequired,
  searchText: PropTypes.string.isRequired,

  // Redux Actions
  goBackFinder: PropTypes.func.isRequired,
  pushFinderNode: PropTypes.func.isRequired,
  updateFinderSearchText: PropTypes.func.isRequired
};

export default FinderHeader;
