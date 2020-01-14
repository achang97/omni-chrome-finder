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
import { combineStyles } from '../../utils/style.js'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../../actions/display';

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

    this.handleTabClick = this.handleTabClick.bind(this);
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
    const { toggleDock } = this.props;

    return (
      <div className={combineStyles(globalStyles['padder-md'], globalStyles['primary-background'])}>
        <div className={combineStyles(globalStyles['flex-row'], globalStyles['flex-justify-space-between'])}>
          <div> Your Team Name </div>
          <div onClick={() => toggleDock()}>
            <CloseIcon />
          </div>
        </div>
        <Tabs value={tabValue} onChange={this.handleTabClick}>
          <Tab label="Ask" className={style.tab} />
          <Tab label="Create" className={style.tab}/>
          <Tab icon={<FolderIcon />} className={style.tab} />
          <Tab icon={<NotificationsActiveIcon />} className={style.tab} />
        </Tabs>
      </div>
    );
  }
}


export default withRouter(Header);
