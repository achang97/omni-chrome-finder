import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { MdNotificationsActive } from "react-icons/md";
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../../../actions/display';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const TABS = [
  "Ask",
  "Create",
  "Cards",
  <MdNotificationsActive />,
];

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

  handleTabClick = (tabValue) => {
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
        <div className={s("px-sm pt-sm bg-purple-light")}>
          <div>
            { TABS.map((tab, i) => (
              <button
                className={s("font-bold min-w-0 text-purple-reg pb-sm")}
                onClick={() => this.handleTabClick(i)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}


export default withRouter(Header);
