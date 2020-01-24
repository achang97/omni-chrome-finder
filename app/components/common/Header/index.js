import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { MdNotificationsActive } from "react-icons/md";
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../../../actions/display';

import Tabs from '../Tabs/Tabs';
import Tab from '../Tabs/Tab';

import { colors } from '../../../styles/colors';
import style from './header.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const PROFILE_PICTURE_URL = 'https://janecanblogdotcom.files.wordpress.com/2014/09/ashley-square-profile.jpg';

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
      activeIndex: 0,
    }
  }

  handleTabClick = (activeIndex) => {
    this.setState({ activeIndex });

    let path;
    switch (activeIndex) {
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
      case 4:
        path = '/profile';
        break;
      default:
        return
    }

    this.props.history.push(path);
  }

  render() {
    const { activeIndex } = this.state;
    const { toggleDock } = this.props;

    return (
      <div className={s("px-sm bg-purple-light")}>
        <Tabs
          onTabClick={this.handleTabClick}
          activeIndex={activeIndex}
          tabClassName={s("text-reg py-lg font-semibold")}
          color={colors.purple.reg}
        >
          <Tab label="Ask" key="ask" />
          <Tab label="Create" key="create" />
          <Tab label="Cards" key="cards" />
          <Tab label={<MdNotificationsActive />} key="tasks" tabContainerClassName={s("ml-auto")} />
          <Tab key="profile">
            <img src={PROFILE_PICTURE_URL} className={s("header-profile-picture rounded-full")} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}


export default withRouter(Header);
