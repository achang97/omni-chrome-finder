import React from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';
import { AuthHeader } from 'components/auth';
import { Button } from 'components/common';
import { ROUTES, WEB_APP_ROUTES, URL } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const BUTTONS = [
  {
    subtitle: 'New to Omni?',
    title: 'Sign Up',
    isExternal: true,
    route: WEB_APP_ROUTES.SIGNUP,
    color: 'primary'
  },
  {
    subtitle: 'Returning User?',
    title: 'Log In',
    isExternal: false,
    route: ROUTES.LOGIN,
    color: 'transparent'
  }
];

const MainAuth = () => {
  const renderBody = (title, subtitle) => {
    return (
      <div>
        <div className={s('mb-sm text-xs')}> {subtitle} </div>
        <div className={s('font-semibold text-lg')}> {title} </div>
      </div>
    );
  };

  const renderButton = (buttonProps) => {
    const { title, subtitle, color } = buttonProps;
    return (
      <Button
        key={title}
        text={renderBody(title, subtitle)}
        underline={false}
        className={s('mb-sm justify-between pl-xl py-xl')}
        color={color}
        iconLeft={false}
        icon={<MdChevronRight className={s('text-lg')} />}
      />
    );
  };

  const render = () => {
    return (
      <AuthHeader>
        {BUTTONS.map(({ route, isExternal, title, subtitle, color }) => {
          const button = renderButton({ title, subtitle, color });
          return (
            <React.Fragment key={title}>
              {isExternal ? (
                <a
                  href={`${URL.WEB_APP}${WEB_APP_ROUTES.SIGNUP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {button}
                </a>
              ) : (
                <Link to={route}>{button}</Link>
              )}
            </React.Fragment>
          );
        })}
      </AuthHeader>
    );
  };

  return render();
};

export default MainAuth;
