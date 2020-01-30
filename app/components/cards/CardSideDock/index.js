import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';

import CardSection from '../CardSection';
import CardUsers from '../CardUsers';

import style from './card-side-dock.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

class CardSideDock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasBeenToggled: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible && !this.state.hasBeenToggled) {
      this.setState({ hasBeenToggled: true });
    }
  }

  closeSideDock = () => {
    const { onVisibleChange } = this.props;
    onVisibleChange(false);
  }

  renderHeader = () => (
    <div className={s("flex justify-between text-purple-gray-50 mb-sm")}>
      <div className={s("text-xs")}> Card Information </div>
      <button onClick={this.closeSideDock}>
        <MdClose />
      </button>
    </div>
  );

  renderOwners = () => {
    const users = [{ name: 'Andrew', img: 'https://sunrift.com/wp-content/uploads/2014/12/Blake-profile-photo-square-768x769.jpg' }, { name: 'Chetan', img: null }, { name: 'Akshayasdfdasfasdfd', img: null }, { name: 'Akshayasdfdasfasdfd', img: null }, { name: 'Akshayasdfdasfasdfd', img: null }, { name: 'Akshayasdfdasfasdfd', img: null }];
    return (
      <CardSection title="Owner(s)">
        <CardUsers users={users} />
      </CardSection>
    );
  }

  render() {
    const { isVisible, onVisibleChange } = this.props;
    const { hasBeenToggled } = this.state;

    return (
      <div className={s("overflow-hidden pointer-events-none rounded-b-lg absolute top-0 left-0 right-0 bottom-0 z-10")}>
        { isVisible &&
          <div className={s("card-side-dock-container")} onClick={this.closeSideDock} />
        }
        <div className={s(`card-side-dock ${hasBeenToggled ? (isVisible ? 'card-side-dock-slide-in' : 'card-side-dock-slide-out') : ''}`)}>
          { this.renderHeader() }
          { this.renderOwners() }

        </div>
      </div>
    );
  }
}

CardSideDock.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

CardSideDock.defaultProps = {
};

export default CardSideDock;