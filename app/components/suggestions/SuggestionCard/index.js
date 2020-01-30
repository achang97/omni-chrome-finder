import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck } from 'react-icons/md';

import CardStatus from '../../cards/CardStatus';
import SuggestionPreview from '../SuggestionPreview';
import Button from '../../common/Button';
import Triangle from '../../common/Triangle';

import _ from 'underscore';

import { colors } from '../../../styles/colors';

import style from './suggestion-card.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

class SuggestionCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showQuestionInfo: false,
    }

    this.cardRef = React.createRef();
    this.previewWrapperRef = React.createRef();
  }

  onMouseOver = (e) => {
    const { heading, headingDescription, description, datePosted, isUpToDate } = this.props;
    const { top, left, right, width } = e.currentTarget.getBoundingClientRect();

    this.setState({ showQuestionInfo: true }, () => {
      const cardPreview = this.previewWrapperRef.current;

      /* A little hacky: 
       * 1. +4px correction for scrollbar width.
       * 2. -27px correction for unknown extra top spacing
       */
      cardPreview.style.right = `${width + 4}px`;
      cardPreview.style.top = `${top - 27}px`;
    });
  }

  onMouseOut = (e) => {
    // console.log(e.currentTarget === this.cardRef.current)
    // if (e.currentTarget !== this.cardRef.current) {
    //   console.log(e.currentTarget, this.previewWrapperRef.current)
    //   const cardPreview = this.previewWrapperRef.current;

    //   this.setState({ showQuestionInfo: null });
    // }
  }

  render() {
    const { heading, headingDescription, description, datePosted, isUpToDate } = this.props;
    const { showQuestionInfo } = this.state;

    return (
      <div
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        className={s("suggestion-card px-reg")}
        ref={this.cardRef}
      >
        <div className={s("mb-sm rounded-xl p-lg bg-white")}>
          <div className={s("flex flex-col")}>
            <span className={s("text-lg text-left font-semibold")}>
              {heading}
            </span>
            <span className={s("mt-sm text-xs text-gray-dark font-medium vertical-ellipsis-2")}>
              {description}
            </span>
          </div>
          <div className={s("mt-reg pt-reg flex-col")}>
            <div className={s("horizontal-separator mb-sm")} />
            <div className={s("flex items-center justify-between")}>
              <span className={s("block text-center text-xs text-gray-light")}>
                {datePosted}
              </span>
              <CardStatus isUpToDate={isUpToDate} />
            </div>
          </div>
        </div>
        <div className={s("suggestion-card-preview-wrapper")} ref={this.previewWrapperRef}>
          { showQuestionInfo && <SuggestionPreview {...this.props} /> }
          <Triangle
            size={10}
            color={colors.purple.light}
            direction="left"
            className={s("mt-lg")}
            outlineSize={1}
            outlineColor={colors.gray.light}
          />
        </div>
      </div>
    );
  }
}

SuggestionCard.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  datePosted: PropTypes.string.isRequired,
  isUpToDate: PropTypes.bool.isRequired,
}

export default SuggestionCard;