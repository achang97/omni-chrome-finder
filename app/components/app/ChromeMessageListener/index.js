import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { EditorState, ContentState } from 'draft-js';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../../../actions/display';
import { updateAskSearchText, updateAskQuestionTitle } from '../../../actions/ask';
import { updateCreateAnswerEditor } from '../../../actions/create';
import { updateNavigateSearchText } from '../../../actions/navigate';

import { CHROME_MESSAGE, MAIN_CONTAINER_ID } from '../../../utils/constants';

import AISuggestTab from '../AISuggestTab';

@connect(
  state => ({
    dockVisible: state.display.dockVisible,
    dockExpanded: state.display.dockExpanded,
    isLoggedIn: !!state.auth.token,
  }),
  dispatch =>
    bindActionCreators(
      {
        toggleDock,
        updateAskSearchText,
        updateAskQuestionTitle,
        updateCreateAnswerEditor,
        updateNavigateSearchText,
      },
      dispatch
    )
)

class ChromeMessageListener extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestTabVisible: false
    };
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listener);
    window.addEventListener('load', this.handleFirstPageLoad);
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
    window.removeEventListener('load', this.handleFirstPageLoad);
  }

  getPageText = () => {
    // TODO: Basic version that is website agnostic, simply removes chrome extension code, scripts,
    // and styles from DOM and gets inner text. Future version should look at specific divs (ie. title
    // and content of email for Gmail).
    const docCopy = document.cloneNode(true);
    const omniExt = docCopy.getElementById(MAIN_CONTAINER_ID);
    omniExt.remove();
    const removeSelectors = ['script', 'noscript', 'style'];
    removeSelectors.forEach((selector) => {
      const elements = docCopy.querySelectorAll(`body ${selector}`);
      for (const elem of elements) {
        elem.remove();
      }
    });
    return docCopy.body.innerText;
  };

  handleFirstPageLoad = () => {
    this.handleTabUpdate(window.location.href);
  };

  handleTabUpdate = (url) => {
    // Placeholder code for AI Suggest, code should be written in another file eventually
    // Case 1: Matches specific email page in Gmail
    if (/https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox\/.+/.test(url)) {
      // TODO: send out search request with this captured text
      this.setState({ suggestTabVisible: true });
      const text = this.getPageText();
    } else {
      this.setState({ suggestTabVisible: false });
    }
  };

  handleContextMenuAction = (action, selectedText) => {
    const {
      isLoggedIn, dockVisible, dockExpanded, toggleDock, history,
      updateAskSearchText, updateAskQuestionTitle,
      updateCreateAnswerEditor,
      updateNavigateSearchText,
    } = this.props;

    if (!dockVisible) {
      toggleDock();
    }

    if (isLoggedIn) {
      // Open dock
      let url;
      switch (action) {
        case CHROME_MESSAGE.ASK: {
          url = '/ask';

          if (dockExpanded) {
            updateAskQuestionTitle(selectedText);
          } else {
            updateAskSearchText(selectedText);
          }
          break;
        }
        case CHROME_MESSAGE.CREATE: {
          url = '/create';
          updateCreateAnswerEditor(EditorState.createWithContent(ContentState.createFromText(selectedText)));
          break;
        }        
        case CHROME_MESSAGE.SEARCH: {
          url = '/navigate';
          updateNavigateSearchText(selectedText);
          break;
        }
      }

      history.push(url);
    }
  }

  listener = (msg) => {
    const { type, payload } = msg;
    switch (msg.type) {
      case CHROME_MESSAGE.TOGGLE: {
        this.props.toggleDock();
        break;
      }
      case CHROME_MESSAGE.TAB_UPDATE: {
        const { url } = payload;
        this.handleTabUpdate(url);
        break;
      }
      case CHROME_MESSAGE.SEARCH:
      case CHROME_MESSAGE.ASK:
      case CHROME_MESSAGE.CREATE: {
        this.handleContextMenuAction(type, payload.selectionText);
        break;
      }
    }
  };

  render() {
    const { suggestTabVisible } = this.state;
    const { isLoggedIn } = this.props;
    
    // TODO: might move this code back to highest level App.js
    if (isLoggedIn && suggestTabVisible) {
      return <AISuggestTab />;
    }

    return null;
  }
}

export default withRouter(ChromeMessageListener);