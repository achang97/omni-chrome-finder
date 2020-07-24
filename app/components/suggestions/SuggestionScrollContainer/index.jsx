import React from 'react';
import PropTypes from 'prop-types';

import { Loader, Triangle, ScrollContainer } from 'components/common';
import { colors } from 'styles/colors';
import { isSlackCard } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';
import { NodePropTypes } from 'utils/propTypes';
import { FINDER, SEGMENT, AUDIT } from 'appConstants';

import SuggestionCard from '../SuggestionCard';
import SuggestionNode from '../SuggestionNode';
import SuggestionPreview from '../SuggestionPreview';

import style from './suggestion-scroll-container.css';

const s = getStyleApplicationFn(style);

const SEARCH_INFINITE_SCROLL_OFFSET = 150;

const SuggestionScrollContainer = ({
  cards,
  nodes,
  searchLogId,
  source,
  getCardProps,
  isSearching,
  hasReachedLimit,
  onBottom,
  showPlaceholder,
  footer,
  scrollContainerClassName,
  className,
  triangleColor
}) => {
  const combinedList = [...nodes, ...cards];

  const renderPlaceholder = () => {
    if (isSearching) {
      return <Loader size="md" className={s('my-reg')} />;
    }
    if (showPlaceholder) {
      return <div className={s('text-gray-light text-sm my-reg text-center')}> No results </div>;
    }
    return null;
  };

  const renderScrollElement = (elem, i) => {
    if (elem.type === FINDER.NODE_TYPE.FOLDER) {
      const { _id, name, path } = elem;
      return (
        <SuggestionNode
          id={_id}
          name={name}
          className={s('suggestion-scroll-container-card')}
          path={path}
          event={SEGMENT.EVENT.OPEN_FOLDER_FROM_SEARCH}
          searchLogId={searchLogId}
          source={source}
        />
      );
    }

    const { _id, question, answer, status, externalLinkAnswer, finderNode, highlight } = elem;
    const { className: cardClassName = '', ...restCardProps } = getCardProps
      ? getCardProps(elem, i)
      : {};

    return (
      <SuggestionCard
        id={_id}
        question={question}
        event={SEGMENT.EVENT.OPEN_CARD_FROM_SEARCH}
        answer={answer}
        createdFromSlack={isSlackCard(elem)}
        externalLinkAnswer={externalLinkAnswer}
        searchLogId={searchLogId}
        source={source}
        status={status}
        highlight={highlight}
        className={s(`suggestion-scroll-container-card ${cardClassName}`)}
        finderNode={finderNode}
        {...restCardProps}
      />
    );
  };

  const renderOverflowElement = (elem, i, positions) => {
    if (elem.type === FINDER.NODE_TYPE.FOLDER) {
      return null;
    }

    const { _id, question, description, answer, externalLinkAnswer } = elem;
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
          externalLinkAnswer={externalLinkAnswer}
          searchLogId={searchLogId}
          source={source}
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
        {isSearching && combinedList.length !== 0 && <Loader size="sm" className={s('my-sm')} />}
        {footer}
      </>
    );
  };

  const handleOnBottom = () => {
    if (!hasReachedLimit && !isSearching && combinedList.length !== 0) {
      onBottom();
    }
  };

  return (
    <ScrollContainer
      className={className}
      scrollContainerClassName={s(`suggestion-scroll-container ${scrollContainerClassName}`)}
      list={combinedList}
      getKey={(elem) => elem._id}
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
  nodes: PropTypes.arrayOf(NodePropTypes),
  searchLogId: PropTypes.string,
  source: PropTypes.oneOf(Object.values(AUDIT.SOURCE)),
  getCardProps: PropTypes.func,
  isSearching: PropTypes.bool,
  onBottom: PropTypes.func.isRequired,
  showPlaceholder: PropTypes.bool,
  footer: PropTypes.node,
  triangleColor: PropTypes.string,
  hasReachedLimit: PropTypes.bool.isRequired,
  scrollContainerClassName: PropTypes.string,
  className: PropTypes.string
};

SuggestionScrollContainer.defaultProps = {
  nodes: [],
  isSearching: false,
  showPlaceholder: true,
  triangleColor: 'white',
  footer: null,
  getCardProps: null,
  scrollContainerClassName: '',
  className: ''
};

export default SuggestionScrollContainer;
