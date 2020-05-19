import { connect } from 'react-redux';
import _ from 'lodash';
import {
  closeFinderModal,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  requestCreateFinderFolder,
  requestUpdateFinderFolder,
  requestDeleteFinderNodes,
  requestBulkDeleteFinderCards
} from 'actions/finder';
import FinderConfirmModals from './FinderConfirmModals';

const mapStateToProps = (state, ownProps) => {
  const { finderId } = ownProps;
  const {
    finder: {
      [finderId]: {
        history: finderHistory,
        modalOpen,
        edits: { folder: folderEdits },
        isCreatingFolder,
        createFolderError,
        isUpdatingFolder,
        updateFolderError,
        isDeletingNodes,
        deleteNodesError
      }
    }
  } = state;

  const activePath = _.last(finderHistory);
  return {
    activePath,
    modalOpen,
    folderEdits,
    isCreatingFolder,
    createFolderError,
    isUpdatingFolder,
    updateFolderError,
    isDeletingNodes,
    deleteNodesError
  };
};

const mapDispatchToProps = {
  closeFinderModal,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  requestCreateFinderFolder,
  requestUpdateFinderFolder,
  requestDeleteFinderNodes,
  requestBulkDeleteFinderCards
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderConfirmModals);
