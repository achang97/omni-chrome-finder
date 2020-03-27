import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Timeago from 'react-timeago';
import AnimateHeight from 'react-animate-height';

import Button from '../../common/Button';
import PlaceholderImg from '../../common/PlaceholderImg';
import SlackIcon from '../../../assets/images/icons/Slack_Mark.svg';
import Loader from '../../common/Loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { openCard } from '../../../actions/cards';
import { requestMarkUpToDateFromTasks, requestDismissTask, requestApproveCardFromTasks } from '../../../actions/tasks';

import { TASK_TYPE, NOOP, TIMEOUT_3S } from '../../../utils/constants';
import { IoMdAlert } from 'react-icons/io';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdCheck, MdAdd, MdEdit, MdLock, MdCheckCircle } from 'react-icons/md';
import { AiFillMinusCircle, AiFillQuestionCircle } from 'react-icons/ai';
const PROFILE_PICTURE_URL = 'https://janecanblogdotcom.files.wordpress.com/2014/09/ashley-square-profile.jpg';

import style from './task-item.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

class TaskItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showItem: !props.resolved,
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.resolved && this.props.resolved) {
      setTimeout(() => this.setState({ showItem: false }), TIMEOUT_3S);
    }
  }

  getHeaderInfo = () => {
    const { type, notifier, ownUserId } = this.props;
    const notifierName = notifier.id === ownUserId ? 'You' : notifier.name;

    switch (type) {
      case TASK_TYPE.NEEDS_VERIFICATION:
        return { headerTitle: 'Omni needs you to verify this card', headerTitleClassName: '', headerIcon: <IoMdAlert className={s('tasks-icon-container text-yellow-reg mr-reg')} /> };
      case TASK_TYPE.OUT_OF_DATE:
        return { headerTitle: `${notifierName} flagged your card as out of date`, headerTitleClassName: 'text-red-reg', headerIcon: <AiFillMinusCircle className={s('tasks-icon-container text-red-reg mr-reg')} /> };
      case TASK_TYPE.UNDOCUMENTED:
        return { headerTitle: 'Document your question', headerTitleClassName: 'text-purple-reg', headerIcon: <AiFillQuestionCircle className={s('tasks-icon-container text-purple-reg mr-reg')} /> };
      case TASK_TYPE.NEEDS_APPROVAL:
        return { headerTitle: `${notifierName} needs you to approve this card`, headerTitleClassName: '', headerIcon: <MdCheckCircle className={s('tasks-icon-container text-purple-reg mr-reg')} /> };
      default:
        return null;
    }
  }

  getButtonProps = () => {
    const { type } = this.props;
    switch (type) {
      case TASK_TYPE.NEEDS_VERIFICATION:
        return { buttonColor: 'secondary', buttonClassName: 'text-green-reg', buttonUnderline: false, buttonIcon: <MdCheck className={s('ml-sm')} /> };
      case TASK_TYPE.OUT_OF_DATE:
        return { buttonColor: 'secondary', buttonClassName: '', buttonUnderline: false, buttonIcon: <MdEdit className={s('ml-sm')} /> };
      case TASK_TYPE.UNDOCUMENTED:
        return { buttonColor: 'secondary', buttonClassName: '', buttonUnderline: false, buttonIcon: <MdAdd className={s('ml-sm')} /> };
      case TASK_TYPE.NEEDS_APPROVAL:
        return { buttonColor: 'transparent', buttonClassName: '', buttonUnderline: false, buttonIcon: <MdCheck className={s('ml-sm')} /> };
      default:
        return '';
    }
  }

  getContainerClass = () => {
    const { type } = this.props;
    switch (type) {
      case TASK_TYPE.NEEDS_VERIFICATION:
        return 'tasks-verification-gradient';
      case TASK_TYPE.OUT_OF_DATE:
        return 'tasks-out-of-date-gradient';
      case TASK_TYPE.UNDOCUMENTED:
        return 'tasks-undocumented-gradient';
      case TASK_TYPE.NEEDS_APPROVAL:
        return 'tasks-undocumented-gradient';
      default:
        return '';
    }
  }

  getTaskActionsInfo = () => {
    const {
      type, id, card: { _id: cardId },
      requestMarkUpToDateFromTasks, requestDismissTask, requestApproveCardFromTasks, openCard
    } = this.props;

    switch (type) {
      case TASK_TYPE.NEEDS_VERIFICATION:
        return {
          primaryOption: 'Mark as Up to Date',
          secondaryOption: 'Edit',
          primaryAction: () => requestMarkUpToDateFromTasks(id, cardId),
          secondaryAction: () => openCard({ _id: cardId, isEditing: true }),
        };
      case TASK_TYPE.OUT_OF_DATE:
        return {
          primaryOption: 'Edit',
          secondaryOption: 'Mark as Up to Date',
          primaryAction: () => openCard({ _id: cardId, isEditing: true }),
          secondaryAction: () => requestMarkUpToDateFromTasks(id, cardId),
        };
      case TASK_TYPE.UNDOCUMENTED:
        return {
          primaryOption: 'Create Card',
          secondaryOption: 'Dismiss',
          primaryAction: () => openCard({ _id: cardId, isEditing: true }),
          secondaryAction: () => requestDismissTask(id),
        };
      case TASK_TYPE.NEEDS_APPROVAL:
        return {
          primaryOption: 'Approve',
          primaryAction: () => requestApproveCardFromTasks(id, cardId),
          secondaryOption: 'Dismiss',
          secondaryAction: () => requestDismissTask(id),
        };
      default:
        return {};
    }
  }

  renderTaskPreview = () => {
    const { type, card: { answer, outOfDateReason, owners } } = this.props;

    switch (type) {
      case TASK_TYPE.NEEDS_VERIFICATION:
        return (<div className={s('text-xs text-gray-dark mt-reg vertical-ellipsis-2')}>{answer}</div>);
      case TASK_TYPE.OUT_OF_DATE:
        return (
          <div className={s('flex mt-reg')}>
            <div className={s('mr-sm mt-reg flex-shrink-0')}>
              <PlaceholderImg name={`${outOfDateReason.sender.firstname} ${outOfDateReason.sender.lastname}`} src={outOfDateReason.sender.profilePic} className={s('task-item-profile-picture rounded-full text-xs')} />
            </div>
            <div className={s('bg-gray-xlight p-reg rounded-lg w-full vertical-ellipsis-2 text-xs')}>
              {outOfDateReason.reason === '' ? 'No reason specified.' : outOfDateReason.reason}
            </div>
          </div>
        );
      case TASK_TYPE.UNDOCUMENTED:
        return (<div className={s('text-xs text-gray-dark mt-reg flex items-center')}>
          <div className={s('flex-grow')}>Question asked through Slack</div>
          <img src={SlackIcon} className={s('task-item-slack-icon rounded-full flex-shrink-0')} />
        </div>);
      case TASK_TYPE.NEEDS_APPROVAL:
        return (
          <div className={s('flex mt-reg')}>
            <div className={s('flex flex-shrink-0 mr-reg')}>
              {/* Show the first owner of the card */}
              <div className={s('flex-shrink-0')}>
                <PlaceholderImg name={`${owners[0].firstname} ${owners[0].lastname}`} src={owners[0].profilePic} className={s('task-item-profile-picture rounded-full text-xs')} />
              </div>
            </div>
            <div className={s('card-tag overflow-hidden')}>
              <div className={s('truncate')}>Onboarding</div>
              <MdLock className={s('ml-reg flex-shrink-0')} />
            </div>
          </div>);
      default:
        return '';
    }
  }

  render() {
    const {
      card: { _id: cardId, question }, id, createdAt, type,
      resolved, card, isLoading, error, className, onHide,
      openCard, requestDismissTask, requestMarkUpToDateFromTasks, ...rest
    } = this.props;
    const { showItem } = this.state;

    const { buttonColor, buttonClassName, buttonUnderline, buttonIcon } = this.getButtonProps();
    const containerClassName = this.getContainerClass();
    const { headerTitle, headerIcon, headerTitleClassName } = this.getHeaderInfo();
    const { primaryOption, primaryAction, secondaryOption, secondaryAction} = this.getTaskActionsInfo();

    return (
      <AnimateHeight
        height={showItem ? 'auto' : 0}
        onAnimationEnd={({ newHeight }) => newHeight === 0 && onHide()}
      >
        <div className={s(`flex flex-col p-lg rounded-lg ${containerClassName} ${className}`)} {...rest}>
          { resolved && 
            <div className={s('text-sm text-center')}>
              🎉 <span className={s('mx-sm')}> You've resolved this task! </span> 🎉
            </div>
          }
          { !resolved && (isLoading ?
            <Loader className={s('')} /> :
            <React.Fragment>
              <div className={s('flex items-center')}>
                {headerIcon}
                <div className={s(`text-xs text-gray-reg font-semibold ${headerTitleClassName}`)}> {headerTitle} </div>
              </div>

              <div className={s('p-lg bg-white shadow-md my-lg rounded-lg shadow-md cursor-pointer')} onClick={() => openCard({ _id: cardId })}>
                <div className={s('font-semibold vertical-ellipsis-2 text-md')}>{question}</div>
                { this.renderTaskPreview() }
              </div>

              {error && <div className={s('text-xs text-red-reg')}> {error} </div>}

              <div className={s('flex items-center justify-center')}>
                <div className={s('flex-grow text-gray-reg text-xs')}>
                  <Timeago date={createdAt} live={false} />
                </div>
                <div className={s('flex items-center justify-center text-sm text-gray-reg')}>
                  { secondaryOption && secondaryAction &&
                    <div
                      className={s('text-xs border-b border-t-0 border-r-0 border-l-0 border-solid border-gray-xlight cursor-pointer')}
                      onClick={() => secondaryAction()}
                    >
                      {secondaryOption}
                    </div>
                  }
                  <Button
                    text={primaryOption}
                    color={buttonColor}
                    className={s(`ml-reg p-reg ${buttonClassName}`)}
                    textClassName={s('text-xs font-semibold')}
                    underline={buttonUnderline}
                    icon={buttonIcon}
                    iconLeft={false}
                    onClick={() => primaryAction()}
                  />
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </AnimateHeight>
    );
  }
}

TaskItem.propTypes = {
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  type: PropTypes.oneOf([TASK_TYPE.NEEDS_VERIFICATION, TASK_TYPE.OUT_OF_DATE, TASK_TYPE.UNDOCUMENTED, TASK_TYPE.NEEDS_APPROVAL]).isRequired,
  card: PropTypes.object.isRequired,
  resolved: PropTypes.bool.isRequired,
  notifier: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onHide: PropTypes.func,
  className: PropTypes.string,
};

TaskItem.defaultProps = {
  className: '',
  onHide: NOOP,
  isLoading: false,
};

export default connect(
  state => ({
    ownUserId: state.profile.user._id,
  }),
  dispatch => bindActionCreators({
    requestMarkUpToDateFromTasks,
    requestDismissTask,
    requestApproveCardFromTasks,
    openCard,
  }, dispatch)
)(TaskItem);