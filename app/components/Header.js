import React, { PropTypes, Component } from 'react';
import TodoTextInput from './TodoTextInput';

export default class Header extends Component {

  static propTypes = {
    addTodo: PropTypes.func.isRequired
  };

  handleSave = (text) => {
    if (text.length !== 0) {
      this.props.addTodo(text);
    }
  };

  close() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,"toggle");
    })
  }

  render() {
    return (
      <div>
        <button onClick={() => this.close()}> X </button>
        <h1>todos1</h1>
        <TodoTextInput
          newTodo
          onSave={this.handleSave}
          placeholder="What needs to be done?"
        />
      </div>
    );
  }
}
