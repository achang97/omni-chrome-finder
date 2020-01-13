import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import style from './header.css';
import globalStyles from '../../styles/global.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FolderIcon from '@material-ui/icons/Folder';
import CloseIcon from '@material-ui/icons/Close';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { withRouter } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabValue: 0,
    }

    this.handleTabClick = this.handleTabClick.bind(this);
  }

  close() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, "toggle");
    })
  }

  handleTabClick(event, tabValue) {
    this.setState({ tabValue });

    let path;
    switch (tabValue) {
      case 0:
        path = '/ask';
        break;
      case 1:
        path = '/create';
        break;
      case 2:
        path = '/navigate';
        break;
      case 3:
        path = '/tasks';
        break;
      default:
        return
    }

    this.props.history.push(path);
  }

  render() {
    const { tabValue } = this.state;

    return (
      <div className={`${globalStyles['padder-md']} ${globalStyles['primary-background']}`}>
        <div className={`${globalStyles['flex-row']} ${globalStyles['flex-justify-space-between']}`}>
          <div> Your Team Name </div>
          <button onClick={() => this.close()}>
            <CloseIcon />
          </button>
        </div>
        <Tabs value={tabValue} onChange={this.handleTabClick} variant="fullWidth">
          <Tab label="Ask" />
          <Tab label="Create" />
          <Tab icon={<FolderIcon />} />
          <Tab icon={<NotificationsActiveIcon />} />
        </Tabs>
      </div>
    );
  }
}


export default withRouter(Header);
