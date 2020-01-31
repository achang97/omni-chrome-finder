import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';

import CardSection from '../CardSection';
import CardUsers from '../CardUsers';
import CardTags from '../CardTags';

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
    const { onClose } = this.props;
    onClose();
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
    const users = [{ name: 'Andrew', id: 1, img: 'https://sunrift.com/wp-content/uploads/2014/12/Blake-profile-photo-square-768x769.jpg' }, { name: 'Chetan', id: 5, img: null }];
    return (
      <CardSection title="Owner(s)">
        <CardUsers
          users={users}
          isEditable={true}
          onAddClick={() => console.log('Added!')}
          onRemoveClick={() => console.log('Removed!')}
        />
      </CardSection>
    );
  }

  renderTags = () => {
    const tags = ['Customer Service Onboarding', 'Sales', 'Pitches'];
    return (
      <CardSection className={s("mt-reg")} title="Tags">
        <CardTags tags={tags} isEditable={true} />
      </CardSection>
    )
  }

  render() {
    const { isVisible } = this.props;
    const { hasBeenToggled } = this.state;

    return (
      <div className={s("overflow-hidden pointer-events-none rounded-b-lg absolute top-0 left-0 right-0 bottom-0 z-10")}>
        { isVisible &&
          <div className={s("card-side-dock-container")} onClick={this.closeSideDock} />
        }
        <div className={s(`card-side-dock ${hasBeenToggled ? (isVisible ? 'card-side-dock-slide-in' : 'card-side-dock-slide-out') : ''}`)}>
          { this.renderHeader() }
          { this.renderOwners() }
          { this.renderTags() }
        </div>
      </div>
    );
  }
}

CardSideDock.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

CardSideDock.defaultProps = {
};

export default CardSideDock;