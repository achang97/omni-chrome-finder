import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';

import { colors } from '../../../styles/colors';
import style from './profile-integration.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);


class ProfileIntegration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
  }

  

  render() {
    const { title, logo, isSignedIn, onSignIn, onSignOut, index } = this.props;
    const { dropdownOpen } = this.state;

    return (
      <div key={title} className={s(`flex bg-white p-reg justify-between border border-solid border-gray-xlight items-center rounded-lg ${index > 0 ? 'mt-sm' : ''}`)}>
        <div className={s('flex items-center')}>
          <div className={s('profile-integration-img-container flex rounded-full border border-solid border-gray-light mr-reg')}>
            <img src={logo} className={s('m-auto profile-integration-img')} />
          </div>
          <div className={s('text-sm ')}> {title} </div>
        </div>
        {
          isSignedIn ?
          
            <div className={s('flex-shrink-0 relative')}>
            <Dropdown
              className={s('ml-xs')}
              isOpen={dropdownOpen}
              toggler={
                <Button
                  text="Connected"
                  color="secondary"
                  className={s('text-green-reg bg-green-xlight p-reg shadow-none')}
                  icon={<MdKeyboardArrowDown className={s('ml-reg')} />}
                  iconLeft={false}
                />
              }
              onToggle={dropdownOpen => this.setState({ dropdownOpen })}
              body={
                <div className={s('bg-white rounded-lg profile-sign-out-dropdown w-full')}>
                  <Button
                    text="Sign Out"
                    className={'shadow-none text-purple-reg py-sm px-reg'}
                    onClick={() => { return null }}
                  />
                </div>
              }
            />
            </div>
          :
            <Button
              text="Sign In"
              color="transparent"
              className={s('p-reg')}
              onClick={() => onSignIn()}
            />
        }
      </div>
    );
  }
}

ProfileIntegration.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string,
  logo: PropTypes.string,
  isSignedIn: PropTypes.bool,
  onSignIn: PropTypes.func,
  onSignOut: PropTypes.func,
};

ProfileIntegration.defaultProps = {
};

export default ProfileIntegration;