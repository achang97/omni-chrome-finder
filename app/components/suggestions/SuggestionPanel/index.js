import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';
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
import { CARD_STATUS, SEARCH_TYPE, DOCUMENTATION_TYPE, SEARCH_INFINITE_SCROLL_OFFSET, DEBOUNCE_60_HZ } from '../../../utils/constants';

import style from './suggestion-panel.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

import GoogleDriveIcon from '../../../assets/images/icons/GoogleDrive_Icon.svg';

const DOCUMENTATION_DISPLAY_INFO = {
  [DOCUMENTATION_TYPE.GOOGLE_DRIVE]: {
    icon: GoogleDriveIcon,
    baseUrl: '',
  }
}

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

    this.externalResults = React.createRef();
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
    const { isSearchingCards, cards } = this.props;
    const { showResults } = this.state;

    return (
      <div>
        { isSearchingCards && cards.length !== 0 && <Loader size="sm" className={s("my-sm")} /> }
        <AnimateHeight
          height={showResults ? 'auto' : 0}
          onAnimationEnd={newHeight => newHeight !== 0 && this.externalResults.current.scrollIntoView({ behavior: "smooth" })}
        >
          {this.renderExternalDocumentationResults() }
        </AnimateHeight>
      </div>
    )
  }

  handleOnBottom = () => {
    const { hasReachedLimit, isSearchingCards, cards } = this.props;
    if (!hasReachedLimit && !isSearchingCards && cards.length !== 0) {
      this.requestSearchCards(false);
    }
  }

  renderExternalSourceResults = ({ source, results }) => {
    const { baseUrl, icon } = DOCUMENTATION_DISPLAY_INFO[source];
    return (
      <div className={s("my-sm")} key={source}>
        { results.map(({ name, id }) => (
          <div key={id} className={s("suggestion-panel-external-result flex justify-between items-center shadow-sm rounded-lg p-lg mb-sm")}>
            <div className={s("suggestion-panel-external-result-text text-blue-600 text-sm")}> {name} </div>
            <div className={s("bg-white rounded-full w-2xl h-2xl flex items-center justify-center")}>
              <img src={icon} className={s("w-10/12 h-10/12")} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderExternalDocumentationResults = () => {
    const { externalResults } = this.props;

    return (
      <div className={s("footer flex-col bg-purple-light justify-center items-center mt-sm")} ref={this.externalResults}>
        <div className={s("horizontal-separator")} />
        <div className={s("p-lg")}>
          <div className={s("flex justify-between items-center mb-lg")}>
            <div className={s("text-purple-reg font-semibold")}> Found in your documentation </div>
            <MdClose className={s("button-hover")} color={colors.purple['gray-50']} onClick={() => this.setState({ showResults: false })} />
          </div>
          { externalResults.map(this.renderExternalSourceResults)}
        </div>
      </div>
    );
  }

  renderFooter = () => {
    const { externalResults } = this.props;

    let numExternalResults = 0;
    externalResults.forEach(({ results }) => numExternalResults += results.length);

    return (
      <div className={s("suggestion-panel-footer flex-col bg-white justify-center items-center mt-sm")}>
        <Button
          text={`Show results from your current documentation ${numExternalResults !== 0 && `(${numExternalResults})`}`}
          underline={true}
          onClick={() => this.setState({ showResults: true })}
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
          { cards.length === 0 && 
            <div className={s("my-reg")}>
              { isSearchingCards ?
                <Loader size="md" /> :
                <div className={s("text-gray-light text-sm text-center")}> No results </div>
              }
            </div>
          }
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