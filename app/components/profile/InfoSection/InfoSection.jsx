import React from 'react';
import PropTypes from 'prop-types';
import { MdEdit } from 'react-icons/md';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { Button, Separator, Loader } from 'components/common';
import { URL, USER } from 'appConstants';
import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';
import { UserPropTypes } from 'utils/propTypes';

import ProfilePicture from '../ProfilePicture';
import style from './info-section.css';

const s = getStyleApplicationFn(style);

const PROGRESS_BAR_STYLES = {
  // How long animation takes to go from one percentage to another, in seconds
  pathTransitionDuration: 0.5,

  // Colors
  textColor: colors.purple.reg,
  pathColor: colors.purple.reg
};

const InfoSection = ({
  user,
  userEdits,
  analytics,
  isSavingEdits,
  isEditingAbout,
  changeFirstname,
  changeLastname,
  changeBio,
  requestSaveUserEdits,
  editUser
}) => {
  const renderAboutSection = () => {
    return (
      <div className={s('flex flex-col')}>
        {isSavingEdits ? (
          <Loader />
        ) : (
          <div className={s('flex')}>
            <ProfilePicture isEditable={isEditingAbout} />
            <div className={s('flex flex-1 flex-col min-w-0 ml-reg')}>
              {!isEditingAbout && (
                <div className={s('flex mt-xs text-sm text-purple-reg')}>
                  <div className={s('flex-1')}>
                    {user.company.name} • {user.role}
                  </div>
                  <div className={s('cursor-pointer flex')} onClick={editUser}>
                    <MdEdit />
                    <span className={s('ml-xs text-gray-reg')}> Edit </span>
                  </div>
                </div>
              )}
              {isEditingAbout ? (
                <div>
                  <div className={s('flex')}>
                    <input
                      placeholder="First Name"
                      className={s('info-about-input flex-grow mr-sm min-w-0 flex-1 cursor-text')}
                      value={userEdits.firstname}
                      onChange={(e) => changeFirstname(e.target.value)}
                    />
                    <input
                      placeholder="Last Name"
                      className={s('info-about-input flex-grow ml-sm min-w-0 flex-1 cursor-text')}
                      value={userEdits.lastname}
                      onChange={(e) => changeLastname(e.target.value)}
                    />
                  </div>
                  <input
                    placeholder="Bio (eg. Support Manager @ Pied Piper)"
                    className={s('info-about-input w-full min-w-0 flex-1 mt-reg cursor-text')}
                    value={userEdits.bio}
                    onChange={(e) => changeBio(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <div className={s('text-reg font-semibold mt-xs')}>
                    {user.firstname} {user.lastname}
                  </div>
                  <div className={s('text-sm text-gray-dark mt-sm')}> {user.bio}</div>
                </div>
              )}
            </div>
          </div>
        )}
        {isEditingAbout && (
          <Button
            text="Save Changes"
            className={s('bg-purple-light text-purple-reg mt-reg')}
            onClick={requestSaveUserEdits}
          />
        )}
      </div>
    );
  };

  const renderDashboardButton = () => {
    if (user.role !== USER.ROLE.ADMIN) {
      return null;
    }

    return (
      <a href={URL.WEB_APP} target="_blank" rel="noreferrer noopener" className={s('mt-sm')}>
        <Button
          className={s('py-sm')}
          textClassName={s('text-xs')}
          color="primary"
          text="Open Admin Dashboard"
        />
      </a>
    );
  };

  const renderMetricsSection = () => {
    const { count = 0, upToDateCount } = analytics;
    let upToDatePercentage = 0;
    let upToDatePercentageText = '--';

    if (count !== 0) {
      upToDatePercentage = Math.floor((upToDateCount / count) * 100);
      upToDatePercentageText = `${upToDatePercentage}%`;
    }

    return (
      <div className={s('flex justify-between bg-white shadow-light p-reg mt-sm rounded-lg')}>
        <div>
          <div className={s('text-xl text-purple-reg font-semibold')}>{upToDatePercentageText}</div>
          <div className={s('text-sm text-purple-reg mt-sm')}> Cards up to date</div>
        </div>
        <CircularProgressbar
          className={s('w-4xl h-4xl')}
          value={upToDatePercentage}
          text={upToDatePercentageText}
          styles={buildStyles(PROGRESS_BAR_STYLES)}
        />
      </div>
    );
  };

  return (
    <div className={s('flex flex-col px-lg')}>
      {renderAboutSection()}
      {renderMetricsSection()}
      {renderDashboardButton()}
      <Separator horizontal className={s('mt-reg')} />
    </div>
  );
};

InfoSection.propTypes = {
  // Redux State
  user: UserPropTypes.isRequired,
  userEdits: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    bio: PropTypes.string
  }).isRequired,
  analytics: PropTypes.shape({
    count: PropTypes.number.isRequired,
    upToDateCount: PropTypes.number.isRequired
  }).isRequired,
  isSavingEdits: PropTypes.bool,
  isEditingAbout: PropTypes.bool.isRequired,

  // Redux Actions
  changeFirstname: PropTypes.func.isRequired,
  changeLastname: PropTypes.func.isRequired,
  changeBio: PropTypes.func.isRequired,
  requestSaveUserEdits: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired
};

export default InfoSection;
