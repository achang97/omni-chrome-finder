import React, { useState } from 'react';

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';

import style from './login.css';
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const INTEGRATIONS = ['Slack', 'Email', 'Asana'];

const Login = (props) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabClick = (tabValue) => {
    setTabValue(tabValue);
  };

  return (
    <div>
      <div className={s('h-16 p-lg bg-gray-300')}>
        <Tabs
          activeIndex={tabValue}
          className={s('mb-lg')}
          tabClassName={s(
            'ask-integrations-tab text-sm font-normal rounded-full'
          )}
          inactiveTabClassName={s('text-purple-reg')}
          activeTabClassName={s(
            'ask-integrations-tab-selected text-white font-semibold'
          )}
          onTabClick={handleTabClick}
          showRipple={false}
        >
          {INTEGRATIONS.map(integration => (
            <Tab key={integration}>
              <div className={s('ask-integrations-tab-text')}>
                {' '}
                {integration}{' '}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
      <div
        className={s('w-full flex mx-auto p-sm items-center justify-center')}
        style={{ minHeight: '50vh' }}
      >
        <div>
          <span className={s('block text-center my-xl text-xl')}>
            Please,sign in
          </span>
          <div
            className={s(
              'w-full flex-1 bg-gray-300 rounded-lg p-lg shadow-md text-purple-reg'
            )}
          >
            <ul>
              <li
                className={s(
                  'list-none cursor-pointer bg-white m-sm my-lg p-sm px-xl font-semibold rounded-lg w-full'
                )}
              >
                Sign in through Slack
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
