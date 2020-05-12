import React from 'react';
import PropTypes from 'prop-types';
import { MdChevronRight, MdSearch } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';

import { BackButton, Dropdown } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import MoveFolder from 'assets/images/finder/move-folder.svg';

import finderStyle from '../finder.css';
import headerStyle from './finder-header.css';

const s = getStyleApplicationFn(finderStyle, headerStyle);

const FinderHeader = ({
  finderHistory,
  searchText,
  goBackFinder,
  pushFinderPath,
  updateFinderSearchText
}) => {
//   useEffect(() => {
//     return () => {
//       updateNavigateTab(NAVIGATE.TAB_OPTION.ALL);
//     };
//   }, [updateNavigateTab]);
// 
//   const searchCards = (clearCards) => {
//     const queryParams = { q: searchText };
//     switch (activeTab) {
//       case NAVIGATE.TAB_OPTION.ALL: {
//         queryParams.tags = getArrayIds(filterTags).join(',');
//         break;
//       }
//       case NAVIGATE.TAB_OPTION.MY_CARDS: {
//         queryParams.statuses = Object.values(CARD.STATUS).join(',');
//         queryParams.owners = user._id;
//         break;
//       }
//       case NAVIGATE.TAB_OPTION.BOOKMARKED: {
//         if (user.bookmarkIds.length === 0) {
//           clearSearchCards(SEARCH.TYPE.NAVIGATE);
//           return;
//         }
//         queryParams.statuses = Object.values(CARD.STATUS).join(',');
//         queryParams.ids = user.bookmarkIds.join(',');
//         break;
//       }
//       default:
//         break;
//     }
// 
//     requestSearchCards(SEARCH.TYPE.NAVIGATE, queryParams, clearCards);
//   };
// 
//   const [debouncedRequestSearch] = useDebouncedCallback(() => {
//     searchCards(true);
//   }, ANIMATE.DEBOUNCE.MS_300);
// 
//   const prevTab = usePrevious(activeTab);
//   const prevTags = usePrevious(filterTags);
// 
//   useEffect(() => {
//     if (prevTab !== activeTab || prevTags !== filterTags) {
//       searchCards(true);
//     } else {
//       debouncedRequestSearch();
//     }
//   }, [activeTab, filterTags, searchText]);
  
  const renderNavigationSection = () => {
    const activePath = finderHistory.length === 0 ? null : finderHistory[finderHistory.length - 1];
    return (
      <div className={s('flex-1 flex items-center min-w-0')}>
        <BackButton
          className={s('finder-header-icon w-auto h-auto')}
          onClick={goBackFinder}
          disabled={finderHistory.length <= 1}
        />
        {activePath && (
          <div className={s('finder-header-icon min-w-0 flex items-center ml-reg text-sm')}>
            {activePath.parent && (
              <>
                <div onClick={() => pushFinderPath(activePath.parent)}>
                  {activePath.parent.name}
                </div>
                <MdChevronRight className={s('mx-xs')} />
              </>
            )}
            <div className={s('truncate')}> {activePath.name} </div>
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
  // To be updated with more specific structure
  finderHistory: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  searchText: PropTypes.string.isRequired,

  // Redux Actions
  goBackFinder: PropTypes.func.isRequired,
  pushFinderPath: PropTypes.func.isRequired,
  updateFinderSearchText: PropTypes.func.isRequired
};

export default FinderHeader;
