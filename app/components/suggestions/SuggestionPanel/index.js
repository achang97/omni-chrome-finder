import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';
import _ from 'lodash';

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
import { CARD_STATUS, SEARCH_TYPE, INTEGRATIONS, SEARCH_INFINITE_SCROLL_OFFSET, DEBOUNCE_60_HZ } from '../../../utils/constants';

import style from './suggestion-panel.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

import GoogleDriveIcon from '../../../assets/images/icons/GoogleDrive_Icon.svg';
import SlackIcon from '../../../assets/images/icons/Slack_Mark.svg';

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
    };

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
        { isSearchingCards && cards.length !== 0 && <Loader size="sm" className={s('my-sm')} /> }
        <AnimateHeight
          height={showResults ? 'auto' : 0}
          onAnimationEnd={newHeight => newHeight !== 0 && this.externalResults.current.scrollIntoView({ behavior: 'smooth' })}
        >
          {this.renderExternalDocumentationResults() }
        </AnimateHeight>
      </div>
    );
  }

  handleOnBottom = () => {
    const { hasReachedLimit, isSearchingCards, cards } = this.props;
    if (!hasReachedLimit && !isSearchingCards && cards.length !== 0) {
      this.requestSearchCards(false);
    }
  }

  renderExternalSourceResults = ({ integration, results }) => {
    let renderFn;
    switch (integration) {
      case INTEGRATIONS.SLACK: {
        renderFn = ({ text, link, sender, channel }) => (
          <a target="_blank" href={link} key={link}>
            <div key={link} className={s('suggestion-panel-external-result flex-col')}>
              <div className={s('flex justify-between mb-xs')}>
                <div className={s('suggestion-panel-text font-semibold text-purple-reg')}> {channel === 'Personal Message' ? 'Direct Message' : `#${channel}`} </div>
                <div className={s('suggestion-panel-external-result-icon')}>
                  <img src={SlackIcon} />
                </div>
              </div>
              <div className={s('suggestion-panel-text suggestion-panel-sender-name')}> @{sender} </div>
              <div className={s('text-xs vertical-ellipsis-3')}> {text} </div>
            </div>
          </a>
        );
        break;
      }
      case INTEGRATIONS.GOOGLE: {
        renderFn = ({ name, id, webViewLink, iconLink }) => (
          <a target="_blank" href={webViewLink} key={id}>
            <div className={s('suggestion-panel-external-result items-center')}>
              <div className={s('suggestion-panel-text suggestion-panel-link-text')}> {name} </div>
              <div className={s('suggestion-panel-external-result-icon')}>
                <img src={iconLink} />
              </div>
            </div>
          </a>
        );
        break;
      }
    }

    return (
      <div key={integration}>
        { results.map(result => renderFn(result)) }
      </div>
    );
  }

  countExternalResults = () => {
    const { externalResults } = this.props;
    let numExternalResults = 0;
    externalResults.forEach(({ results }) => numExternalResults += results.length);
    return numExternalResults;
  }

  renderExternalDocumentationResults = () => {
    const { externalResults, cards } = this.props;

    const numExternalResults = this.countExternalResults();
    if (numExternalResults === 0) {
      // AnimateHeight expects children prop
      return <div />;
    }

    return (
      <div className={s('flex-col bg-purple-light justify-center items-center')} ref={this.externalResults}>
        { cards.length !== 0 && <div className={s('horizontal-separator my-sm')} /> }
        <div className={s('p-lg')}>
          <div className={s('flex justify-between items-center mb-lg')}>
            <div className={s('text-purple-reg font-semibold')}> Found in your documentation ({numExternalResults}) </div>
            <MdClose className={s('button-hover')} color={colors.purple['gray-50']} onClick={() => this.setState({ showResults: false })} />
          </div>
          { externalResults.map(this.renderExternalSourceResults)}
        </div>
      </div>
    );
  }

  renderFooter = () => {
    const numExternalResults = this.countExternalResults();

    if (numExternalResults === 0) {
      return null;
    }

    return (
      <div className={s('suggestion-panel-footer flex-col bg-white justify-center items-center mt-sm')}>
        <Button
          text={`Show results from your current documentation ${numExternalResults !== 0 ? `(${numExternalResults})` : ''}`}
          underline
          onClick={() => this.setState({ showResults: true })}
          color="transparent"
          className={s('self-stretch rounded-none shadow-none py-lg')}
        />
      </div>
    );
  }

  renderScrollElement = ({ _id, question, answer, createdAt, status }) => (
    <SuggestionCard
      _id={_id}
      question={question}
      answer={answer}
      datePosted={createdAt}
      status={status}
      className={s('mx-sm shadow-md')}
    />
  );

  renderOverflowElement = ({ _id, question, description, answer }, i, positions) => {
    const { overflow, scroll } = positions;

    const overflowTop = overflow.top || 0;
    const scrollTop = scroll.top || 0;

    const triangleMarginTop = Math.max(0, scrollTop - overflowTop);

    return (
      <div className={s('flex')}>
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
          style={{ marginTop: triangleMarginTop }}
          outlineSize={1}
          outlineColor={colors.gray.light}
        />
      </div>
    );
  }

  render() {
    const { isVisible, cards, isSearchingCards } = this.props;
    const { showResults } = this.state;

    const numExternalResults = this.countExternalResults();

    if (!isVisible) {
      return null;
    }

    return (
      <div className={s('suggestion-panel pt-reg w-full flex flex-col rounded-lg bg-purple-light shadow-xl border-gray-200 border border-solid')}>
        <div>
          <div className={s('px-reg text-purple-gray-50 text-sm mb-sm')}>
            {cards.length} card{cards.length !== 1 && 's'}
          </div>
          <ScrollContainer
            scrollContainerClassName={s(`suggestion-panel-card-container ${showResults ? 'suggestion-panel-card-container-lg' : ''} flex flex-col`)}
            list={cards}
            placeholder={isSearchingCards ?
              <Loader size="md" className={s('my-reg')} /> :
              (!showResults || numExternalResults === 0 ?
                <div className={s('text-gray-light text-sm my-reg text-center')}> No results </div> :
                null
              )
            }
            renderScrollElement={this.renderScrollElement}
            renderOverflowElement={this.renderOverflowElement}
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
            className={s('absolute suggestion-panel-arrow')}
            outlineSize={1}
            outlineColor={colors.gray.light}
          />
        </div>
      </div>
    );
  }
}

SuggestionPanel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default SuggestionPanel;
