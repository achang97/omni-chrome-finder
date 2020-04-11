import React, { useState, useRef, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { EditorState, ContentState } from 'draft-js';

import { CHROME, SEARCH, ROUTES, MAIN_CONTAINER_ID, INTEGRATIONS } from 'appConstants';
import { handleNotificationClick } from 'utils/chrome';
import AISuggestTab from '../AISuggestTab';

const URL_REGEXES = [
  {
    integration: INTEGRATIONS.GMAIL.type,
    regex: /https:\/\/mail\.google\.com\/mail\/u\/\d+\/(#\S+)\/.+/
  }
];

const ChromeMessageListener = ({ 
  dockVisible, dockExpanded, isLoggedIn, isVerified, autofindPermissions, tasks, isSearchingCards, history,
  toggleDock, updateAskSearchText, updateAskQuestionTitle, updateCreateAnswerEditor,
  updateNavigateSearchText, requestSearchCards, clearSearchCards, requestGetTasks,
  updateTasksTab, updateTasksOpenSection,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(listener);
    window.addEventListener('load', handlePageLoad);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
      window.removeEventListener('load', handlePageLoad);
      disconnectMutatorObserver();
    };
  }, []);

  useEffect(() => {
    if (hasLoaded && isLoggedIn) {
      if (isAutofindEnabled()) {
        handlePageLoad(true);
      } else {
        clearSearchCards(SEARCH.TYPE.AI_SUGGEST)
      }
    }

    if (!isLoggedIn) {
      clearSearchCards(SEARCH.TYPE.AI_SUGGEST)
    }
  }, [hasLoaded, isLoggedIn, autofindPermissions])

  const isAutofindEnabled = (autofindPermissions) => {
    const permissionsObj = autofindPermissions || autofindPermissions;
    const integration = getIntegration();
    return integration && permissionsObj && permissionsObj[integration];
  }

  const disconnectMutatorObserver = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }

  const createMutator = (targetNode, config) => {
    const callback = (mutations) => {
      handleTabUpdate(false);
    };

    // Create an observer instance linked to the callback function
    observerRef.current = new MutationObserver(callback);
    observerRef.current.observe(targetNode, config);
  }

  const getGoogleText = () => {
    let text = '';

    if (document) {
      const mainTable = document.querySelector('div[role="main"] table[role="presentation"]');

      const titleDiv = mainTable.querySelector('[tabindex="-1"]');
      if (titleDiv) {
        text += `${titleDiv.innerText}\n\n`;
      }

      const emailList = mainTable.querySelector('[role="list"]');
      if (emailList) {
        if (!observerRef.current) {
          createMutator(emailList, { subtree: true, childList: true });
        }

        for (let i = 0; i < emailList.children.length; i++) {
          const email = emailList.children[i];
          if (email.getAttribute('role') === 'listitem') {
            let innerText;
            if (i === emailList.children.length - 1) {
              const emailCopy = email.cloneNode(true);
              const removeTables = emailCopy.querySelectorAll('table');
              removeTables.forEach(table => table.remove());

              const removeSignature = emailCopy.querySelector('[data-smartmail="gmail_signature"]');
              if (removeSignature) {
                removeSignature.remove();
              }

              innerText = emailCopy.innerText;
            } else {
              innerText = email.innerText;
            }
          
            text += `${innerText.trim()}\n\n`;
          }
        }
      }
    }

    return text;
  }

  const getIntegration = () => {
    const urlRegex = URL_REGEXES.find(({ regex }) => regex.test(window.location.href));
    
    if (urlRegex) {
      return urlRegex.integration;
    } else {
      return null;
    }
  }

  const getPageText = (integration) => {
    switch (integration) {
      case INTEGRATIONS.GMAIL.type: {
        return getGoogleText();
      }
    }
    
    return '';
  };

  const handlePageLoad = () => {
    handleTabUpdate(true);

    if (!hasLoaded) {
      setHasLoaded(true);
    }
  };

  const handleTabUpdate = (isNewPage) => {
    const integration = getIntegration();
    if (isLoggedIn && isVerified && autofindPermissions[integration]) {
      if (isNewPage) {
        disconnectMutatorObserver();
      }

      const pageText = getPageText(integration);
      if (pageText && pageText !== '') {
        console.log(pageText)
        if (!isSearchingCards) {
          requestSearchCards(SEARCH.TYPE.AI_SUGGEST, { text: pageText });
        }
      } else if (isNewPage) {
        clearSearchCards(SEARCH.TYPE.AI_SUGGEST);
      }
    }
  };

  const handleContextMenuAction = (action, selectedText) => {
    if (!dockVisible) {
      // Open dock
      toggleDock();
    }

    if (isLoggedIn && isVerified) {
      let url;
      switch (action) {
        case CHROME.MESSAGE.ASK: {
          url = ROUTES.ASK;
          if (dockExpanded) {
            updateAskQuestionTitle(selectedText);
          } else {
            updateAskSearchText(selectedText);
          }
          break;
        }
        case CHROME.MESSAGE.CREATE: {
          url = ROUTES.CREATE;
          updateCreateAnswerEditor(EditorState.createWithContent(ContentState.createFromText(selectedText)));
          break;
        }
        case CHROME.MESSAGE.SEARCH: {
          url = ROUTES.NAVIGATE;
          updateNavigateSearchText(selectedText);
          break;
        }
      }

      history.push(url);
    }
  }

  const handleNotificationOpened = (notificationId) => {
    if (!dockVisible) {
      toggleDock();
    }

    if (isLoggedIn && isVerified) {
      const { location: { pathname } } = history;
      if (location === ROUTES.TASKS) {
        requestGetTasks();
      }

      handleNotificationClick(notificationId, tasks, updateTasksTab, updateTasksOpenSection, history);
    }
  }

  const listener = (msg) => {
    const { type, payload } = msg;
    switch (msg.type) {
      case CHROME.MESSAGE.TOGGLE: {
        toggleDock();
        break;
      }
      case CHROME.MESSAGE.TAB_UPDATE: {
        handleTabUpdate(true);
        break;
      }
      case CHROME.MESSAGE.SEARCH:
      case CHROME.MESSAGE.ASK:
      case CHROME.MESSAGE.CREATE: {
        handleContextMenuAction(type, payload.selectionText);
        break;
      }
      case CHROME.MESSAGE.NOTIFICATION_OPENED: {
        handleNotificationOpened(payload.notificationId);
        break;
      }
    }
  };

  const render = () => {
    if (!isAutofindEnabled()) {
      return null;
    }

    return <AISuggestTab />;
  }

  return render();
}

export default ChromeMessageListener;