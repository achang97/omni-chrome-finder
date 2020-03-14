import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdMoreVert } from 'react-icons/md';
import TimeAgo from 'react-timeago';
import AnimateHeight from 'react-animate-height';

import { getContentStateHTMLFromString } from '../../../utils/editor';

import CardStatus from '../../cards/CardStatus';
import CardConfirmModal from '../../cards/CardConfirmModal';
import SuggestionPreview from '../SuggestionPreview';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Triangle from '../../common/Triangle';
import Modal from '../../common/Modal';
import Loader from '../../common/Loader';

import { NOOP, CARD_STATUS, CARD_URL_BASE, TIMEOUT_3S } from '../../../utils/constants';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { openCard } from '../../../actions/cards';
import _ from 'lodash';

import { colors } from '../../../styles/colors';

import style from './suggestion-card.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const BUTTON_TYPE = {
  SHARE: 'SHARE',
  DELETE: 'DELETE'
};

@connect(
  state => ({
  }),
  dispatch => bindActionCreators({
    openCard,
  }, dispatch)
)

class SuggestionCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      buttonActive: _.mapValues(BUTTON_TYPE, () => false),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.deleteProps && prevProps.deleteProps.isLoading && !this.props.deleteProps.isLoading && !this.props.deleteProps.error) {
      this.toggleActiveButton(BUTTON_TYPE.DELETE, false);
    }
  }

  getButtonProps = ({ isLoading, onClick }) => {
    const { id } = this.props;
    return {
      onClick: () => onClick(id),
      iconLeft: false,
      icon: isLoading ? <Loader className={s('ml-sm')} size="sm" color="white" /> : null,
      disabled: isLoading,
    };
  }

  getActions = () => {
    const actions = [{
      label: 'Share Card',
      buttonType: BUTTON_TYPE.SHARE,
      onClick: () => this.shareCard(),
    }];

    if (this.props.deleteProps) {
      actions.push({
        label: 'Delete Card',
        buttonType: BUTTON_TYPE.DELETE,
        modalProps: {
          title: 'Confirm Delete Card',
          description: 'Are you sure you want to delete this card?',
          error: this.props.deleteProps.error,
          primaryButtonProps: {
            text: 'Delete',
            ...this.getButtonProps(this.props.deleteProps)
          }
        }
      });
    }

    return actions;
  }

  toggleActiveButton = (type, value) => {
    this.setState({ buttonActive: { ...this.state.buttonActive, [type]: value !== undefined ? value : !this.state.buttonActive[type] } });
  }

  shareCard = () => {
    const { id } = this.props;

    // Create invisible element with text
    const el = document.createElement('textarea');
    el.value = `${CARD_URL_BASE}${id}`;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);

    // Select, copy and remove
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    this.toggleActiveButton(BUTTON_TYPE.SHARE);
    setTimeout(() => this.toggleActiveButton(BUTTON_TYPE.SHARE), TIMEOUT_3S);
  }

  protectedOnClick = (onClick, buttonType) => {
    if (onClick) {
      onClick();
    } else {
      this.toggleActiveButton(buttonType);
    }

    this.setState({ dropdownOpen: false });
  }

  renderDropdown = () => {
    if (!this.props.showMoreMenu) {
      return null;
    }

    const { dropdownOpen } = this.state;
    const actions = this.getActions();

    return (
      <div className={s('flex-shrink-0 relative')}>
        <Dropdown
          className={s('ml-xs')}
          isOpen={dropdownOpen}
          toggler={<MdMoreVert />}
          onToggle={dropdownOpen => this.setState({ dropdownOpen })}
          body={
            <div className={s('navigate-more-dropdown')}>
              { actions.map(({ label, onClick, buttonType }, i) => (
                <div key={buttonType}>
                  <Button
                    key={label}
                    text={label}
                    className={'shadow-none text-purple-reg'}
                    onClick={() => this.protectedOnClick(onClick, buttonType)}
                  />
                  { i !== actions.length - 1 &&
                    <div className={s('horizontal-separator my-0')} />
                  }
                </div>
              ))}
            </div>
          }
        />
      </div>
    );
  }

  renderShareSuccess() {
    const { buttonActive } = this.state;
    return (
      <AnimateHeight height={buttonActive[BUTTON_TYPE.SHARE] ? 'auto' : 0}>
        <div className={s('flex-1 mt-sm mx-sm p-sm text-center bg-purple-light rounded-full text-xs')}>
          Copied link to clipboard!
        </div>
      </AnimateHeight>
    );
  }

  renderModals = () => {
    const { buttonActive } = this.state;
    const actions = this.getActions();

    return (
      <div>
        { actions.filter(({ modalProps }) => !!modalProps).map(({ modalProps, buttonType }) =>
          <div key={buttonType}>
            <CardConfirmModal
              isOpen={buttonActive[buttonType]}
              onRequestClose={() => this.toggleActiveButton(buttonType)}
              {...modalProps}
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    const { id, question, answer, createdAt, status, className, openCard } = this.props;

    return (
      <div className={s(`${className} rounded-xl p-lg bg-white cursor-pointer`)} onClick={() => openCard({ _id: id })}>
        <div className={s('flex flex-col')}>
          <div className={s('flex')}>
            <span className={s('flex-grow text-lg text-left font-semibold')}>
              {question}
            </span>
            { this.renderDropdown() }
          </div>
          <span className={s('mt-sm text-xs text-gray-dark font-medium vertical-ellipsis-2')}>
            {answer}
          </span>
        </div>
        <div className={s('mt-reg pt-reg flex-col')}>
          <div className={s('horizontal-separator mb-sm')} />
          <div className={s('flex items-center justify-between')}>
            <span className={s('block text-center text-xs text-gray-light')}>
              <TimeAgo date={createdAt} live={false} />
            </span>
            <CardStatus status={status} />
          </div>
        </div>
        { this.renderShareSuccess() }
        { this.renderModals() }
      </div>
    );
  }
}

SuggestionCard.propTypes = {
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  status: PropTypes.oneOf([CARD_STATUS.UP_TO_DATE, CARD_STATUS.OUT_OF_DATE, CARD_STATUS.NEEDS_VERIFICATION, CARD_STATUS.NEEDS_APPROVAL, CARD_STATUS.NOT_DOCUMENTED]),
  className: PropTypes.string,
  showMoreMenu: PropTypes.bool,
  deleteProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
  }),
};

SuggestionCard.defaultProps = {
  className: '',
  showMoreMenu: false,
};

export default SuggestionCard;
