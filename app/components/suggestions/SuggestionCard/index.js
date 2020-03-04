import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdMoreVert } from 'react-icons/md';
import TimeAgo from 'react-timeago';

import { getContentStateHTMLFromString } from '../../../utils/editorHelpers';

import CardStatus from '../../cards/CardStatus';
import CardConfirmModal from '../../cards/CardConfirmModal';
import SuggestionPreview from '../SuggestionPreview';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Triangle from '../../common/Triangle';
import Modal from '../../common/Modal';
import Loader from '../../common/Loader';

import { NOOP, CARD_STATUS, CARD_URL_BASE } from '../../../utils/constants';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { openCard } from '../../../actions/cards';
import _ from 'underscore';

import { colors } from '../../../styles/colors';

import style from './suggestion-card.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const BUTTON_TYPE = {
  SHARE: 'SHARE',
  DELETE: 'DELETE'
}

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
      modalOpen: _.mapObject(BUTTON_TYPE, (val, key) => false),
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.deleteProps && prevProps.deleteProps.isLoading && !this.props.deleteProps.isLoading && !this.props.deleteProps.error) {
      this.toggleModal(BUTTON_TYPE.DELETE, false);
    }
  }

  getButtonProps = ({ isLoading, onClick }) => {
    const { _id } = this.props;
    return {
      onClick: () => onClick(_id),
      iconLeft: false,
      icon: isLoading ? <Loader className={s("ml-sm")} size="sm" color="white" /> : null,
      disabled: isLoading,      
    }
  }

  getActions = () => {
    const actions = [{
      label: 'Share Card',
      buttonType: BUTTON_TYPE.SHARE,
      onClick: () => this.shareCard(),
      modal: (
        <div className={s("flex-1 mt-sm mx-sm p-sm text-center bg-purple-light rounded-full text-xs")}>
          Copied link to clipboard!
        </div>
      )
    }];

    if (this.props.deleteProps) {
      actions.push({
        label: 'Delete Card',
        buttonType: BUTTON_TYPE.DELETE,
        modalProps: {
          title: "Confirm Delete Card",
          description: "Are you sure you want to delete this card?",
          error: this.props.deleteProps.error,
          primaryButtonProps: {
            text: "Delete",
            ...this.getButtonProps(this.props.deleteProps)
          }
        }
      });
    }
  
    return actions;    
  }

  toggleModal = (type, value) => {
    this.setState({ modalOpen: { ...this.state.modalOpen, [type]: value !== undefined ? value : !this.state.modalOpen[type] } })
  }

  shareCard = () => {
    const { _id } = this.props;

    // Create invisible element with text
    const el = document.createElement('textarea');
    el.value = `${CARD_URL_BASE}${_id}`;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);

    // Select, copy and remove
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    this.toggleModal(BUTTON_TYPE.SHARE);
    setTimeout(() => this.toggleModal(BUTTON_TYPE.SHARE), 3000);
  }

  protectedOnClick = (onClick, buttonType) => {
    if (onClick) {
      onClick();  
    } else {
      this.toggleModal(buttonType);
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
      <div className={s("flex-shrink-0 relative")}>
        <Dropdown
          className={s("ml-xs")}
          isOpen={dropdownOpen}
          toggler={ <MdMoreVert /> }
          onToggle={(dropdownOpen) => this.setState({ dropdownOpen })}
          body={
            <div className={s("navigate-more-dropdown")}>
              { actions.map(({ label, onClick, buttonType }, i) => (
                <div key={buttonType}>
                  <Button
                    key={label} 
                    text={label}
                    className={'shadow-none'}
                    onClick={() => this.protectedOnClick(onClick, buttonType)}
                  />
                  { i !== actions.length - 1 &&
                    <div className={s("horizontal-separator my-0")} />
                  }
                </div>
              ))}
            </div>
          }
        />
      </div>
    );
  }

  renderModals = () => {
    const { modalOpen } = this.state;
    const actions = this.getActions();

    return (
      <div>
        { actions.map(({ modal, modalProps, buttonType }) =>
          <div key={buttonType}>
            { modal ?
              (modalOpen[buttonType] && modal) :
              <CardConfirmModal
                isOpen={modalOpen[buttonType]}
                onRequestClose={() => this.toggleModal(buttonType)}
                {...modalProps}
              />
            }
          </div>
        )}
      </div>
    );
  }

  render() {
    const { _id, question, answer, datePosted, cardStatus, className, openCard } = this.props;

    return (
      <div className={s(`${className} mb-sm rounded-xl p-lg bg-white cursor-pointer`)} onClick={() => openCard({ _id })}>
        <div className={s("flex flex-col")}>
          <div className={s("flex")}>
            <span className={s("flex-grow text-lg text-left font-semibold")}>
              {question}
            </span>
            { this.renderDropdown() }
          </div>
          <span className={s("mt-sm text-xs text-gray-dark font-medium vertical-ellipsis-2")}>
            {answer}
          </span>
        </div>
        <div className={s("mt-reg pt-reg flex-col")}>
          <div className={s("horizontal-separator mb-sm")} />
          <div className={s("flex items-center justify-between")}>
            <span className={s("block text-center text-xs text-gray-light")}>
              <TimeAgo date={datePosted} live={false} />
            </span>
            <CardStatus cardStatus={cardStatus} />
          </div>
        </div>
        { this.renderModals() }
      </div>
    );
  }
}

SuggestionCard.propTypes = {
  _id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  datePosted: PropTypes.string.isRequired,
  cardStatus: PropTypes.oneOf([CARD_STATUS.UP_TO_DATE , CARD_STATUS.OUT_OF_DATE, CARD_STATUS.NEEDS_VERIFICATION, CARD_STATUS.NEEDS_APPROVAL, CARD_STATUS.NOT_DOCUMENTED]),
  className: PropTypes.string,
  showMoreMenu: PropTypes.bool,
  deleteProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
  }),
}

SuggestionCard.defaultProps = {
  className: '',
  showMoreMenu: false,
}

export default SuggestionCard;