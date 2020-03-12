import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { EditorState, ContentState } from 'draft-js';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../../../actions/display';
import { updateAskSearchText, updateAskQuestionTitle } from '../../../actions/ask';
import { requestSearchCards, clearSearchCards } from '../../../actions/search';
import { updateCreateAnswerEditor } from '../../../actions/create';
import { updateNavigateSearchText } from '../../../actions/navigate';

import { CHROME_MESSAGE, MAIN_CONTAINER_ID, SEARCH_TYPE } from '../../../utils/constants';

import AISuggestTab from '../AISuggestTab';

@connect(
  state => ({
    dockVisible: state.display.dockVisible,
    dockExpanded: state.display.dockExpanded,
    isLoggedIn: !!state.auth.token,
    numAISuggestCards: state.search.cards[SEARCH_TYPE.AI_SUGGEST].cards.length,
  }),
  dispatch =>
    bindActionCreators(
      {
        toggleDock,
        updateAskSearchText,
        updateAskQuestionTitle,
        updateCreateAnswerEditor,
        updateNavigateSearchText,
        requestSearchCards,
        clearSearchCards 
      },
      dispatch
    )
)

class ChromeMessageListener extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: window.location.href,
    }
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listener);
    window.addEventListener('load', this.handleFirstPageLoad);
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
    window.removeEventListener('load', this.handleFirstPageLoad);

    this.disconnectMutatorObserver();
  }

  disconnectMutatorObserver = () => {
    if (this.observer) {
      // Later, you can stop observing
      this.observer.disconnect();
      this.observer = null;
    }
  }

  createMutator(targetNode, config) {
    // Callback function to execute when mutations are observed
    var callback = (mutations) => {
      this.handleTabUpdate(window.location.href);
    };

    // Create an observer instance linked to the callback function
    this.observer = new MutationObserver(callback);
    this.observer.observe(targetNode, config);
  }

  getGoogleText = () => {
    let text = '';

    const mainTable = document.querySelector('table[role="presentation"]');

    const title = mainTable.querySelector('[tabindex="-1"]').innerText;
    const emailList = mainTable.querySelector('[role="list"]');

    if (!this.observer) {
      // TODO: figure out why this submits twice
      this.createMutator(emailList, { subtree: true, childList: true });
    }

    text += `${title}\n\n`;
    for (let i = 0; i < emailList.children.length; i++) {
      const email = emailList.children[i];

      if (email.getAttribute('role') === 'listitem') {
        let innerText;
        if (i === emailList.children.length - 1) {
          const emailCopy = email.cloneNode(true);
          const removeTables = emailCopy.querySelectorAll('[role="presentation"]');
          removeTables.forEach(table => table.remove());
          innerText = emailCopy.innerText;
        } else {
          innerText = email.innerText;
        }
      
        text += `${innerText.trim()}\n\n`;
      }
    }

    return text;
  }

  getPageText = (url) => {
    let text;

    if (/https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox\/.+/.test(url)) {
      // Case 1: Matches specific email page in Gmail
      text = this.getGoogleText();
    }
    
    return text;
  };

  handleFirstPageLoad = () => {
    this.handleTabUpdate(window.location.href);
  };

  handleTabUpdate = (url) => {
    const { requestSearchCards, clearSearchCards } = this.props;

    if (url !== this.state.url) {
      this.disconnectMutatorObserver();
      this.setState({ url });
    }

    const pageText = this.getPageText(url);
    if (pageText) {
      requestSearchCards(SEARCH_TYPE.AI_SUGGEST, { text: pageText });
    } else {
      clearSearchCards(SEARCH_TYPE.AI_SUGGEST);
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
    const { isLoggedIn, numAISuggestCards } = this.props;

    // TODO: might move this code back to highest level App.js
    if (isLoggedIn && numAISuggestCards !== 0) {
      return <AISuggestTab />;
    }

    return null;
  }
}

export default withRouter(ChromeMessageListener);
