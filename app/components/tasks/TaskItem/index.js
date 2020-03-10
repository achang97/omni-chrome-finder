import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../common/Button';
import PlaceholderImg from '../../common/PlaceholderImg';
import SlackIcon from "../../../assets/images/icons/Slack_Mark.svg";
import Loader from '../../common/Loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { openCard } from '../../../actions/cards';
import * as tasksActions from '../../../actions/tasks';

import { TASK_TYPE } from '../../../utils/constants';
import { IoMdAlert } from 'react-icons/io'
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdCheck, MdAdd, MdEdit, MdLock, MdCheckCircle } from 'react-icons/md'
import { AiFillMinusCircle, AiFillQuestionCircle } from "react-icons/ai";
const PROFILE_PICTURE_URL = 'https://janecanblogdotcom.files.wordpress.com/2014/09/ashley-square-profile.jpg';

import style from './task-item.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);


@connect(
  state => ({
    ...state.tasks,
  }),
  dispatch => bindActionCreators({
    ...tasksActions,
    openCard,
  }, dispatch)
)

class TaskItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    
  }

  getHeaderInfo = () => {
    const { type } = this.props;
    switch (type) {
      case TASK_TYPE.NEEDS_VERIFICATION:
        return { headerTitle: "Omni needs you to verify this card", headerTitleClassName: '', headerIcon: <IoMdAlert className={s("tasks-icon-container text-yellow-reg mr-reg")}/> }
      case TASK_TYPE.OUT_OF_DATE:
        return { headerTitle: "Your card was flagged as out of date", headerTitleClassName: 'text-red-reg', headerIcon: <AiFillMinusCircle className={s("tasks-icon-container text-red-reg mr-reg")}/>}
      case TASK_TYPE.UNDOCUMENTED:
        return { headerTitle: "Document your question", headerTitleClassName: 'text-purple-reg', headerIcon: <AiFillQuestionCircle className={s("tasks-icon-container text-purple-reg mr-reg")}/>}
      case TASK_TYPE.NEEDS_APPROVAL:
        return { headerTitle: "Omni needs you to approve this card", headerTitleClassName: '', headerIcon: <MdCheckCircle className={s("tasks-icon-container text-purple-reg mr-reg")}/>}
      default:
        return null; 
    }
  }


  getButtonProps = () => {
    const { type } = this.props;
    switch (type) {
      case TASK_TYPE.NEEDS_VERIFICATION:
        return { buttonColor: "secondary", buttonClassName: "text-green-reg", buttonUnderline: false, buttonIcon: <MdCheck className={s("ml-sm")} /> };
      case TASK_TYPE.OUT_OF_DATE:
        return { buttonColor: "secondary", buttonClassName: "", buttonUnderline: false, buttonIcon: <MdEdit className={s("ml-sm")} /> };
      case TASK_TYPE.UNDOCUMENTED:
        return { buttonColor: "secondary", buttonClassName: "", buttonUnderline: false, buttonIcon: <MdAdd className={s("ml-sm")} /> };
      case TASK_TYPE.NEEDS_APPROVAL:
        return { buttonColor: "transparent", buttonClassName: "", buttonUnderline: false, buttonIcon: <MdCheck className={s("ml-sm")} /> };
      default:
        return "";
    }
  }

  getContainerClass = () => {
    const { type } = this.props;
    switch (type) {
      case TASK_TYPE.NEEDS_VERIFICATION:
        return "tasks-verification-gradient";
      case TASK_TYPE.OUT_OF_DATE:
        return "tasks-out-of-date-gradient";
      case TASK_TYPE.UNDOCUMENTED:
        return "tasks-undocumented-gradient";
      case TASK_TYPE.NEEDS_APPROVAL:
        return "tasks-undocumented-gradient";
      default:
        return ""; 
    }
  }

  getTaskActionsInfo = () => {
    const { type, id, card, openCard, requestMarkUpToDateFromTasks, requestDismissTask, isUpdatingCard, isDismissingTask, markCardUpToDateError, dimissTaskError } = this.props;
    const { _id } = card;
    switch (type) {
      case TASK_TYPE.NEEDS_VERIFICATION:
        return { primaryOption: "Mark as Up to Date", secondaryOption: "Edit", primaryAction: () => { requestMarkUpToDateFromTasks(_id) }, secondaryAction: () => { openCard({ _id, isEditing: true }) },
                isPrimaryLoading: isUpdatingCard, primaryError: markCardUpToDateError };
      case TASK_TYPE.OUT_OF_DATE:
        return { primaryOption: "Edit", secondaryOption: "Mark as Up to Date", primaryAction: () => { openCard({ _id, isEditing: true }) }, secondaryAction: () => { requestMarkUpToDateFromTasks(_id) },
                isSecondaryLoading: isUpdatingCard, secondaryError: markCardUpToDateError };
      case TASK_TYPE.UNDOCUMENTED:
        return { primaryOption: "Create Card", secondaryOption: "Dismiss", primaryAction: () => { openCard({ _id, isEditing: true }) }, secondaryAction: () => { requestDismissTask( id ) },
                isSecondaryLoading: isDismissingTask, secondaryError: dimissTaskError };
      case TASK_TYPE.NEEDS_APPROVAL:
        return { primaryOption: "Approve", secondaryOption: "Decline", primaryAction: () => { return }, secondaryAction: () => { return } };
      default:
        return {}; 
    }
  }

  renderTaskPreview = () => {
    const { type, card } = this.props;
    const { answer, outOfDateReason, owners } = card;

    switch (type) {
      case TASK_TYPE.NEEDS_VERIFICATION:
        return (<div className={s("text-xs text-gray-dark mt-reg vertical-ellipsis-2")}>{answer}</div>);
      case TASK_TYPE.OUT_OF_DATE:
        return (
          <div className={s("flex mt-reg")}>
            <div className={s("mr-sm mt-reg flex-shrink-0")}>
              <PlaceholderImg name={outOfDateReason.sender.firstname + ' ' + outOfDateReason.sender.lastname} src={outOfDateReason.sender.profilePic} className={s('task-item-profile-picture rounded-full text-xs')}/>
            </div>
            <div className={s("bg-gray-xlight p-reg rounded-lg w-full vertical-ellipsis-2 text-xs")}>
              {outOfDateReason.reason === '' ? 'No reason specified.' : outOfDateReason.reason}
            </div>
          </div>
        )
      case TASK_TYPE.UNDOCUMENTED:
        return (<div className={s("text-xs text-gray-dark mt-reg flex items-center")}>
            <div className={s("flex-grow")}>Question asked through Slack</div>
            <img src={SlackIcon} className={s('task-item-slack-icon rounded-full flex-shrink-0')} />
            </div>);
      case TASK_TYPE.NEEDS_APPROVAL:
        return (
          <div className={s("flex mt-reg")}>
            <div className={s("flex flex-shrink-0 mr-reg")}>
              {/* Show the first owner of the card */}
              <div className={s("flex-shrink-0")}>
                <PlaceholderImg name={owners[0].firstname + ' ' + owners[0].lastname} src={owners[0].profilePic}  className={s('task-item-profile-picture rounded-full text-xs')}/>
              </div>
            </div>
              <div className={s("card-tag overflow-hidden")}> 
                  <div className={s("truncate")}>Onboarding</div>
                  <MdLock className={s("ml-reg flex-shrink-0")} />
              </div>
          </div>);
      default:
        return ""; 
    }
  }

  render() {
    const { index, type, card, date, openCard, className, key } = this.props;
    const { _id, question } = card;


    const { buttonColor, buttonClassName, buttonUnderline, buttonIcon } = this.getButtonProps();
    const containerClassName = this.getContainerClass(); 
    const { headerTitle, headerIcon, headerTitleClassName } = this.getHeaderInfo();
    const { primaryOption, primaryAction, isPrimaryLoading, primaryError,
            secondaryOption, secondaryAction, isSecondaryLoading, secondaryError, } = this.getTaskActionsInfo();

    return (
      <div className={s(`flex flex-col p-lg rounded-lg ${containerClassName} ${className}`)} key={key}>
        {
          (isPrimaryLoading || isSecondaryLoading) ?
          <Loader className={s('')}/>
          :
          <React.Fragment>
            <div className={s("flex items-center")}>
              {headerIcon}
              <div className={s(`text-xs text-gray-reg font-semibold ${headerTitleClassName}`)}> {headerTitle} </div>
            </div>

            <div className={s("p-lg bg-white shadow-md my-lg rounded-lg shadow-md cursor-pointer")} onClick={() => openCard({ _id }) }>
              <div className={s("font-semibold vertical-ellipsis-2 text-md")}>{question}</div>
              { this.renderTaskPreview() }
            </div>

            {primaryError && <div className={s('text-xs text-red-reg')}> {primaryError} </div>}
            {secondaryError && <div className={s('text-xs text-red-reg')}> {secondaryError} </div>}
            
            <div className={s("flex items-center justify-center")}>
              <div className={s("flex-grow text-gray-reg text-xs")}> {date} </div>
              <div className={s("flex items-center justify-center text-sm text-gray-reg")}>
                <div 
                  className={s("text-xs border-b border-t-0 border-r-0 border-l-0 border-solid border-gray-xlight cursor-pointer")}
                  onClick={() => secondaryAction()}
                  >
                  {secondaryOption}
                </div>
                <Button 
                  text={primaryOption} 
                  color={buttonColor}
                  className={s(`ml-reg p-reg ${buttonClassName}`)}
                  textClassName={s("text-xs font-semibold")}
                  underline={buttonUnderline}
                  icon={buttonIcon} 
                  iconLeft={false}
                  onClick={() => primaryAction()}
                  />
              </div>
            </div>
          </React.Fragment>
        }
      </div>
    );
  }
}

TaskItem.propTypes = {
  index: PropTypes.number,
  id: PropTypes.string,
  date: PropTypes.object,
  type: PropTypes.oneOf([TASK_TYPE.NEEDS_VERIFICATION, TASK_TYPE.OUT_OF_DATE, TASK_TYPE.UNDOCUMENTED, TASK_TYPE.NEEDS_APPROVAL]),
  card: PropTypes.object,
  className: PropTypes.string,
};

TaskItem.defaultProps = {
  className: '',
};

export default TaskItem;