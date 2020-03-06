import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../common/Button';
import PlaceholderImg from '../../common/PlaceholderImg';
import SlackIcon from "../../../assets/images/icons/Slack_Mark.svg";
import Loader from '../../common/Loader';

import { TASKS_TYPES } from '../../../utils/constants';
import { IoMdAlert } from 'react-icons/io'
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdCheck, MdAdd, MdEdit, MdLock, MdCheckCircle } from 'react-icons/md'
import { AiFillMinusCircle, AiFillQuestionCircle } from "react-icons/ai";
const PROFILE_PICTURE_URL = 'https://janecanblogdotcom.files.wordpress.com/2014/09/ashley-square-profile.jpg';

import style from './task-item.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const SIDE_DOCK_TRANSITION_MS = 300;

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
      case TASKS_TYPES.NEEDS_VERIFICATION:
        return { headerTitle: "Omni needs you to verify this card", headerTitleClassName: '', headerIcon: <IoMdAlert className={s("tasks-icon-container text-yellow-reg mr-reg")}/> }
      case TASKS_TYPES.OUT_OF_DATE:
        return { headerTitle: "Your card was flagged as out of date", headerTitleClassName: 'text-red-reg', headerIcon: <AiFillMinusCircle className={s("tasks-icon-container text-red-reg mr-reg")}/>}
      case TASKS_TYPES.UNDOCUMENTED:
        return { headerTitle: "Document your question", headerTitleClassName: 'text-purple-reg', headerIcon: <AiFillQuestionCircle className={s("tasks-icon-container text-purple-reg mr-reg")}/>}
      case TASKS_TYPES.NEEDS_APPROVAL:
        return { headerTitle: "Omni needs you to approve this card", headerTitleClassName: '', headerIcon: <MdCheckCircle className={s("tasks-icon-container text-purple-reg mr-reg")}/>}
      default:
        return null; 
    }
  }


  getButtonProps = () => {
    const { type } = this.props;
    switch (type) {
      case TASKS_TYPES.NEEDS_VERIFICATION:
        return { buttonColor: "secondary", buttonClassName: "text-green-reg", buttonUnderline: false, buttonIcon: <MdCheck className={s("ml-sm")} /> };
      case TASKS_TYPES.OUT_OF_DATE:
        return { buttonColor: "secondary", buttonClassName: "", buttonUnderline: false, buttonIcon: <MdEdit className={s("ml-sm")} /> };
      case TASKS_TYPES.UNDOCUMENTED:
        return { buttonColor: "secondary", buttonClassName: "", buttonUnderline: false, buttonIcon: <MdAdd className={s("ml-sm")} /> };
      case TASKS_TYPES.NEEDS_APPROVAL:
        return { buttonColor: "transparent", buttonClassName: "", buttonUnderline: false, buttonIcon: <MdCheck className={s("ml-sm")} /> };
      default:
        return "";
    }
  }

  getContainerClass = () => {
    const { type } = this.props;
    switch (type) {
      case TASKS_TYPES.NEEDS_VERIFICATION:
        return "tasks-verification-gradient";
      case TASKS_TYPES.OUT_OF_DATE:
        return "tasks-out-of-date-gradient";
      case TASKS_TYPES.UNDOCUMENTED:
        return "tasks-undocumented-gradient";
      case TASKS_TYPES.NEEDS_APPROVAL:
        return "tasks-undocumented-gradient";
      default:
        return ""; 
    }
  }

  renderTaskPreview = () => {
    const { type, preview, owners, reasonOutdated } = this.props;
    switch (type) {
      case TASKS_TYPES.NEEDS_VERIFICATION:
        return (<div className={s("text-xs text-gray-dark mt-reg vertical-ellipsis-2")}>{preview}</div>);
      case TASKS_TYPES.OUT_OF_DATE:
        return (
          <div className={s("flex mt-reg")}>
            <div className={s("mr-sm mt-reg flex-shrink-0")}>
              <PlaceholderImg name={reasonOutdated.sender.firstname + ' ' + reasonOutdated.sender.lastname} src={reasonOutdated.sender.profilePic} className={s('task-item-profile-picture rounded-full text-xs')}/>
            </div>
            <div className={s("bg-gray-xlight p-reg rounded-lg w-full vertical-ellipsis-2 text-xs")}>
              {reasonOutdated.reason === '' ? 'No reason specified.' : reasonOutdated.reason}
            </div>
          </div>
        )
      case TASKS_TYPES.UNDOCUMENTED:
        return (<div className={s("text-xs text-gray-dark mt-reg flex items-center")}>
            <div className={s("flex-grow")}>Question asked through Slack</div>
            <img src={SlackIcon} className={s('task-item-slack-icon rounded-full flex-shrink-0')} />
            </div>);
      case TASKS_TYPES.NEEDS_APPROVAL:
        return (
          <div className={s("flex mt-reg")}>
            <div className={s("flex flex-shrink-0 mr-reg")}>
              {/* Show the first owner of the card */}
              <div className={s("flex-shrink-0")}>
                <img src={PROFILE_PICTURE_URL} className={s('task-item-profile-picture rounded-full')} />
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
    const { index, type, question, preview, date, primaryOption, primaryAction, secondaryOption, secondaryAction, isPrimaryLoading, isSecondaryLoading, primaryError, secondaryError } = this.props;
    const { buttonColor, buttonClassName, buttonUnderline, buttonIcon } = this.getButtonProps();
    const containerClassName = this.getContainerClass(); 
    const { headerTitle, headerIcon, headerTitleClassName } = this.getHeaderInfo();

    return (
      <div className={s(`flex flex-col ${containerClassName} p-lg rounded-lg ${index > 0 ? 'mt-reg' : ''}`)} >
        {
          (isPrimaryLoading || isSecondaryLoading) ?
          <Loader className={s('')}/>
          :
          <React.Fragment>
            <div className={s("flex items-center")}>
              {headerIcon}
              <div className={s(`text-xs text-gray-reg font-semibold ${headerTitleClassName}`)}> {headerTitle} </div>
            </div>

            <div className={s("p-lg bg-white shadow-md my-lg rounded-lg shadow-md cursor-pointer")}>
              <div className={s("font-semibold vertical-ellipsis-2 text-md")}>{question}</div>
              { this.renderTaskPreview() }
            </div>

            {primaryError && <div> {primaryError} </div>}
            {secondaryError && <div> {secondaryError} </div>}
            
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
  type: PropTypes.oneOf([TASKS_TYPES.NEEDS_VERIFICATION, TASKS_TYPES.OUT_OF_DATE, TASKS_TYPES.UNDOCUMENTED, TASKS_TYPES.NEEDS_APPROVAL]),
  question: PropTypes.string,
  preview: PropTypes.string,
  date: PropTypes.object,
  primaryOption: PropTypes.string,
  primaryAction: PropTypes.func,
  secondaryOption: PropTypes.string,
  secondaryAction: PropTypes.func,
  owners: PropTypes.array,
  reasonOutdated: PropTypes.object,
  isPrimaryLoading: PropTypes.bool,
  isSecondaryLoading: PropTypes.bool,
  primaryError: PropTypes.string,
  secondaryError: PropTypes.string,
};

TaskItem.defaultProps = {
  owners: ["John", "Jack"],
  reasonOutdated: {},
  isPrimaryLoading: false,
  isSecondaryLoading: false,
  primaryError: null,
  secondaryError: null,

};

export default TaskItem;