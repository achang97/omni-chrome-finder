import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { MdNotificationsActive } from 'react-icons/md';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
  }, dispatch)
)

class Header extends Component {
  constructor(props) {
    super(props);
  }

  handleTabClick = (activeLink) => {
    this.props.history.push(activeLink);
  }

  render() {
    const { location: { pathname } } = this.props;

    return (
      <div className={s('px-sm bg-purple-xlight')}>
        <Tabs
          onTabClick={this.handleTabClick}
          activeValue={pathname}
          tabClassName={s('text-reg p-xl px-0 font-semibold flex items-center')}
          tabContainerClassName={s('mx-reg flex align-center')}
          color={colors.purple.reg}
          showRipple={false}
        >
          <Tab label="Ask" key="ask" value="/ask" />
          <Tab label="Create" key="create" value="/create" />
          <Tab label="Cards" key="cards" value="/navigate" />
          <Tab label={<MdNotificationsActive />} key="tasks" value="/tasks" tabContainerClassName={s('ml-auto')} />
          <Tab key="profile" value="/profile" >
            <img src={PROFILE_PICTURE_URL} className={s('header-profile-picture rounded-full')} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}


export default withRouter(Header);
