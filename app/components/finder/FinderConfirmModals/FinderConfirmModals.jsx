import React from 'react';
import PropTypes from 'prop-types';

import { ConfirmModal } from 'components/common';
import { CardPermissions } from 'components/cards';
import { MODAL_TYPE } from 'appConstants/finder';

import { hasValidPermissions } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const FinderConfirmModals = ({
  finderId,
  modalOpen,
  folderEdits,
  getNodeError,
  isCreatingFolder,
  createFolderError,
  isUpdatingFolder,
  updateFolderError,
  isDeletingNodes,
  moveNodesError,
  deleteNodesError,
  closeFinderModal,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  requestCreateFinderFolder,
  requestUpdateFinderFolder,
  requestDeleteFinderNodes
}) => {
  const renderCreateFolderBody = () => (
    <div>
      <input
        placeholder="Folder Name"
        value={folderEdits.name}
        onChange={(e) => updateFinderFolderName(finderId, e.target.value)}
        className={s('mb-reg w-full')}
      />
      <div className={s('text-gray-reg text-xs mb-sm')}> Permissions </div>
      <CardPermissions
        showJustMe
        isEditable
        selectedPermissions={folderEdits.permissions}
        onChangePermissions={(permissions) => updateFinderFolderPermissions(finderId, permissions)}
        permissionGroups={folderEdits.permissionGroups}
        onChangePermissionGroups={(permissionGroups) =>
          updateFinderFolderPermissionGroups(finderId, permissionGroups)
        }
      />
    </div>
  );

  const isFolderValid = () => {
    return !hasValidPermissions(folderEdits.permissions, folderEdits.permissionGroups);
  };

  const MODALS = [
    {
      modalType: MODAL_TYPE.CREATE_FOLDER,
      title: 'New Folder',
      shouldCloseOnOutsideClick: true,
      showSecondary: false,
      body: renderCreateFolderBody(),
      primaryButtonProps: {
        text: 'Create Folder',
        onClick: () => requestCreateFinderFolder(finderId),
        isLoading: isCreatingFolder,
        disabled: isFolderValid()
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
        onClick: () => requestUpdateFinderFolder(finderId),
        isLoading: isUpdatingFolder,
        disabled: isFolderValid()
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
        onClick: () => requestDeleteFinderNodes(finderId),
        isLoading: isDeletingNodes
      },
      error: deleteNodesError
    },
    {
      modalType: MODAL_TYPE.ERROR_MOVE,
      title: 'Failed to Move Content',
      description: moveNodesError,
      shouldCloseOnOutsideClick: true,
      showSecondary: false,
      primaryButtonProps: {
        text: 'Ok'
      }
    },
    {
      modalType: MODAL_TYPE.ERROR_GET,
      title: 'Folder Not Found',
      description: getNodeError,
      shouldCloseOnOutsideClick: true,
      showSecondary: false,
      primaryButtonProps: {
        text: 'Ok'
      }
    }
  ];

  return (
    <>
      {MODALS.map(({ modalType, ...rest }) => (
        <ConfirmModal
          key={modalType}
          isOpen={modalOpen[modalType]}
          onRequestClose={() => closeFinderModal(finderId, modalType)}
          {...rest}
        />
      ))}
    </>
  );
};

FinderConfirmModals.propTypes = {
  finderId: PropTypes.string.isRequired,

  // Redux State
  modalOpen: PropTypes.objectOf(PropTypes.bool),
  folderEdits: PropTypes.shape({
    name: PropTypes.string.isRequired,
    permissions: PropTypes.object,
    permissionGroups: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  getNodeError: PropTypes.string,
  isCreatingFolder: PropTypes.bool,
  createFolderError: PropTypes.string,
  isUpdatingFolder: PropTypes.bool,
  updateFolderError: PropTypes.string,
  isDeletingNodes: PropTypes.bool,
  deleteNodesError: PropTypes.string,
  moveNodesError: PropTypes.string,

  // Redux Actions
  closeFinderModal: PropTypes.func.isRequired,
  updateFinderFolderName: PropTypes.func.isRequired,
  updateFinderFolderPermissions: PropTypes.func.isRequired,
  updateFinderFolderPermissionGroups: PropTypes.func.isRequired,
  requestCreateFinderFolder: PropTypes.func.isRequired,
  requestUpdateFinderFolder: PropTypes.func.isRequired,
  requestDeleteFinderNodes: PropTypes.func.isRequired
};

export default FinderConfirmModals;
