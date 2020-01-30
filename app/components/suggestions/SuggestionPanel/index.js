import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import { FaGoogleDrive } from 'react-icons/fa';

import SuggestionCard from '../SuggestionCard';
import Button from '../../common/Button';
import Triangle from '../../common/Triangle';

import { colors } from '../../../styles/colors';

import style from './suggestion-panel.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const PLACEHOLDER_CARDS = [
  {
    heading: "How do I delete a user?",
    headingDescription: 'This is a test 1!',
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart But stream software offline. Professor install angel sector anywhere create at components smart But stream software offline. Professor install angel sector anywhere create at components smart ",
    datePosted: "2 days ago",
    upToDate: true
  },
  {
    heading: "How do I delete a user?",
    headingDescription: 'This is a test 2!',
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart…",

    datePosted: "2 days ago",
    upToDate: false
  },
  {
    heading: "How do I delete a user?",
    headingDescription: 'This is a test 3! This is a test 3! This is a test 3! This is a test 3! This is a test 3! This is a test 3! This is a test 3! This is a test 3!',
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart…",

    datePosted: "2 days ago",
    upToDate: false
  },
  {
    heading: "How do I delete a user?",
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart…",

    datePosted: "2 days ago",
    upToDate: true
  },
  {
    heading: "How do I delete a user?",
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart…",

    datePosted: "2 days ago",
    upToDate: true
  },
  {
    heading: "How do I delete a user?",
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart…",

    datePosted: "2 days ago",
    upToDate: true
  }
];

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
    const { isVisible } = this.props;
    const { showQuestionInfo, showResults } = this.state;

    if (!isVisible) {
      return null;
    }

    return (
      <div className={s("suggestion-panel pt-reg w-full flex flex-col rounded-lg bg-purple-light shadow-xl border-gray-200 border border-solid")}>
        <div className={s("relative")}>
          <div className={s("px-reg text-purple-gray-50 text-sm")}>
            30 results
          </div>
          <div className={s("relative")}>
            <div className={s(`suggestion-panel-card-container ${showResults ? 'suggestion-panel-card-container-lg' : ''} mt-sm flex flex-col`)}>
              {PLACEHOLDER_CARDS.map((card, index) => (
                <SuggestionCard
                  key={index}
                  heading={card.heading}
                  headingDescription={card.headingDescription}
                  description={card.description}
                  datePosted={card.datePosted}
                  isUpToDate={card.upToDate}
                />
              ))}
              { showResults && this.renderExternalDocumentationResults() }
            </div>
          </div>
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