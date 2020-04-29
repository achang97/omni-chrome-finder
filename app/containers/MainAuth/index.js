import React from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';
import { AuthHeader } from 'components/auth';
import { Button } from 'components/common';
import { ROUTES } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn();

const BUTTONS = [
  {
    subtitle: 'New to Omni?',
    title: 'Sign Up',
    route: ROUTES.SIGNUP,
    color: 'primary'
  },
  {
    subtitle: 'Returning User?',
    title: 'Log In',
    route: ROUTES.LOGIN,
    color: 'transparent'
  }
];

const MainAuth = ({ }) => {
  const renderBody = (title, subtitle) => {
    return (
      <div>
        <div className={s('mb-reg text-xs')}> {subtitle} </div>
        <div className={s('font-semibold text-lg')}> {title} </div>
      </div>
    );
  }

  return (
    <AuthHeader>
      { BUTTONS.map(({ title, subtitle, route, color }) => (
        <Link to={route}>
          <Button
            key={title}
            text={renderBody(title, subtitle)}
            underline={false}
            className={s('mb-sm justify-between pl-xl py-xl')}
            color={color}
            iconLeft={false}
            icon={<MdChevronRight className="text-lg" />}
          />          
        </Link>
      ))}
    </AuthHeader>
  )
}

export default MainAuth;