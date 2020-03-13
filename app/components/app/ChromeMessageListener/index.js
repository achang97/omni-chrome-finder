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
    const callback = (mutations) => {
      this.handleTabUpdate(false);
    };

    // Create an observer instance linked to the callback function
    this.observer = new MutationObserver(callback);
    this.observer.observe(targetNode, config);
  }

  getGoogleText = () => {
    let text = '';

    const mainTable = document.querySelector('div[role="main"] table[role="presentation"]');

    const titleDiv = mainTable.querySelector('[tabindex="-1"]');
    if (titleDiv) {
      text += `${titleDiv.innerText}\n\n`;
    }

    const emailList = mainTable.querySelector('[role="list"]');
    if (emailList) {
      if (!this.observer) {
        this.createMutator(emailList, { subtree: true, childList: true });
      }

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
    this.handleTabUpdate(true);
  };

  handleTabUpdate = (isNewPage) => {
    const { isLoggedIn, requestSearchCards, clearSearchCards } = this.props;

    if (isLoggedIn) {
      const url = window.location.href;
      if (isNewPage) {
        this.disconnectMutatorObserver();
      }

      const pageText = this.getPageText(url);
      if (pageText && pageText !== '') {
        requestSearchCards(SEARCH_TYPE.AI_SUGGEST, { text: pageText });
      } else if (isNewPage) {
        clearSearchCards(SEARCH_TYPE.AI_SUGGEST);
      }
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
        this.handleTabUpdate(true);
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
    return <AISuggestTab />;
  }
}

export default withRouter(ChromeMessageListener);
