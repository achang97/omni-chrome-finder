import React from 'react';
import PropTypes from 'prop-types';

import { ConfirmModal } from 'components/common';
import { CardPermissions } from 'components/cards';
import { MODAL_TYPE } from 'appConstants/finder';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const FinderConfirmModals = ({
  modalOpen,
  folderEdits,
  isCreatingFolder,
  createFolderError,
  closeFinderModal,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  requestCreateFinderFolder,
  requestDeleteFinderNodes
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
      title: 'New Folder',
      shouldCloseOnOutsideClick: true,
      showSecondary: false,
      body: renderCreateFolderBody(),
      primaryButtonProps: {
        text: 'Create Folder',
        // onClick: () => closeCardModal(MODAL_TYPE.THREAD),
      }
    },
    {
      modalType: MODAL_TYPE.CONFIRM_DELETE,
      title: 'Confirm Deletion',
      description: 'Are you sure you want to delete the selected files and folders?',
      shouldCloseOnOutsideClick: true,
      primaryButtonProps: {
        text: 'Create Folder',
        onClick: requestDeleteFinderNodes
      }
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
  requestDeleteFinderNodes: PropTypes.func.isRequired
};

export default FinderConfirmModals;
