import { connect } from 'react-redux';
import {
  closeFinderModal,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  requestCreateFinderFolder,
  requestUpdateFinderFolder,
  requestDeleteFinderNodes
} from 'actions/finder';
import FinderConfirmModals from './FinderConfirmModals';

const mapStateToProps = (state, ownProps) => {
  const { finderId } = ownProps;
  const {
    finder: {
      [finderId]: {
        modalOpen,
        edits: { folder: folderEdits },
        getNodeError,
        isCreatingFolder,
        createFolderError,
        isUpdatingFolder,
        updateFolderError,
        isDeletingNodes,
        deleteNodesError,
        moveNodesError
      }
    }
  } = state;

  return {
    modalOpen,
    folderEdits,
    getNodeError,
    isCreatingFolder,
    createFolderError,
    isUpdatingFolder,
    updateFolderError,
    isDeletingNodes,
    deleteNodesError,
    moveNodesError
  };
};

const mapDispatchToProps = {
  closeFinderModal,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  requestCreateFinderFolder,
  requestUpdateFinderFolder,
  requestDeleteFinderNodes
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderConfirmModals);
