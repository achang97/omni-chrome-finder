import { connect } from 'react-redux';
import {
  closeFinderModal,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  requestCreateFinderFolder,
  requestDeleteFinderNodes
} from 'actions/finder';
import FinderConfirmModals from './FinderConfirmModals';

const mapStateToProps = (state) => {
  const {
    finder: {
      modalOpen,
      edits: {
        folder: folderEdits
      },
      isCreatingFolder,
      createFolderError
    }
  } = state;

  return {
    modalOpen,
    folderEdits,
    isCreatingFolder,
    createFolderError
  };
};

const mapDispatchToProps = {
  closeFinderModal,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  requestCreateFinderFolder,
  requestDeleteFinderNodes
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderConfirmModals);
