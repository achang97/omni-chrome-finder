import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { CardSection, CardLocation, CardUsers, CardVerificationInterval } from 'components/cards';
import { FinderModal } from 'components/finder';
import { Modal, Message } from 'components/common';

import { UserPropTypes, NodePropTypes } from 'utils/propTypes';
import { getStyleApplicationFn } from 'utils/style';
import { usePrevious } from 'utils/react';
import { isActiveUser } from 'utils/user';

import style from './external-create-modal.css';

const s = getStyleApplicationFn(style);

const ExternalCreateModal = ({
  user,
  isCreateModalOpen,
  title,
  owners,
  verificationInterval,
  finderNode,
  isCreatingCard,
  createCardError,
  requestCreateExternalCard,
  toggleExternalCreateModal,
  updateExternalTitle,
  addExternalOwner,
  removeExternalOwner,
  updateExternalVerificationInterval,
  updateExternalFinderNode
}) => {
  const [isFinderModalOpen, setFinderModalOpen] = useState(false);

  const prevOpen = usePrevious(isCreateModalOpen);
  useEffect(() => {
    if (!prevOpen && isCreateModalOpen) {
      addExternalOwner(user);
    }
  }, [prevOpen, isCreateModalOpen, user, title, addExternalOwner]);

  const SECTIONS = [
    {
      title: 'Location',
      children: (
        <CardLocation
          finderNode={finderNode}
          isEditable
          onChangeClick={() => setFinderModalOpen(true)}
        />
      )
    },
    {
      title: 'Title',
      children: (
        <input
          placeholder="Title"
          value={title}
          className={s('w-full')}
          onChange={(e) => updateExternalTitle(e.target.value)}
        />
      )
    },
    {
      title: 'Owner(s)',
      children: (
        <CardUsers
          users={owners}
          onAdd={(addUser) => addExternalOwner(addUser)}
          onRemoveClick={({ user: removeUser }) => removeExternalOwner(removeUser)}
          size="sm"
          isEditable
        />
      )
    },
    {
      title: 'Verification Interval',
      children: (
        <CardVerificationInterval
          verificationInterval={verificationInterval}
          isEditable
          onChange={updateExternalVerificationInterval}
        />
      )
    }
  ];

  return (
    <>
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={toggleExternalCreateModal}
        title={title || 'New External Card'}
        shouldCloseOnOutsideClick
        important
        fixed
        className={s('external-create-modal')}
        bodyClassName={s('px-lg py-reg')}
        primaryButtonProps={{
          text: 'Track',
          disabled:
            title === '' || owners.filter(isActiveUser).length === 0 || !verificationInterval,
          isLoading: isCreatingCard,
          onClick: requestCreateExternalCard
        }}
      >
        {SECTIONS.map(({ title: sectionTitle, children }, i) => (
          <CardSection
            key={sectionTitle}
            title={sectionTitle}
            isVertical={false}
            isExpandable={false}
            className={s('py-xs')}
            showSeparator={i !== SECTIONS.length - 1}
          >
            {children}
          </CardSection>
        ))}
        <Message type="error" message={createCardError} className={s('my-sm')} />
      </Modal>
      <FinderModal
        important
        fixed
        isOpen={isFinderModalOpen}
        finderId="external-verification"
        onSecondaryClick={() => setFinderModalOpen(false)}
        onPrimaryClick={(destination) => {
          setFinderModalOpen(false);
          updateExternalFinderNode(destination);
        }}
        className={s('external-finder-modal')}
        overlayClassName={s('rounded-lg')}
      />
    </>
  );
};

ExternalCreateModal.propTypes = {
  // Redux State
  user: UserPropTypes,
  isCreateModalOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  owners: PropTypes.arrayOf(PropTypes.object).isRequired,
  verificationInterval: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  }),
  finderNode: NodePropTypes,
  isCreatingCard: PropTypes.bool,
  createCardError: PropTypes.string,

  // Redux Actions
  requestCreateExternalCard: PropTypes.func.isRequired,
  toggleExternalCreateModal: PropTypes.func.isRequired,
  updateExternalTitle: PropTypes.func.isRequired,
  addExternalOwner: PropTypes.func.isRequired,
  removeExternalOwner: PropTypes.func.isRequired,
  updateExternalVerificationInterval: PropTypes.func.isRequired,
  updateExternalFinderNode: PropTypes.func.isRequired
};

export default ExternalCreateModal;
