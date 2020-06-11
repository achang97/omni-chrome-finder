import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { IoMdAlert } from 'react-icons/io';
import { MdClose, MdSettings } from 'react-icons/md';
import ReactDraggable from 'react-draggable';

import { CardStatus } from 'components/cards';
import { Button, Modal, Message, Loader, CheckBox } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import { usePrevious } from 'utils/react';
import { UserPropTypes } from 'utils/propTypes';
import { EXTERNAL_VERIFICATION, INTEGRATIONS_MAP, INTEGRATIONS } from 'appConstants';
import style from './external-verification.css';

const s = getStyleApplicationFn(style);

const URL_REGEX_LIST = Object.entries(EXTERNAL_VERIFICATION.URL_REGEXES);

const ExternalVerification = ({
  url,
  isDisplayed,
  activeIntegration,
  isSettingsModalOpen,
  settingIndex,
  externalCard,
  isGettingCard,
  user,
  isValidUser,
  isUpdatingUser,
  updateUserError,
  dockVisible,
  toggleExternalSettingsModal,
  toggleExternalCreateModal,
  toggleExternalDisplay,
  updateExternalSettingIndex,
  updateExternalIntegration,
  resetExternalState,
  requestGetExternalCard,
  updateExternalTitle,
  updateExternalLinkAnswer,
  requestUpdateUser,
  toggleDock,
  openCard
}) => {
  useEffect(() => {
    const isEnabled = ({ integration, links: { link } }) => {
      if (!isValidUser) return false;

      const {
        widgetSettings: {
          externalLink: { disabledPages, disabledIntegrations, disabled }
        },
        integrations
      } = user;

      // Specific check for Zendesk brand url
      if (integration === INTEGRATIONS.ZENDESK.type) {
        const { brands: zendeskBrands = [] } = integrations[INTEGRATIONS.ZENDESK.type];
        if (zendeskBrands.length !== 0) {
          const hasMatch = zendeskBrands.some(({ brand_url: brandUrl }) =>
            link.startsWith(brandUrl)
          );

          if (!hasMatch) {
            return false;
          }
        }
      }

      return (
        !disabled && !disabledIntegrations.includes(integration) && !disabledPages.includes(link)
      );
    };

    const resetState = () => {
      if (activeIntegration) {
        resetExternalState();
      }
    };

    if (!isValidUser || !url || (activeIntegration && !isEnabled(activeIntegration))) {
      resetState();
    } else {
      let i;
      let newIntegration = null;

      for (i = 0; i < URL_REGEX_LIST.length; i++) {
        const [integration, { regex, getTitle, getLinks }] = URL_REGEX_LIST[i];
        const match = url.match(regex);
        if (match) {
          const links = getLinks(match);
          if (isEnabled({ integration, links })) {
            newIntegration = { links, getTitle, integration };
            break;
          }
        }
      }

      if (!newIntegration) {
        resetState();
      } else if (!activeIntegration || newIntegration.links.link !== activeIntegration.links.link) {
        updateExternalIntegration(newIntegration);
        requestGetExternalCard();
      }
    }
  }, [
    url,
    user,
    isValidUser,
    activeIntegration,
    updateExternalIntegration,
    resetExternalState,
    requestGetExternalCard
  ]);

  const prevIsUpdatingUser = usePrevious(isUpdatingUser);
  useEffect(() => {
    if (prevIsUpdatingUser && !isUpdatingUser && !updateUserError && isSettingsModalOpen) {
      toggleExternalSettingsModal();
    }
  }, [
    isUpdatingUser,
    prevIsUpdatingUser,
    updateUserError,
    isSettingsModalOpen,
    toggleExternalSettingsModal,
    toggleExternalDisplay
  ]);

  const renderUntrackedView = () => {
    const onOpenModal = () => {
      toggleExternalCreateModal();

      const { links, getTitle, integration } = activeIntegration;
      updateExternalTitle(getTitle(document.title));
      updateExternalLinkAnswer({ ...links, type: integration });
    };

    return (
      <>
        <div className={s('text-xs text-gray-reg mb-xs')}>This knowledge is</div>
        <div className={s('flex mb-sm')}>
          <IoMdAlert className={s('text-purple-reg mr-xs')} />
          <span className={s('text-sm text-gray-dark font-bold')}> Unverified </span>
        </div>
        <Button
          text="Verify with Omni"
          className={s('py-sm')}
          color="transparent"
          onClick={onOpenModal}
        />
      </>
    );
  };

  const renderTrackedView = () => {
    const onClick = () => {
      if (!dockVisible) {
        toggleDock();
      }

      openCard({ _id: externalCard._id });
    };

    return (
      <>
        <div className={s('text-xs text-gray-reg mb-xs')}>This knowledge is</div>
        <CardStatus status={externalCard.status} />
        <div
          className={s('text-purple-reg text-xs mt-sm underline-border cursor-pointer')}
          onClick={onClick}
        >
          Manage
        </div>
      </>
    );
  };

  const renderSettingsModal = () => {
    const {
      integration,
      links: { link }
    } = activeIntegration;
    const { title = '' } = INTEGRATIONS_MAP[integration] || {};

    const {
      widgetSettings: { externalLink }
    } = user;

    const OPTIONS = [
      {
        label: 'Disable on this document',
        isImportant: false,
        newSettings: {
          ...externalLink,
          disabledPages: _.union(externalLink.disabledPages, [link])
        }
      },
      {
        label: `Disable on all ${title} Documents`,
        isImportant: true,
        newSettings: {
          ...externalLink,
          disabledIntegrations: _.union(externalLink.disabledIntegrations, [integration])
        }
      },
      {
        label: 'Disable on all external docs',
        isImportant: true,
        newSettings: { ...externalLink, disabled: true }
      }
    ];

    const onSubmit = () => {
      requestUpdateUser({
        widgetSettings: {
          ...user.widgetSettings,
          externalLink: OPTIONS[settingIndex].newSettings
        }
      });
    };

    return (
      <Modal
        isOpen={isSettingsModalOpen}
        onRequestClose={toggleExternalSettingsModal}
        title="Verify Existing Documents Settings"
        shouldCloseOnOutsideClick
        important
        fixed
        className={s('external-verification-modal')}
        bodyClassName={s('px-lg py-reg overflow-visible')}
        primaryButtonProps={{
          text: 'Save Settings',
          isLoading: isUpdatingUser,
          onClick: onSubmit
        }}
      >
        {OPTIONS.map(({ label, isImportant }, i) => (
          <div className={s('flex my-reg items-center')} key={label}>
            <CheckBox
              isSelected={i === settingIndex}
              toggleCheckbox={() => updateExternalSettingIndex(i)}
              className={s('flex-shrink-0 mr-reg h-xl w-xl')}
            />
            <div className={s(`${isImportant ? 'text-red-500 italic' : ''}`)}> {label} </div>
          </div>
        ))}
        <Message type="error" message={updateUserError} className={s('my-sm')} />
      </Modal>
    );
  };

  const render = () => {
    if (!isValidUser || !isDisplayed || !activeIntegration) {
      return null;
    }

    return (
      <>
        <ReactDraggable bounds="html">
          <div className={s('external-verification-container')}>
            <div className={s('flex self-stretch text-xs justify-end my-xs')}>
              <MdSettings
                onClick={toggleExternalSettingsModal}
                className={s('cursor-pointer text-gray-reg')}
              />
              <MdClose
                onClick={toggleExternalDisplay}
                className={s('cursor-pointer text-gray-dark')}
              />
            </div>
            {isGettingCard && <Loader size="sm" />}
            {!isGettingCard && (externalCard ? renderTrackedView() : renderUntrackedView())}
          </div>
        </ReactDraggable>
        {renderSettingsModal()}
      </>
    );
  };

  return render();
};

ExternalVerification.propTypes = {
  url: PropTypes.string,

  // Redux State
  isDisplayed: PropTypes.bool.isRequired,
  activeIntegration: PropTypes.shape({
    getTitle: PropTypes.func,
    integration: PropTypes.string.isRequired,
    links: PropTypes.shape({
      link: PropTypes.string.isRequired,
      previewLink: PropTypes.string
    })
  }),
  settingIndex: PropTypes.number.isRequired,
  externalCard: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    finderNode: PropTypes.object
  }),
  isGettingCard: PropTypes.bool,
  user: UserPropTypes.isRequired,
  isValidUser: PropTypes.bool.isRequired,
  isUpdatingUser: PropTypes.bool,
  updateUserError: PropTypes.string,
  dockVisible: PropTypes.bool.isRequired,

  // Redux Actions
  toggleExternalSettingsModal: PropTypes.func.isRequired,
  toggleExternalCreateModal: PropTypes.func.isRequired,
  toggleExternalDisplay: PropTypes.func.isRequired,
  updateExternalSettingIndex: PropTypes.func.isRequired,
  updateExternalIntegration: PropTypes.func.isRequired,
  resetExternalState: PropTypes.func.isRequired,
  requestGetExternalCard: PropTypes.func.isRequired,
  updateExternalTitle: PropTypes.func.isRequired,
  updateExternalLinkAnswer: PropTypes.func.isRequired,
  requestUpdateUser: PropTypes.func.isRequired,
  toggleDock: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired
};

export default ExternalVerification;
