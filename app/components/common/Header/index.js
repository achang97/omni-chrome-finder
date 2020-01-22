import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import FolderIcon from '@material-ui/icons/Folder';
import CloseIcon from '@material-ui/icons/Close';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../../../actions/display';

@connect(
  state => ({
  }),
  dispatch => bindActionCreators({
    toggleDock,
  }, dispatch)
)

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabValue: 0,
    }
  }

  handleTabClick = (event, tabValue) => {
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
    const { toggleDock } = this.props;

    return (
      <div>
        <div className="px-sm pt-sm bg-purple-light">
          <Tabs value={tabValue} onChange={this.handleTabClick}>
            <Tab label="Ask" className="font-bold min-w-0 text-purple-reg pb-sm" />
            <Tab label="Create" className="font-bold min-w-0 text-purple-reg pb-sm" />
            <Tab label="Cards" className="font-bold min-w-0 text-purple-reg pb-sm" />
            <Tab icon={<NotificationsActiveIcon />} className="font-bold min-w-0 text-purple-reg pb-sm" />
          </Tabs>
        </div>
      </div>
    );
  }
}


export default withRouter(Header);
