import React from 'react';
import PropTypes from 'prop-types';

import { Loader, Triangle, ScrollContainer } from 'components/common';
import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';

import SuggestionCard from '../SuggestionCard';
import SuggestionPreview from '../SuggestionPreview';

import style from './suggestion-scroll-container.css';

const s = getStyleApplicationFn(style);

const SEARCH_INFINITE_SCROLL_OFFSET = 150;

const SuggestionScrollContainer = ({
  cards,
  getCardProps,
  isSearchingCards,
  hasReachedLimit,
  onBottom,
  showPlaceholder,
  footer,
  scrollContainerClassName,
  className,
  triangleColor
}) => {
  const renderPlaceholder = () => {
    if (isSearchingCards) {
      return <Loader size="md" className={s('my-reg')} />;
    }
    if (showPlaceholder) {
      return <div className={s('text-gray-light text-sm my-reg text-center')}> No results </div>;
    }
    return null;
  };

  const renderScrollElement = (card, i) => {
    const { _id, question, answer, status } = card;
    const { className: cardClassName = '', ...restCardProps } = getCardProps
      ? getCardProps(card, i)
      : {};

    return (
      <SuggestionCard
        id={_id}
        question={question}
        answer={answer}
        status={status}
        className={s(`suggestion-scroll-container-card ${cardClassName}`)}
        {...restCardProps}
      />
    );
  };

  const renderOverflowElement = (card, i, positions) => {
    const { _id, question, description, answer } = card;
    const { overflow, scroll } = positions;

    const overflowTop = overflow.top || 0;
    const scrollTop = scroll.top || 0;

    const triangleMarginTop = Math.max(0, scrollTop - overflowTop);

    return (
      <div className={s('flex')}>
        <SuggestionPreview
          id={_id}
          question={question}
          questionDescription={description}
          answer={answer}
        />
        <Triangle
          size={10}
          color={triangleColor}
          direction="left"
          style={{ marginTop: triangleMarginTop }}
          outlineSize={1}
          outlineColor={colors.gray.light}
        />
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <>
        {isSearchingCards && cards.length !== 0 && <Loader size="sm" className={s('my-sm')} />}
        {footer}
      </>
    );
  };

  const handleOnBottom = () => {
    if (!hasReachedLimit && !isSearchingCards && cards.length !== 0) {
      onBottom();
    }
  };

  return (
    <ScrollContainer
      className={className}
      scrollContainerClassName={s(`suggestion-scroll-container ${scrollContainerClassName}`)}
      list={cards}
      getKey={(card) => card._id}
      placeholder={renderPlaceholder()}
      renderScrollElement={renderScrollElement}
      renderOverflowElement={renderOverflowElement}
      footer={renderFooter()}
      onBottom={handleOnBottom}
      bottomOffset={SEARCH_INFINITE_SCROLL_OFFSET}
    />
  );
};

SuggestionScrollContainer.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      answer: PropTypes.string,
      updatedAt: PropTypes.string.isRequired,
      status: PropTypes.number.isRequired
    })
  ).isRequired,
  getCardProps: PropTypes.func,
  isSearchingCards: PropTypes.bool,
  onBottom: PropTypes.func.isRequired,
  showPlaceholder: PropTypes.bool,
  footer: PropTypes.node,
  triangleColor: PropTypes.string,
  hasReachedLimit: PropTypes.bool.isRequired,
  scrollContainerClassName: PropTypes.string,
  className: PropTypes.string
};

SuggestionScrollContainer.defaultProps = {
  isSearchingCards: false,
  showPlaceholder: true,
  triangleColor: 'white',
  footer: null,
  getCardProps: null,
  scrollContainerClassName: '',
  className: ''
};

export default SuggestionScrollContainer;
