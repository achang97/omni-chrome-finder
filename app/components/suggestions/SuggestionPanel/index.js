import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

import AnimateHeight from 'react-animate-height';
import _ from 'lodash';

import SuggestionScrollContainer from '../SuggestionScrollContainer';
import Loader from '../../common/Loader';
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
import ZendeskIcon from '../../../assets/images/icons/Zendesk_Icon.svg';

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
      showIntegration: {}
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

  toggleIntegration = (integration) => {
    const { showIntegration } = this.state;
    this.setState({
      showIntegration: {
        ...showIntegration,
        [integration]: !showIntegration[integration]
      }
    })
  }

  renderExternalSourceResults = ({ integration, results }) => {
    let icon;
    let renderFn;

    switch (integration) {
      case INTEGRATIONS.SLACK: {
        icon = SlackIcon;
        renderFn = ({ text, link, sender, channel }) => (
          <a target="_blank" href={link} key={link}>
            <div className={s('suggestion-panel-external-result flex-col')}>
              <div className={s('flex justify-between mb-xs')}>
                <div className={s('suggestion-panel-text font-semibold text-purple-reg')}> {channel === 'Personal Message' ? 'Direct Message' : `#${channel}`} </div>
                <div className={s('suggestion-panel-external-result-icon')}>
                  <img src={SlackIcon} />
                </div>
              </div>
              <div className={s('suggestion-panel-text suggestion-panel-sender-name')}> @{sender} </div>
              <div className={s('text-xs line-clamp-3')}> {text} </div>
            </div>
          </a>
        );
        break;
      }
      case INTEGRATIONS.GOOGLE: {
        icon = GoogleDriveIcon;
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
      case INTEGRATIONS.ZENDESK: {
        icon = ZendeskIcon;
        renderFn = ({ id, agentUrl, updated_at, type, subject, description, priority, status }) => (
          <a target="_blank" href={agentUrl} key={id}>
            <div className={s('suggestion-panel-external-result flex-col')}>
              <div className={s('flex justify-between mb-sm')}>
                <div className={s('min-w-0')}>
                  <div className={s('suggestion-panel-text font-semibold text-purple-reg mb-xs')}> {subject} </div>
                  <div className={s('text-xs text-gray-light')}>
                    <span> Priority: <span className={s('italic')}> {priority} </span> </span>
                    <span className={s('ml-sm')}> Status: <span className={s('italic')}> {status} </span> </span>
                  </div>
                </div>
                <div className={s('suggestion-panel-external-result-icon')}>
                  <img src={ZendeskIcon} />
                </div>
              </div>
              <div className={s('text-xs line-clamp-3')}> {description} </div>
            </div>
          </a>
        );
        break;
      }
    }

    const isOpen = this.state.showIntegration[integration];

    return (
      <div key={integration}>
        <div
          className={s('flex items-center justify-between px-lg py-sm mb-xs cursor-pointer rounded-b-lg')}
          onClick={() => this.toggleIntegration(integration)}
        >
          <div className={s('flex items-center text-md text-gray-dark')}>
            <div className={s('w-lg h-lg p-sm mr-sm bg-white shadow-md rounded-full')}>
              <img src={icon} className={s('h-full')} />
            </div>
            <span className={s('font-semibold mr-sm')}> {_.capitalize(integration)} </span>
            <span> ({results.length}) </span>
          </div>
          {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </div>
        <AnimateHeight height={isOpen ? 'auto' : 0}>
          <div className={s('px-lg')}>
            { results.map(result => renderFn(result)) }
          </div>
        </AnimateHeight>
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
        <div className={s('flex justify-between items-center p-lg')}>
          <div className={s('text-purple-reg font-semibold')}> Found in your documentation ({numExternalResults}) </div>
          <MdClose className={s('button-hover')} color={colors.purple['gray-50']} onClick={() => this.setState({ showResults: false })} />
        </div>
        { externalResults.map(this.renderExternalSourceResults)}
      </div>
    );
  }

  renderFooter = () => {
    const numExternalResults =  this.countExternalResults();

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

  render() {
    const { isVisible, cards, isSearchingCards, hasReachedLimit } = this.props;
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
          <SuggestionScrollContainer
            scrollContainerClassName={`suggestion-panel-card-container ${showResults ? 'suggestion-panel-card-container-lg' : ''}`}
            cards={cards}
            isSearchingCards={isSearchingCards}
            showPlaceholder={!showResults || numExternalResults === 0}
            triangleColor={colors.purple.light}
            onBottom={() => this.requestSearchCards(false)}
            hasReachedLimit={hasReachedLimit}
            footer={
              <AnimateHeight
                height={showResults ? 'auto' : 0}
                onAnimationEnd={newHeight => newHeight !== 0 && this.externalResults.current.scrollIntoView({ behavior: 'smooth' })}
              >
                {this.renderExternalDocumentationResults() }
              </AnimateHeight>
            }
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
  query: PropTypes.string.isRequired,
};

export default SuggestionPanel;
