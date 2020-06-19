import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import Toggle from 'react-toggle';

import AnimateHeight from 'react-animate-height';

import { Loader, Message } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import style from './settings-section.css';

import IntegrationAuthButton from '../IntegrationAuthButton';

const s = getStyleApplicationFn(style);

const SettingsSection = React.forwardRef(
  (
    { type, title, startOpen, onToggleOption, options, error, isLoading, className, footer },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(startOpen);

    const renderOptionAction = (option) => {
      switch (type) {
        case 'toggle': {
          const { type: optionType, disabled, isToggledOn } = option;
          return (
            <Toggle
              checked={!disabled && isToggledOn}
              disabled={disabled}
              icons={false}
              onChange={() => onToggleOption(optionType)}
            />
          );
        }
        case 'authButton': {
          return <IntegrationAuthButton integration={option} showIntegration={false} />;
        }
        default: {
          return null;
        }
      }
    };

    const renderOptions = () => {
      return (
        <div>
          {options.map((option, i) => {
            const { title: optionTitle, logo } = option;
            return (
              <div
                key={optionTitle}
                className={s(
                  `flex bg-white p-reg justify-between border border-solid border-gray-xlight items-center rounded-lg ${
                    i > 0 ? 'mt-sm' : ''
                  }`
                )}
              >
                <div className={s('flex flex-1 items-center')}>
                  <div className={s('settings-integration-img-container')}>
                    <img src={logo} className={s('settings-integration-img')} alt={optionTitle} />
                  </div>
                  <div className={s('flex-1 text-sm')}> {optionTitle} </div>
                </div>
                {renderOptionAction(option)}
              </div>
            );
          })}
        </div>
      );
    };

    const render = () => {
      const Icon = isOpen ? MdKeyboardArrowUp : MdKeyboardArrowDown;
      const isToggle = type === 'toggle';

      return (
        <div
          key={title}
          className={s(
            `settings-integration-container ${
              isOpen
                ? 'settings-integration-container-active'
                : 'settings-integration-container-inactive'
            } ${className}`
          )}
          ref={ref}
        >
          <div
            className={s(
              `py-sm flex items-center justify-between cursor-pointer ${isOpen ? 'mb-sm' : ''}`
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className={s('text-purple-reg text-sm')}>{title}</div>
            <div className={s('flex items-center')}>
              {isToggle && isLoading && <Loader size="xs" className={s('mr-sm')} />}
              <Icon className={s('text-gray-dark')} />
            </div>
          </div>
          <AnimateHeight
            height={isOpen ? 'auto' : 0}
            animationStateClasses={{ animatingUp: s('invisible') }}
          >
            {renderOptions()}
            {footer}
          </AnimateHeight>
          <Message className={s('my-sm')} message={error} type="error" show={isToggle} />
        </div>
      );
    };

    return render();
  }
);

SettingsSection.displayName = 'SettingsSection';

SettingsSection.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['toggle', 'authButton']).isRequired,
  startOpen: PropTypes.bool,
  onToggleOption: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
      isToggledOn: PropTypes.bool,
      disabled: PropTypes.bool
    })
  ).isRequired,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  footer: PropTypes.node
};

SettingsSection.defaultProps = {
  startOpen: false,
  className: ''
};

export default SettingsSection;
