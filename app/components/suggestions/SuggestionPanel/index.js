import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import { FaGoogleDrive } from 'react-icons/fa';
import _ from 'underscore';

import ScrollContainer from '../../common/ScrollContainer';
import Loader from '../../common/Loader';
import SuggestionCard from '../SuggestionCard';
import SuggestionPreview from '../SuggestionPreview';
import Button from '../../common/Button';
import Triangle from '../../common/Triangle';

import { requestSearchCards } from '../../../actions/search';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { colors } from '../../../styles/colors';
import { CARD_STATUS, SEARCH_TYPE, SEARCH_INFINITE_SCROLL_OFFSET, DEBOUNCE_60_HZ } from '../../../utils/constants';

import style from './suggestion-panel.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const PLACEHOLDER_RESULTS = [
  {
    source: 'Google Drive',
    Icon: FaGoogleDrive,
    results: [
      {
        title: 'How To\'s',
      },
      {
        title: 'Keys to Phone Support',
      },
      {
        title: 'Onboarding',
      }
    ]
  }
]

@connect(
  state => ({
    ...state.search.cards[SEARCH_TYPE.POPOUT],
  }),
  dispatch =>
  bindActionCreators(
    {
      requestSearchCards,
    },
    dispatch
  )
)

class SuggestionPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showResults: false,
    }
  }

  componentDidMount() {
    if (this.props.query !== '') {
      this.requestSearchCards(true);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.debouncedRequestSearch();
    }
  }

  requestSearchCards = (clearCards) => {
    this.props.requestSearchCards(SEARCH_TYPE.POPOUT, { q: this.props.query }, clearCards);
  }

  debouncedRequestSearch = _.debounce(() => {
    const { hasSearched } = this.state;
    this.requestSearchCards(true);
  }, DEBOUNCE_60_HZ)

  renderScrollFooter = () => {
    const { isSearchingCards, showResults } = this.props;
    return (
      <div>
        { isSearchingCards && <Loader size="sm" className={s("my-sm")} /> }
        { showResults && this.renderExternalDocumentationResults() }
      </div>
    )
  }

  handleOnBottom = () => {
    const { hasReachedLimit, isSearchingCards } = this.props;
    if (!hasReachedLimit && !isSearchingCards) {
      this.requestSearchCards(false);
    }
  }

  renderExternalDocumentationResults = () => {
    return (
      <div className={s("footer flex-col bg-purple-light justify-center items-center mt-sm")} ref={externalResults => this.externalResults = externalResults}>
        <div className={s("horizontal-separator")} />
        {PLACEHOLDER_RESULTS.map(({ source, Icon, results }) => (
          <div className={s("p-lg my-sm")}>
            <div className={s("flex justify-between items-center mb-lg")}>
              <div className={s("text-purple-reg font-semibold")}> Found in your {source} </div>
              <MdClose className={s("button-hover")} color={colors.purple['gray-50']} onClick={() => this.setState({ showResults: false })} />
            </div>
            { results.map(({ title }) => (
              <div className={s("suggestion-panel-external-result flex justify-between items-center shadow-sm rounded-lg p-lg mb-sm")}>
                <div className={s("suggestion-panel-external-result-text text-blue-600 text-sm")}> {title} </div>
                <div className={s("bg-white rounded-full w-2xl h-2xl flex items-center justify-center")}>
                  <Icon />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  renderFooter = () => {
    return (
      <div className={s("suggestion-panel-footer flex-col bg-white justify-center items-center mt-sm")}>
        <Button
          text="Show results from your current documentation"
          underline={true}
          onClick={() => this.setState({ showResults: true }, () => this.externalResults.scrollIntoView({ behavior: "smooth" }))}
          color="transparent"
          className={s("self-stretch rounded-none shadow-none py-lg")}
        />
      </div>
    );
  }

  render() {
    const { isVisible, cards, isSearchingCards } = this.props;
    const { showResults } = this.state;

    if (!isVisible) {
      return null;
    }

    return (
      <div className={s("suggestion-panel pt-reg w-full flex flex-col rounded-lg bg-purple-light shadow-xl border-gray-200 border border-solid")}>
        <div>
          <div className={s("px-reg text-purple-gray-50 text-sm mb-sm")}>
            {cards.length} result{cards.length !== 1 && 's'}
          </div>
          { cards.length === 0 && (isSearchingCards ?
            <Loader size="md" /> :
            <div className={s("text-gray-light text-sm text-center")}> No results </div>
          )}
          { cards.length !== 0 &&
            <ScrollContainer
              scrollContainerClassName={s(`suggestion-panel-card-container ${showResults ? 'suggestion-panel-card-container-lg' : ''} flex flex-col`)}
              list={cards}
              renderScrollElement={({ _id, question, answer, createdAt, status }) => (
                <SuggestionCard
                  _id={_id}
                  question={question}
                  answer={answer}
                  datePosted={createdAt}
                  cardStatus={status}
                  className={s("mx-sm")}
                />
              )}
              renderOverflowElement={({ _id, question, description, answer }) => (
                <div className={s("flex")}>
                  <SuggestionPreview
                    _id={_id}
                    question={question}
                    questionDescription={description}
                    answer={answer}
                  />
                  <Triangle
                    size={10}
                    color={colors.purple.light}
                    direction="left"
                    className={s("mt-sm")}
                    outlineSize={1}
                    outlineColor={colors.gray.light}
                  />
                </div>
              )}
              position="left"
              onBottom={this.handleOnBottom}
              bottomOffset={SEARCH_INFINITE_SCROLL_OFFSET}
              footer={this.renderScrollFooter()}
            />
          }
          { !showResults && this.renderFooter() }
          <Triangle
            size={10}
            color="white"
            direction="left"
            className={s("absolute suggestion-panel-arrow")}
            outlineSize={1}
            outlineColor={colors.gray.light}
          />
        </div>
      </div>
    )
  }
}

SuggestionPanel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
}

export default SuggestionPanel;