import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdArrowDropDown, MdMoreHoriz, MdModeEdit, MdThumbUp, MdBookmarkBorder, MdPerson, MdAttachment } from "react-icons/md";
import { default as SlackIcon } from "../../../assets/images/icons/Slack_Mark.svg";

import { FaSlack } from "react-icons/fa";
import { bindActionCreators } from 'redux';
import { EditorState } from 'draft-js';
import { connect } from 'react-redux';
import * as cardActions from '../../../actions/cards';
import TextEditor from '../../editors/TextEditor';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import CheckBox from '../../common/CheckBox';

import CardStatus from '../CardStatus';
import CardTags from '../CardTags';
import { Resizable } from 're-resizable';
import Dropzone from '../../common/Dropzone';
import CardSideDock from '../CardSideDock';
import CardCreateModal from '../CardCreateModal';

import {
  CARD_STATUS_OPTIONS,
  CARD_DIMENSIONS,
  EDITOR_TYPE, MODAL_TYPE
} from '../../../utils/constants';

import style from './card-content.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
    ...state.cards.activeCard,
    cardsHeight: state.cards.cardsHeight,
    cardsWidth: state.cards.cardsWidth,
  }),
  dispatch => bindActionCreators({
    ...cardActions,
  }, dispatch)
)

class CardContent extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
    	footerHeight: 0,
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

  getAttribute = (attribute) => {
    const { isEditing, edits } = this.props;
    return isEditing ? edits[attribute] : this.props[attribute];
  }

  enableDescriptionEditor = () => {
    this.disableAnswerEditor();
    this.props.enableCardEditor(EDITOR_TYPE.DESCRIPTION);
    this.props.adjustCardDescriptionSectionHeight(this.getMaxDescriptionHeight());
  }

  disableDescriptionEditor = () => {
    this.props.disableCardEditor(EDITOR_TYPE.DESCRIPTION);
  }

  enableAnswerEditor = () => {
    this.disableDescriptionEditor();
    this.props.enableCardEditor(EDITOR_TYPE.ANSWER);
    this.props.adjustCardDescriptionSectionHeight(CARD_DIMENSIONS.MIN_QUESTION_HEIGHT);
  }

  disableAnswerEditor = () => {
    this.props.disableCardEditor(EDITOR_TYPE.ANSWER);
  }

  editCard = () => {
    this.props.editCard();
    this.enableAnswerEditor();
  }

  saveCard = () => {
    this.disableDescriptionEditor();
    this.props.saveCard();
  }

  saveMessages = () => {
    this.props.closeCardModal(MODAL_TYPE.THREAD);
  }

  onAnswerEditorStateChange = (editorState) => {
    this.props.updateCardAnswerEditor(editorState);
  }

  onDescriptionEditorStateChange = (editorState) => {
    this.props.updateCardDescriptionEditor(editorState);
  }

  getMaxDescriptionHeight = () => {
  	return this.props.cardsHeight - CARD_DIMENSIONS.TABS_HEIGHT - this.state.footerHeight - CARD_DIMENSIONS.MIN_ANSWER_HEIGHT;
  }

  toggleSelectedMessage = (i) => {
  	this.props.toggleCardSelectedMessage(i);
  }

  updateQuestionValue = (event) => {
  	this.props.updateCardQuestion(event.target.value);
  }

  renderHeader = () => {
  	const { id, isEditing, tags, attachments, sideDockOpen, openCardSideDock, closeCardSideDock, editorEnabled, descriptionSectionHeight, cardsWidth, addCardAttachments } = this.props;
    const currAttachments = this.getAttribute('attachments');

    return (
  		<Resizable
        className={s("bg-purple-light py-sm px-2xl min-h-0 flex-shrink-0 flex flex-col")}
        defaultSize={{ height: CARD_DIMENSIONS.MIN_QUESTION_HEIGHT }}
        minHeight={ CARD_DIMENSIONS.MIN_QUESTION_HEIGHT }
        maxHeight={ this.getMaxDescriptionHeight()}
        size={{ height: descriptionSectionHeight }}
        onResizeStop={(e, direction, ref, d) => {
        	this.props.adjustCardDescriptionSectionHeight(descriptionSectionHeight + d.height);
        }}
        enable={{ top:false, right:false, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false }}
      >
        <strong className={s("text-xs text-purple-reg pt-xs pb-sm flex items-center justify-between opacity-75")}>
          <div>2 Days Ago</div>
          <div className={s("flex items-center")}>
            <button onClick={openCardSideDock}>
            	<MdMoreHoriz />
          	</button>
          </div>
        </strong>
        { isEditing ?
        	<input
          	placeholder="Question"
          	className={s("w-full")}
          	value={this.props.edits.question}
          	onChange={this.updateQuestionValue}
        	/> :
        	<div className={s("text-2xl font-semibold")}>{this.props.question} ({id})</div>
        }
        { isEditing ?
          (<div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
	        	{ editorEnabled[EDITOR_TYPE.DESCRIPTION] ?
          		<TextEditor 
          			onEditorStateChange={this.onDescriptionEditorStateChange} 
          			editorState={this.props.edits.descriptionEditorState} 
	        			wrapperClassName={s('card-description-text-editor-wrapper-edit flex flex-col flex-grow min-h-0 my-reg')} 
	        			editorClassName={s('text-editor overflow-auto bg-white')} 
	        			toolbarClassName={s('text-editor-toolbar')}
	        			autoFocus
              /> :
 					    <div className={s("flex-grow my-reg flex flex-col flex-grow min-h-0")} onClick={() => this.enableDescriptionEditor()} >
            		<TextEditor
            			onClick={() => this.enableDescriptionEditor()}
            			onEditorStateChange={this.onDescriptionEditorStateChange} 
            			editorState={this.props.edits.descriptionEditorState}
	        				wrapperClassName={s('card-description-text-editor-wrapper-inactive cursor-pointer flex flex-col flex-grow min-h-0')} 
	        				editorClassName={s('text-editor card-description-text-editor-view overflow-auto')} 
	        				toolbarClassName={s('')}
	        				toolbarHidden
	        				readOnly
                />
        			</div>
        		}
        		<div className={s("flex justify-between")}>
              { currAttachments.length !== 0 &&
                <div className={s("flex items-center")}>
                  <div className={s("flex text-purple-reg text-sm cursor-pointer underline-border border-purple-gray-20 items-center")} onClick={openCardSideDock}> 
                    <MdAttachment className={s("mr-sm")} />
                    <div> {currAttachments.length} Attachments</div>
                  </div>
                </div>
              }
	        		<Dropzone className={s("ml-auto")} onDrop={addCardAttachments}>
                <p className={s("m-0 text-sm text-purple-reg p-sm")}>Drag Files Here or Click to Add</p>
              </Dropzone>
				    </div>
      		</div>) : 
      		<TextEditor 
      			editorState={this.props.descriptionEditorState} 
      			wrapperClassName={s('text-editor-wrapper card-description-text-editor-wrapper-view flex-grow flex flex-col min-h-0 my-reg')} 
      			editorClassName={s('text-editor card-description-text-editor-view overflow-auto')} 
      			toolbarClassName={''} 
      			toolbarHidden
      			readOnly
          />
        }
        { !isEditing &&
          <div className={s("flex items-center justify-between")}>
            <CardTags
              tags={tags}
              onTagClick={openCardSideDock}
              maxWidth={cardsWidth * 0.5}
            />  
            <div className={s("flex flex-shrink-0 z-10 bg-purple-light ml-sm")}>
          	  <Button 
          	  	text={"2"}
          	  	iconLeft={false}
          	  	icon={<MdAttachment className={s("ml-xs")} />}
          	  	color={"secondary"}
          	  	className={s("py-sm px-reg rounded-full")}
                onClick={openCardSideDock}
          	  />
              <div className={s("vertical-separator")} />
              <CardStatus cardStatus={this.props.cardStatus} />
            </div>
          </div>
	      }
		  </Resizable>
  	)
  }

  closeThreadModal = () => {
    const { closeCardModal, cancelEditCardMessages } = this.props;
    closeCardModal(MODAL_TYPE.THREAD);
    cancelEditCardMessages();
  }

  renderThreadModal = () => {
  	const { id, isEditing, modalOpen, closeCardModal} = this.props;
  	return (
  		<Modal 
    		isOpen={modalOpen[MODAL_TYPE.THREAD]} 
    		onRequestClose={this.closeThreadModal}
    		headerClassName={s("bg-purple-light rounded-lg")}
    		bodyClassName={s("overflow-none flex flex-col rounded-b-lg")}
    		className={s("bg-purple-light")}
    		overlayClassName={s("rounded-b-lg")}
    		shouldCloseOnOutsideClick
    		title={isEditing ? "Unselect messages you do not want shown" : "View Slack Thread"}
      >
  			{this.renderMessageList()}
    		{ isEditing &&
    			<Button
    				onClick={() => closeCardModal(MODAL_TYPE.THREAD)}
	        	color={"primary"}
	        	text={"Save"}
	        	className={s("rounded-t-none")}
        	/>
    	  }	
  	  </Modal>
  	)
  }

  renderMessageList = () => {
  	const { isEditing, messages, edits } = this.props;
    const currMessages = isEditing ? edits.messages : messages;
  	return (
  		<div className={s("message-manager-container bg-purple-light mx-lg mb-lg rounded-lg flex-grow overflow-auto")}>
		  	{currMessages.map(({ senderName, time, message, selected }, i) => ((isEditing || selected) &&
  				<div className={s(`flex p-reg   ${ i % 2 === 0 ? '' : 'bg-purple-gray-10' } `)}>
  					<div className={s("message-photo-container rounded-lg bg-purple-reg flex-shrink-0 text-white flex justify-center mr-reg items-center shadow-md")}>
  						<MdPerson />
  					</div>
  					<div className={s("flex flex-col flex-grow")}> 
  						<div className={s("flex items-end")}>
  							<div className={s("text-sm font-semibold mr-reg")}> { senderName } </div>
  							<div className={s("text-sm text-gray-dark")}> { time } </div>
  						</div>
  						<div className={s("mt-sm text-sm")}> {message} </div>
  					</div>
  					{isEditing &&
  						<CheckBox 
  							isSelected={selected} 
  							toggleCheckbox={() => this.toggleSelectedMessage(i)}
  							className={s("flex-shrink-0 margin-xs")}
              />
  					}
  				</div>
	    	))}
    	</div>
    )
  }

  renderAnswer = () => {
  	const { isEditing, editorEnabled, selectedMessages } = this.props;
  	return (
  		<div className={s('p-2xl flex-grow min-h-0 flex flex-col min-h-0 relative')}>
        { isEditing ?
        	(<div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
        	  { editorEnabled[EDITOR_TYPE.ANSWER] ?
		        	<TextEditor 
		        		onEditorStateChange={this.onAnswerEditorStateChange} 
		        		editorState={this.props.edits.answerEditorState} 
		        		wrapperClassName={'card-answer-text-editor-wrapper-edit flex flex-col flex-grow min-h-0 my-reg'} 
		        		editorClassName={'text-editor overflow-auto'} 
		        		toolbarClassName={'text-editor-toolbar'}
		        		autoFocus
              /> :
		        	<div className={s("flex-grow mb-reg flex flex-col flex-grow min-h-0")} onClick={() => this.enableAnswerEditor()} >
			        	<TextEditor 
			        		onEditorStateChange={this.onAnswerEditorStateChange} 
			        		editorState={this.props.edits.answerEditorState} 
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
	        		onClick={() => this.props.openCardModal(MODAL_TYPE.THREAD)}
	        		iconLeft={false}
	        		underline
	        	/>       	
        	</div>) :
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
        		onClick={() => this.props.openCardModal(MODAL_TYPE.THREAD)}
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
  	const { id, isEditing, cardStatus, openCardModal } = this.props;
  	return (
  		<div className={s("flex-shrink-0 min-h-0")} ref={element => this.footerRef = element}>
  			{ isEditing ?
  				(cardStatus === CARD_STATUS_OPTIONS.NOT_DOCUMENTED ?
    				<Button
  	  				text={"Add to Knowledge Base"}
          		color="primary"
  	  				onClick={() => openCardModal(MODAL_TYPE.CREATE)}
  	  				className={s("rounded-t-none p-lg")}
  	  				underline
	  				/> :
	  			  <Button
  	  				text={"Save updates"}
          		color="primary"
  	  				onClick={this.saveCard}
  	  				className={s("rounded-t-none p-lg")}
  	  				underline
	  				/>
	        ) :
	        <div className={s("flex items-center justify-between bg-purple-light rounded-b-lg p-lg")}>     
	          <div className={s("flex")}>
		          <Button 
		          	text={"Edit Card"} 
	              	color="primary"
		          	icon={<MdModeEdit className={s("mr-sm")} />} 
		          	onClick={this.editCard}
		          />
		          { this.props.cardStatus === CARD_STATUS_OPTIONS.OUT_OF_DATE &&
	          		<Button 
			          	text={"Mark as Up-to-Date"} 
		              	color="secondary"
		              	className={s("ml-reg text-green-reg")}
		              	underline={false}
			          	icon={<MdCheck className={s("mr-sm")} />} 
			          	onClick={() => this.props.updateCardStatus(CARD_STATUS_OPTIONS.UP_TO_DATE)}
			          />
		      		}
		      		{ this.props.cardStatus === CARD_STATUS_OPTIONS.NEEDS_VERIFICATION &&
	          		<Button 
			          	text={"Mark as Verified"} 
		              	color="secondary"
		              	className={s("ml-reg text-green-reg")}
		              	underline={false}
			          	icon={<MdCheck className={s("mr-sm")} />} 
			          	onClick={() => this.props.updateCardStatus(CARD_STATUS_OPTIONS.UP_TO_DATE)}
			          />
		      		}
	          </div>
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
    const { id, isEditing, tags, sideDockOpen, closeCardModal, modalOpen, openCardSideDock, closeCardSideDock } = this.props;

    return (
      <div className={s("flex-grow flex flex-col min-h-0 relative")}>
      	<div className={s("flex-grow flex flex-col min-h-0")}>
	        { this.renderHeader() }
	        { this.renderAnswer() }
	        { this.renderThreadModal() }
        </div>
        { this.renderFooter() }
        <CardSideDock />
        <CardCreateModal />
      </div>
    );
  }
}

export default CardContent;