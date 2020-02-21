import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import { FaGoogleDrive } from 'react-icons/fa';

import ScrollContainer from '../../common/ScrollContainer';
import Loader from '../../common/Loader';
import SuggestionCard from '../SuggestionCard';
import SuggestionPreview from '../SuggestionPreview';
import Button from '../../common/Button';
import Triangle from '../../common/Triangle';

import { colors } from '../../../styles/colors';
import { CARD_STATUS } from '../../../utils/constants';

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

class SuggestionPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showResults: false
    }
  }

  renderFooter = () => {
    return (
      <div className={s("suggestion-panel-footer footer flex-col bg-white justify-center items-center mt-sm")}>
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

  renderExternalDocumentationResults = () => {
    return (
      <div className={s("footer flex-col bg-purple-light justify-center items-center mt-sm")} ref={externalResults => this.externalResults = externalResults}>
        <div className={s("horizontal-separator")} />
        {PLACEHOLDER_RESULTS.map(({ source, Icon, results }) => (
          <div className={s("p-lg my-sm")}>
            <div className={s("flex justify-between items-center mb-lg")}>
              <div className={s("text-purple-reg font-semibold")}> Found in your {source} </div>
              <MdClose color={colors.purple['gray-50']} onClick={() => this.setState({ showResults: false })} />
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

  render() {
    const { isVisible, cards, isLoading } = this.props;
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
          { cards.length === 0 && (isLoading ?
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
              footer={showResults ? this.renderExternalDocumentationResults() : null}
              position="left"
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
  cards: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
}

SuggestionPanel.defaultProps = {
  isLoading: false,
}

export default SuggestionPanel;