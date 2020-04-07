import React from 'react';
import PropTypes from 'prop-types';

import SuggestionCard from '../SuggestionCard';
import SuggestionPreview from '../SuggestionPreview';
import Loader from '../../common/Loader';
import Triangle from '../../common/Triangle';
import ScrollContainer from '../../common/ScrollContainer';

import { colors } from '../../../styles/colors';
import style from './suggestion-scroll-container.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const SEARCH_INFINITE_SCROLL_OFFSET = 150;

const SuggestionScrollContainer = ({ cards, getCardProps, isSearchingCards, hasReachedLimit, onBottom, showPlaceholder, footer, scrollContainerClassName, triangleColor, ...rest }) => {
  const renderPlaceholder = () => {
    if (isSearchingCards) {
      return <Loader size="md" className={s('my-reg')} />;
    } else if (showPlaceholder) {
      return <div className={s('text-gray-light text-sm my-reg text-center')}> No results </div>;
    } else {
      return null;
    }
  };

  const renderScrollElement = (card, i) => {
    const { _id, question, answer, lastEdited, status } = card;
    const { className='', ...rest } = getCardProps ? getCardProps(card, i) : {};
    return (
      <SuggestionCard
        id={_id}
        question={question}
        answer={answer}
        updatedAt={lastEdited.time}
        status={status}
        className={s(`suggestion-scroll-container-card ${className}`)}
        {...rest}
      />
    );
  };

  const renderOverflowElement = ({ _id, question, description, answer }, i, positions) => {
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
      <React.Fragment>
        { isSearchingCards && cards.length !== 0 && <Loader size="sm" className={s('my-sm')} /> }
        { footer }
      </React.Fragment>
    );
  }

  const handleOnBottom = () => {
    if (!hasReachedLimit && !isSearchingCards && cards.length !== 0) {
      onBottom();
    }
  };

  return (
    <ScrollContainer
      scrollContainerClassName={s(`suggestion-scroll-container ${scrollContainerClassName}`)}
      list={cards}
      placeholder={renderPlaceholder()}
      renderScrollElement={renderScrollElement}
      renderOverflowElement={renderOverflowElement}
      footer={renderFooter()}
      onBottom={handleOnBottom}
      bottomOffset={SEARCH_INFINITE_SCROLL_OFFSET}
      {...rest}
    />
  );
}

SuggestionScrollContainer.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string,
    updatedAt: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired
  })),
  getCardProps: PropTypes.func,
  isSearchingCards: PropTypes.bool,
  onBottom: PropTypes.func.isRequired,
  showPlaceholder: PropTypes.bool,
  footer: PropTypes.element,
  triangleColor: PropTypes.string,
  hasReachedLimit: PropTypes.bool,
  scrollContainerClassName: PropTypes.string,
}

SuggestionScrollContainer.defaultProps = {
  cards: [],
  isSearchingCards: false,
  hasReachedLimit: false,
  showPlaceholder: true,
  triangleColor: 'white',
  scrollContainerClassName: '',
}

export default SuggestionScrollContainer;


