import React from 'react';
import PropTypes from 'prop-types';

import { ConfirmModal } from 'components/common';
import { CardPermissions } from 'components/cards';
import { MODAL_TYPE, PATH_TYPE } from 'appConstants/finder';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const FinderConfirmModals = ({
  activePath,
  modalOpen,
  folderEdits,
  isCreatingFolder,
  createFolderError,
  isUpdatingFolder,
  updateFolderError,
  isDeletingNodes,
  deleteNodesError,
  closeFinderModal,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  requestCreateFinderFolder,
  requestUpdateFinderFolder,
  requestDeleteFinderNodes,
  requestBulkDeleteFinderCards
}) => {
  const renderCreateFolderBody = () => (
    <div>
      <input
        placeholder="Folder Name"
        value={folderEdits.name}
        onChange={(e) => updateFinderFolderName(e.target.value)}
        className={s('mb-reg w-full')}
      />
      <div className={s('text-gray-reg text-xs mb-sm')}> Permissions </div>
      <CardPermissions
        showJustMe
        isEditable
        selectedPermissions={folderEdits.permissions}
        onChangePermissions={updateFinderFolderPermissions}
        permissionGroups={folderEdits.permissionGroups}
        onChangePermissionGroups={updateFinderFolderPermissionGroups}
      />
    </div>
  );

  const MODALS = [
    {
      modalType: MODAL_TYPE.CREATE_FOLDER,
      title: 'New Folder',
      shouldCloseOnOutsideClick: true,
      showSecondary: false,
      body: renderCreateFolderBody(),
      primaryButtonProps: {
        text: 'Create Folder',
        onClick: requestCreateFinderFolder,
        isLoading: isCreatingFolder
      },
      error: createFolderError
    },
    {
      modalType: MODAL_TYPE.EDIT_FOLDER,
      title: 'Edit Folder',
      shouldCloseOnOutsideClick: true,
      showSecondary: false,
      body: renderCreateFolderBody(),
      primaryButtonProps: {
        text: 'Save Updates',
        onClick: requestUpdateFinderFolder,
        isLoading: isUpdatingFolder
      },
      error: updateFolderError
    },
    {
      modalType: MODAL_TYPE.CONFIRM_DELETE,
      title: 'Confirm Deletion',
      description: 'Are you sure you want to delete the selected card(s) and folder(s)?',
      shouldCloseOnOutsideClick: true,
      primaryButtonProps: {
        text: 'Delete',
        onClick: () => {
          switch (activePath.type) {
            case PATH_TYPE.NODE: {
              requestDeleteFinderNodes();
              break;
            }
            case PATH_TYPE.SEGMENT: {
              requestBulkDeleteFinderCards();
              break;
            }
            default:
              break;
          }
        },
        isLoading: isDeletingNodes
      },
      error: deleteNodesError
    }
  ];

  return (
    <>
      {MODALS.map(({ modalType, ...rest }) => (
        <ConfirmModal
          key={modalType}
          isOpen={modalOpen[modalType]}
          onRequestClose={() => closeFinderModal(modalType)}
          {...rest}
        />
      ))}
    </>
  );
};

FinderConfirmModals.propTypes = {
  // Redux State
  activePath: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(PATH_TYPE)).isRequired,
    state: PropTypes.object
  }).isRequired,
  modalOpen: PropTypes.objectOf(PropTypes.bool),
  folderEdits: PropTypes.shape({
    name: PropTypes.string.isRequired,
    permissions: PropTypes.object,
    permissionGroups: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,

  // Redux Actions
  closeFinderModal: PropTypes.func.isRequired,
  updateFinderFolderName: PropTypes.func.isRequired,
  updateFinderFolderPermissions: PropTypes.func.isRequired,
  updateFinderFolderPermissionGroups: PropTypes.func.isRequired,
  requestCreateFinderFolder: PropTypes.func.isRequired,
  requestDeleteFinderNodes: PropTypes.func.isRequired,
  requestBulkDeleteFinderCards: PropTypes.func.isRequired
};

export default FinderConfirmModals;
