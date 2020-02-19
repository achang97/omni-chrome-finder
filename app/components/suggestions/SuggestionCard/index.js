import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdMoreVert } from 'react-icons/md';
import TimeAgo from 'react-timeago';

import { getContentStateHTMLFromString } from '../../../utils/editorHelpers';

import CardStatus from '../../cards/CardStatus';
import SuggestionPreview from '../SuggestionPreview';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Triangle from '../../common/Triangle';
import Modal from '../../common/Modal';

import _ from 'underscore';
import { NOOP, CARD_STATUS_OPTIONS } from '../../../utils/constants';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { openCard } from '../../../actions/cards';

import { colors } from '../../../styles/colors';

import style from './suggestion-card.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

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
      showDeleteModal: false,
    }
  }

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  openDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  }

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  }

  render() {
    const { _id, question, answer, datePosted, cardStatus, className, showMoreMenu, openCard } = this.props;
    const { dropdownOpen, showDeleteModal } = this.state;
    return (
      <div className={s(`${className} mb-sm rounded-xl p-lg bg-white cursor-pointer`)} onClick={() => openCard({ _id })}>
        <div className={s("flex flex-col")}>
          <div className={s("flex")}>
            <span className={s("flex-grow text-lg text-left font-semibold")}>
              {question}
            </span>
            { showMoreMenu &&
              <div className={s("flex-shrink-0 relative")}>
                <div className={s("cursor-pointer")} onClick={() => this.toggleDropdown()}><MdMoreVert /></div>
                <Dropdown isOpen={ dropdownOpen }>
                  <div className={s("navigate-more-dropdown")}>
                      <Button 
                        text={"Share Card"}
                        className={"shadow-none border-b"}
                      />
                      <Button 
                        text={"Delete Card"}
                        className={"shadow-none"}
                        onClick={() => this.openDeleteModal()}
                      />
                    
                  </div>
                </Dropdown>
              </div>
            }
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
        <Modal
          isOpen={showDeleteModal}
          onRequestClose={() => this.closeDeleteModal()}
          headerClassName={s("bg-purple-light")}
          className={s("")}
          title={"Confirm Delete Card"}
          important
          >
          <div className={s("p-lg flex flex-col")}> 
            <div> {"Are you sure you want to delete this card?"} </div>
            <div className={s("flex mt-lg")} >
              <Button 
                text={"No"}
                onClick={() => this.closeDeleteModal()}
                color={"transparent"}
                className={s("flex-grow mr-reg")}
                underline
              /> 
              <Button 
                text={"Delete"}
                //onClick={primaryFunction}
                color={"primary"}
                className={s("flex-grow ml-reg")}
                underline
              />   
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

SuggestionCard.propTypes = {
  _id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  datePosted: PropTypes.string.isRequired,
  cardStatus: PropTypes.oneOf([CARD_STATUS_OPTIONS.UP_TO_DATE , CARD_STATUS_OPTIONS.OUT_OF_DATE, CARD_STATUS_OPTIONS.NEEDS_VERIFICATION, CARD_STATUS_OPTIONS.NEEDS_APPROVAL, CARD_STATUS_OPTIONS.NOT_DOCUMENTED]),
  className: PropTypes.string,
  showMoreMenu: PropTypes.bool,
}

SuggestionCard.defaultProps = {
  className: '',
  showMoreMenu: false,
}

export default SuggestionCard;