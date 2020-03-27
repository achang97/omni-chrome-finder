import React, { PropTypes, Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router';
import { MdNotificationsActive, MdLightbulbOutline  } from 'react-icons/md';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Tabs from '../../common/Tabs/Tabs';
import Tab from '../../common/Tabs/Tab';
import Badge from '../../common/Badge';
import PlaceholderImg from '../../common/PlaceholderImg';

import { SEARCH_TYPE } from '../../../utils/constants';

import { colors } from '../../../styles/colors';
import style from './header.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

class Header extends Component {
  constructor(props) {
    super(props);
  }

  handleTabClick = (activeLink) => {
    this.props.history.push(activeLink);
  }

  render() {
    const { location: { pathname }, user, numSuggestCards, numAISuggestCards, numTasks } = this.props;

    const showAISuggest = numAISuggestCards !== 0;

    return (
      <div className={s('px-sm bg-purple-xlight')}>
        <Tabs
          onTabClick={this.handleTabClick}
          activeValue={pathname}
          tabClassName={s('text-md py-xl px-0 font-semibold flex items-center')}
          tabContainerClassName={s('flex align-center')}
          color={colors.purple.reg}
          showRipple={false}
        >
          <Tab label="Ask" key="ask" value="/ask" tabContainerClassName={s("mx-reg")} />
          <Tab label="Create" key="create" value="/create" tabContainerClassName={s("mx-reg")} />
          <Tab label="Cards" key="cards" value="/navigate" tabContainerClassName={s("mx-reg")} />
          { showAISuggest &&
            <Tab key="suggest" value="/suggest" tabContainerClassName={s('header-small-tab ml-auto')}>
              <div className={s("header-badge-container gold-gradient")}>
                <MdLightbulbOutline className={s("text-gold-reg")} />
                <Badge count={numAISuggestCards} size="sm" className={s("bg-gold-reg")}  />
              </div>
            </Tab>
          }
          <Tab key="tasks" value="/tasks" tabContainerClassName={s(`header-small-tab ${!showAISuggest ?'ml-auto' : ''}`)}>
            <div className={s("header-badge-container bg-gray-xlight")}>
              <MdNotificationsActive />
              <Badge count={numTasks} size="sm" className={s("bg-red-500")}  />
            </div>
          </Tab>
          <Tab key="profile" value="/profile" tabContainerClassName={s("mx-reg")}>
            <PlaceholderImg name={`${user.firstname} ${user.lastname}`} src={user.img} className={s('header-profile-picture')} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}


export default connect(
  state => ({
    user: state.profile.user,
    numAISuggestCards: state.search.cards[SEARCH_TYPE.AI_SUGGEST].cards.length,
    numTasks: state.tasks.tasks.filter(({ resolved }) => !resolved).length,
  }),
  dispatch => bindActionCreators({
  }, dispatch)
)(withRouter(Header));
