import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { MdNotificationsActive } from 'react-icons/md';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Tabs from '../../common/Tabs/Tabs';
import Tab from '../../common/Tabs/Tab';
import PlaceholderImg from '../../common/PlaceholderImg';

import { colors } from '../../../styles/colors';
import style from './header.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
    user: state.profile.user,
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
    const { location: { pathname }, user } = this.props;

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
            <PlaceholderImg name={user.firstname + ' ' + user.lastname} src={user.img} className={s('header-profile-picture')} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}


export default withRouter(Header);
