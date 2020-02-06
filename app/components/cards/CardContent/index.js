import React, { Component, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdArrowDropDown, MdMoreHoriz, MdModeEdit, MdThumbUp, MdBookmarkBorder, MdPerson, MdAttachment } from "react-icons/md";
import { default as SlackIcon } from "../../../assets/images/icons/Slack_Mark.svg";

import { FaSlack } from "react-icons/fa";
import { bindActionCreators } from 'redux';
import { EditorState } from 'draft-js';
import { connect } from 'react-redux';
import { editCard, saveCard, openCardSideDock, closeCardSideDock, openCardCreateModal, closeCardCreateModal, changeAnswerEditor, changeDescriptionEditor, enableEditor, disableEditor, adjustDescriptionSectionHeight, openModal, closeModal, toggleSelectedMessage, saveMessages} from '../../../actions/cards';
import TextEditor from '../../editors/TextEditor';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import CheckBox from '../../common/CheckBox';

import CardStatus from '../CardStatus';
import CardTags from '../CardTags';
import { Resizable } from 're-resizable';
import {useDropzone} from 'react-dropzone';
import Dropzone from 'react-dropzone'
import CardSideDock from '../CardSideDock';
import CardCreateModal from '../CardCreateModal';

import style from './card-content.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const TABS_HEIGHT = 51;
const MIN_ANSWER_HEIGHT = 180;
const MIN_QUESTION_HEIGHT = 180;

const DESCRIPTION_EDITOR_TYPE = 'DESCRIPTION';
const ANSWER_EDITOR_TYPE = 'ANSWER';

const THREAD_MODAL = 'THREAD_MODAL';
const THREAD_MODAL_EDIT = 'THREAD_MODAL_EDIT';

const PLACEHOLDER_MESSAGES = [
	{
		senderName: 'Chetan Rane',
		message: 'Savings her pleased are several started females met. Short her not among being any. Thing of judge fruit charm views do. Miles mr an forty along as he. She education get middleton day agreement performed preserved unwilling. Do however as pleased offence outward beloved by present. By outward neither he so covered amiable greater. Juvenile proposal betrayed he an informed weddings followed. Precaution day see imprudence sympathize principles. At full leaf give quit to in they up.',
		time: 'Today at 3:52 PM',
		selected: true,
	},
	{
		senderName: 'Andrew Chang',
		message: 'What up bro how u doin',
		time: 'Today at 3:52 PM',
		selected: true,
	},
	{
		senderName: 'Chetan Rane',
		message: 'Savings her pleased are several started females met. Short her not among being any. Thing of judge fruit charm views do. Miles mr an forty along as he. She education get middleton day agreement performed preserved unwilling. Do however as pleased offence outward beloved by present. By outward neither he so covered amiable greater. Juvenile proposal betrayed he an informed weddings followed. Precaution day see imprudence sympathize principles. At full leaf give quit to in they up.',
		time: 'Today at 3:52 PM',
		selected: true,
	},
];

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderWidth: 2,
  borderRadius: 8,
  paddingHorizontal: 10,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function StyledDropzone(props) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({accept: 'image/*'});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject
  ]);

  return (
    <div className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p className={s("m-0 text-sm text-purple-reg")}>Drag Files Here or Click to Add</p>
      </div>
    </div>
  );
}

@connect(
  state => ({

  }),
  dispatch => bindActionCreators({
    editCard,
    saveCard,
    saveMessages,
    openCardSideDock,
    closeCardSideDock,
    openCardCreateModal,
    closeCardCreateModal,
    changeAnswerEditor,
    changeDescriptionEditor,
    enableEditor,
    disableEditor,
    adjustDescriptionSectionHeight,
    openModal,
    closeModal,
    toggleSelectedMessage,
  }, dispatch)
)

class CardContent extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
    	footerHeight: 0,
    	selectedMessages: PLACEHOLDER_MESSAGES.map(msg => msg.selected),
    };
  }

  componentDidMount() {
  	this.setState({ footerHeight: this.footerRef.clientHeight });
  }

  componentDidUpdate(prevProps, prevState) {
  	if (prevState.footerHeight !== this.footerRef.clientHeight) {
  		this.setState({ footerHeight: this.footerRef.clientHeight });
  	}
  }

  componentWillUnmount() {
  }

  enableDescriptionEditor = () => {
    this.props.disableEditor(this.props.id, ANSWER_EDITOR_TYPE);
    this.props.enableEditor(this.props.id, DESCRIPTION_EDITOR_TYPE);
    this.props.adjustDescriptionSectionHeight(this.props.id, this.getMaxDescriptionHeight());
  }

  disableDescriptionEditor = () => {
    this.props.disableEditor(this.props.id, DESCRIPTION_EDITOR_TYPE);
  }

  enableAnswerEditor = () => {
    this.disableDescriptionEditor();
    this.props.enableEditor(this.props.id, ANSWER_EDITOR_TYPE);
    this.props.adjustDescriptionSectionHeight(this.props.id, MIN_QUESTION_HEIGHT);
  }

  disableAnswerEditor = () => {
    this.setState({ answerEditorEnabled: false });
    this.props.disableEditor(this.props.id, ANSWER_EDITOR_TYPE);
  }

  editCard = (id) => {
    this.props.editCard(id);
    this.enableAnswerEditor();
  }

  saveCard = (id) => {
    this.props.disableEditor(this.props.id, DESCRIPTION_EDITOR_TYPE);
    this.props.saveCard(id);
  }

  saveMessages = (id) => {
    this.props.saveMessages(id);
  }

  onAnswerEditorStateChange = (editorState) => {
    this.props.changeAnswerEditor(this.props.id, editorState);
  }

  onDescriptionEditorStateChange = (editorState) => {
    this.props.changeDescriptionEditor(this.props.id, editorState);
  }

  getMaxDescriptionHeight = () => {
  	return this.props.cardHeight - TABS_HEIGHT - this.state.footerHeight - MIN_ANSWER_HEIGHT;
  }

  toggleSelectedMessage = (i) => {
  	this.props.toggleSelectedMessage(this.props.id, i);
  }

  renderDropZone =  (props) => {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
    
    const files = acceptedFiles.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));

    return (
      <section className="container">
        <div {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    );
  }

  renderHeader = () => {
  	const { id, isEditing, tags, sideDockOpen, openCardSideDock, closeCardSideDock, descriptionEditorEnabled, descriptionSectionHeight, cardWidth } = this.props;
    const { isSideDockVisible } = this.state;
    
  	return (
  		<Resizable
            className={s("bg-purple-light py-sm px-2xl min-h-0 flex-shrink-0 flex flex-col")}
            defaultSize={{ height: MIN_QUESTION_HEIGHT }}
            minHeight={ MIN_QUESTION_HEIGHT }
            maxHeight={ this.getMaxDescriptionHeight() }
            size={{ height: descriptionSectionHeight }}
            onResizeStop={(e, direction, ref, d) => {
            	this.props.adjustDescriptionSectionHeight(id, descriptionSectionHeight + d.height);
            }}
            enable={{ top:false, right:false, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false }}
        >
          <strong className={s("text-xs text-purple-reg pt-xs pb-sm flex items-center justify-between opacity-75")}>
            <div>2 Days Ago</div>
            <div className={s("flex items-center")}>
	            <button onClick={() => openCardSideDock(id)}>
                <MdMoreHoriz />
              </button>
            </div>
          </strong>
          <div className={s("text-2xl font-semibold")}>How do I delete a user? ({id})</div>
          { isEditing ?

            	<div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
		        	{
	            		descriptionEditorEnabled ?
	            		<TextEditor 
	            			onEditorStateChange={this.onDescriptionEditorStateChange} 
	            			editorState={this.props.descriptionEditorState} 
		        			wrapperClassName={s('card-description-text-editor-wrapper-edit flex flex-col flex-grow min-h-0 my-reg')} 
		        			editorClassName={s('text-editor overflow-auto bg-white')} 
		        			toolbarClassName={s('text-editor-toolbar')}
		        			autoFocus />
	 					:
	 					<div className={s("flex-grow my-reg flex flex-col flex-grow min-h-0")} onClick={() => this.enableDescriptionEditor()} >
		            		<TextEditor
		            			onClick={() => this.enableDescriptionEditor()}
		            			onEditorStateChange={this.onDescriptionEditorStateChange} 
		            			editorState={this.props.descriptionEditorState}
		        				wrapperClassName={s('card-description-text-editor-wrapper-inactive cursor-pointer flex flex-col flex-grow min-h-0')} 
		        				editorClassName={s('text-editor card-description-text-editor-view overflow-auto')} 
		        				toolbarClassName={s('')}
		        				toolbarHidden
		        				readOnly/>
	        			</div>
	        		}
	        		<div className={s("flex justify-between")}>
		        		<div className={s("flex text-purple-reg text-sm cursor-pointer underline-border border-purple-gray-20 items-center")} onClick={() => openCardSideDock(id)}> 
		        			<MdAttachment className={s("mr-sm")} />
		        			<div >3 Attachments</div>
		        		</div>
		        		<StyledDropzone />
					</div>
        		</div>
        		: 
        		<TextEditor 
        			onEditorStateChange={this.onDescriptionEditorStateChange} 
        			editorState={this.props.descriptionEditorState} 
        			wrapperClassName={s('text-editor-wrapper card-description-text-editor-wrapper-view flex-grow flex flex-col min-h-0 my-reg')} 
        			editorClassName={s('text-editor card-description-text-editor-view overflow-auto')} 
        			toolbarClassName={''} 
        			toolbarHidden
        			readOnly/>
            }

            { !isEditing &&
	            <div className={s("flex items-center justify-between")}>
	              <CardTags
                  tags={tags}
                  onTagClick={() => openCardSideDock(id)}
                  maxWidth={cardWidth * 0.5}
                />  
	              <div className={s("flex flex-shrink-0 z-10 bg-purple-light ml-sm")}>
              	  <Button 
              	  	text={"2"}
              	  	iconLeft={false}
              	  	icon={<MdAttachment className={s("ml-xs")} />}
              	  	color={"secondary"}
              	  	className={s("py-sm px-reg rounded-full")}
                    onClick={() => openCardSideDock(id)}
              	  />
                  <div className={s("vertical-separator")} />
                  <CardStatus isUpToDate={true} />
	              </div>
	            </div>
			}
		</Resizable>
  	)
  }

  renderThreadModal = () => {
  	const { id, isEditing, showThreadEditModal , showThreadModal, closeModal} = this.props;
  	return (
  		<Modal 
    		isOpen={isEditing ? showThreadEditModal : showThreadModal} 
    		onRequestClose={isEditing ? () => {closeModal(id, THREAD_MODAL_EDIT)} : () => {closeModal(id, THREAD_MODAL)}}
    		headerClassName={s("bg-purple-light rounded-lg")}
    		bodyClassName={s("overflow-none flex flex-col rounded-b-lg")}
    		className={s("bg-purple-light")}
    		overlayClassName={s("rounded-b-lg")}
    		shouldCloseOnOutsideClick
    		title={isEditing ? "Unselect messages you do not want shown" : "View Slack Thread"}>
      			{this.renderMessageList()}
	      		{ isEditing &&
	      			<Button
	      				onClick={() => this.saveMessages(id)}
			        	color={"primary"}
			        	text={"Save"}
			        	className={s("rounded-t-none")}
			        	/>
		    	}	
      	</Modal>

  	)
  }

  renderMessageList = () => {
  	const { isEditing, selectedMessages } = this.props;
  	return (
  		<div className={s("message-manager-container bg-purple-light mx-lg mb-lg rounded-lg flex-grow overflow-auto")}>
		  	{PLACEHOLDER_MESSAGES.map((messageObj, i) => (
				<div className={s(`flex p-reg   ${ i % 2 === 0 ? '' : 'bg-purple-gray-10' } `)}>
					<div className={s("message-photo-container rounded-lg bg-purple-reg flex-shrink-0 text-white flex justify-center mr-reg items-center shadow-md")}>
						<MdPerson />
					</div>
					<div className={s("flex flex-col flex-grow")}> 
						<div className={s("flex items-end")}>
							<div className={s("text-sm font-semibold mr-reg")}> { messageObj.senderName } </div>
							<div className={s("text-sm text-gray-dark")}> { messageObj.time } </div>
						</div>
						<div className={s("mt-sm text-sm")}> {messageObj.message}</div>
					</div>

					{isEditing &&
						<CheckBox 
							isSelected={selectedMessages[i]} 
							toggleCheckbox={() => this.toggleSelectedMessage(i)}
							className={s("flex-shrink-0 margin-xs")}/>
					}
				</div>
	    	))}
    	</div>
    )
  }

  renderAnswer = () => {
  	const { isEditing, answerEditorEnabled, selectedMessages } = this.props;
  	return (
  		<div className={s('p-2xl flex-grow min-h-0 flex flex-col min-h-0 relative')}>
	        { isEditing ?
	        	<div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
	        	{
		        	answerEditorEnabled ?
			        	<TextEditor 
			        		onEditorStateChange={this.onAnswerEditorStateChange} 
			        		editorState={this.props.answerEditorState} 
			        		wrapperClassName={'card-answer-text-editor-wrapper-edit flex flex-col flex-grow min-h-0 my-reg'} 
			        		editorClassName={'text-editor overflow-auto'} 
			        		toolbarClassName={'text-editor-toolbar'}
			        		autoFocus />
			        	:
			        	<div className={s("flex-grow mb-reg flex flex-col flex-grow min-h-0")} onClick={() => this.enableAnswerEditor()} >
				        	<TextEditor 
				        		onEditorStateChange={this.onAnswerEditorStateChange} 
				        		editorState={this.props.answerEditorState} 
				        		wrapperClassName={'card-answer-text-editor-wrapper-inactive cursor-pointer flex flex-col flex-grow min-h-0'} 
				        		editorClassName={'text-editor card-answer-text-editor-view overflow-auto'} 
				        		toolbarClassName={s('')}
			        			toolbarHidden
			        			readOnly
			        			/>
		        		</div>
		        	}
		        	<Button 
		        		text={"Manage Message Display"}
		        		color={"transparent"}
		        		className={s("flex justify-between shadow-none")}
		        		icon={ <FaSlack /> } 
		        		onClick={() => this.props.openModal(this.props.id, THREAD_MODAL_EDIT)}
		        		iconLeft={false}
		        		underline
		        	/>

		        	        	
	        	</div>
	        	:
	        	<TextEditor 
	        		onEditorStateChange={this.onAnswerEditorStateChange} 
	        		editorState={this.props.answerEditorState} 
	        		wrapperClassName={'text-editor-wrapper flex-grow flex flex-col min-h-0'} 
	        		editorClassName={'text-editor card-answer-text-editor-view overflow-auto'} 
	        		toolbarClassName={''} 
	        		toolbarHidden
	        		readOnly
	        		/>

	        }
	        { !isEditing && 
	        	<Button
	        		text={"Thread"}
	        		onClick={() => this.props.openModal(this.props.id, THREAD_MODAL)}
	        		className={s("view-thread-button p-sm absolute text-xs mb-lg mr-2xl")}
	        		color={"secondary"}
	        		imgSrc={SlackIcon}
	        		imgClassName={s("slack-icon ml-sm")}
	        		iconLeft={false}
	        		underline={false}
	        	/>
	        }
        </div>
  	)
  }

  renderFooter = () => {
  	const { id, isEditing } = this.props;
  	return (
  		<div className={s("flex-shrink-0 min-h-0")} ref={element => this.footerRef = element}>
  			{
  			isEditing ?

  			<Button
  				text={"Save Changes"}
          color="primary"
  				onClick={() => this.saveCard(id)}
  				className={s("rounded-t-none p-lg")}
  				underline
  			/>
	        :
	        <div className={s("flex items-center justify-between bg-purple-light rounded-b-lg p-lg")}>     
	          <Button 
	          	text={"Edit Card"} 
              color="primary"
	          	icon={<MdModeEdit className={s("mr-sm")} />} 
	          	onClick={() => this.editCard(id)}
	          />
	          <div className={s("flex")}>
		          <Button 
		          	text={"Helpful"} 
		          	icon={<MdThumbUp className={s("mr-sm")}/>} 
		          	className={s("mr-reg")}
		          	color={"secondary"} />
		          <Button 
		          	icon={<MdBookmarkBorder />}
		          	color={"secondary"}
		          	/>
	          </div>
	        </div> 
	    	}
  		</div>

  	)
  }


  render() {
    const { id, isEditing, tags, sideDockOpen, createModalOpen, openCardSideDock, closeCardSideDock, openCardCreateModal, closeCardCreateModal } = this.props;
    const { isSideDockVisible } = this.state;

    return (
      <div className={s("flex-grow flex flex-col min-h-0 relative")}>
      	<div className={s("flex-grow flex flex-col min-h-0")}>
	        { this.renderHeader() }
	        { this.renderAnswer() }
	        { this.renderThreadModal() }
			<div onClick={() => openCardCreateModal(id)}> open modal </div>
        </div>
        { this.renderFooter() }
        <CardSideDock
          isVisible={sideDockOpen}
          onClose={() => closeCardSideDock(id)}
        />
        <CardCreateModal
          isOpen={createModalOpen}
          onRequestClose={() => closeCardCreateModal(id)}
          question="How do I delete this?"
        />
      </div>
    );
  }
}

CardContent.propTypes = {
  cardWidth: PropTypes.number.isRequired,
  cardHeight: PropTypes.number.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default CardContent;