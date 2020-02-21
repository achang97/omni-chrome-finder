import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdArrowDropDown, MdMoreHoriz, MdModeEdit, MdThumbUp, MdBookmarkBorder, MdPerson, MdAttachment } from "react-icons/md";
import Timeago from 'react-timeago';
import { default as SlackIcon } from "../../../assets/images/icons/Slack_Mark.svg";

import { FaSlack } from "react-icons/fa";
import { EditorState } from 'draft-js';
import TextEditor from '../../editors/TextEditor';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import CheckBox from '../../common/CheckBox';
import Loader from '../../common/Loader';

import CardStatus from '../CardStatus';
import CardTags from '../CardTags';
import { Resizable } from 're-resizable';
import Dropzone from '../../common/Dropzone';
import CardSideDock from '../CardSideDock';
import CardCreateModal from '../CardCreateModal';
import CardConfirmModal from '../CardConfirmModal';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as cardActions from '../../../actions/cards';

import { isValidCard, toggleUpvotes } from '../../../utils/cardHelpers';
import {
  CARD_STATUS,
  CARD_DIMENSIONS,
  EDITOR_TYPE, 
  MODAL_TYPE,
} from '../../../utils/constants';

import style from './card-content.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
    ownUserId: state.auth.user._id,

    ...state.cards.activeCard,
    cardsHeight: state.cards.cardsHeight,
    cardsWidth: state.cards.cardsWidth,
    activeCardIndex: state.cards.activeCardIndex,
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
    if (!this.props.hasLoaded) {
      this.loadCard();
    }

    if (this.footerRef) {
      this.setState({ footerHeight: this.footerRef.clientHeight });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id && !this.props.hasLoaded && !this.props.isGettingCard) {
      this.loadCard();
    }

  	if (this.footerRef && prevState.footerHeight !== this.footerRef.clientHeight) {
  		this.setState({ footerHeight: this.footerRef.clientHeight });
  	}
  }

  loadCard = () => {
    this.props.requestGetCard();
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
    const { openCardModal, cardStatus } = this.props;
    
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

  cardStatusOnClick = (status) => {
    const { openCardModal } = this.props;

    switch (status) {
      case CARD_STATUS.UP_TO_DATE: {
        openCardModal(MODAL_TYPE.CONFIRM_UP_TO_DATE);
        break;
      }
      case CARD_STATUS.OUT_OF_DATE: {
        openCardModal(MODAL_TYPE.CONFIRM_OUT_OF_DATE);
        break;
      }
    }
  }

  renderHeader = () => {
  	const { isEditing, tags, createdAt, attachments, sideDockOpen, openCardSideDock, closeCardSideDock, editorEnabled, descriptionSectionHeight, cardsWidth, addCardAttachments } = this.props;
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
          <div> <Timeago date={createdAt} live={false} /> </div>
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
        	<div className={s("text-2xl font-semibold")}>{this.props.question}</div>
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
              isEditable={false}
            />  
            <div className={s("flex flex-shrink-0 z-10 bg-purple-light ml-sm")}>
          	  <Button 
          	  	text={attachments.length}
          	  	iconLeft={false}
          	  	icon={<MdAttachment className={s("ml-xs")} />}
          	  	color={"secondary"}
          	  	className={s("py-sm px-reg rounded-full")}
                onClick={openCardSideDock}
          	  />
              <div className={s("vertical-separator")} />
              <CardStatus
                cardStatus={this.props.cardStatus}
                isActionable
                onDropdownOptionClick={this.cardStatusOnClick}
              />
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
  				<div key={i} className={s(`flex p-reg   ${ i % 2 === 0 ? '' : 'bg-purple-gray-10' } `)}>
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
  	const { isEditing, editorEnabled, selectedMessages, messages } = this.props;
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
            { messages.length !== 0 &&
              <Button 
                text={"Manage Message Display"}
                color={"transparent"}
                className={s("flex justify-between shadow-none")}
                icon={ <FaSlack /> } 
                onClick={() => this.props.openCardModal(MODAL_TYPE.THREAD)}
                iconLeft={false}
                underline
              />   
            }
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
        { !isEditing && messages.length !== 0 &&
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

  updateCardStatus = (newStatus) => {
    const { openCardModal } = this.props;
    if (newStatus === CARD_STATUS.UP_TO_DATE) {
      openCardModal(MODAL_TYPE.CONFIRM_UP_TO_DATE);
    }
  }

  renderFooter = () => {
  	const {
      isUpdatingCard, isEditing, cardStatus, openCardModal, question, edits, requestUpdateCard, modalOpen,
      upvotes, ownUserId, isTogglingUpvote, requestToggleUpvote,
    } = this.props;
    
    const hasUpvoted = upvotes.some(_id => _id === ownUserId);

  	return (
  		<div className={s("flex-shrink-0 min-h-0")} ref={element => this.footerRef = element}>
  			{ isEditing ?
  				(cardStatus === CARD_STATUS.NOT_DOCUMENTED ?
    				<Button
  	  				text={"Add to Knowledge Base"}
          		color="primary"
  	  				onClick={() => openCardModal(MODAL_TYPE.CREATE)}
  	  				className={s("rounded-t-none p-lg")}
              disabled={edits.question === '' || !edits.answerEditorState.getCurrentContent().hasText()}
  	  				underline
	  				/> :
	  			  <Button
  	  				text={"Save Updates"}
          		color="primary"
  	  				onClick={requestUpdateCard}
              iconLeft={false}
              icon={isUpdatingCard && !modalOpen[MODAL_TYPE.CONFIRM_CLOSE] ? <Loader className={s("ml-sm")} size="sm" color="white" /> : null}
  	  				className={s("rounded-t-none p-lg")}
              disabled={!isValidCard(edits) || isUpdatingCard}
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
		          { (this.props.cardStatus === CARD_STATUS.OUT_OF_DATE || this.props.cardStatus === CARD_STATUS.NEEDS_VERIFICATION)  &&
	          		<Button 
			          	text={"Mark as Up-to-Date"} 
		              color="secondary"
		              className={s("ml-reg text-green-reg bg-green-xlight")}
		              underline={false}
			          	icon={<MdCheck className={s("mr-sm")} />} 
			          	onClick={() => this.updateCardStatus(CARD_STATUS.UP_TO_DATE)}
			          />
		      		}
	          </div>
	          <div className={s("flex")}>
		          <Button 
		          	text={`Helpful${upvotes.length !== 0 ? ` (${upvotes.length})` : ''}`} 
		          	icon={<MdThumbUp className={s("mr-sm")} color={hasUpvoted ? 'gold' : ''} />} 
		          	className={s("mr-reg")}
		          	color={"secondary"}
                disabled={isTogglingUpvote}
                onClick={() => requestToggleUpvote(toggleUpvotes(upvotes, ownUserId))}
              />
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

  confirmCloseModalUndocumentedPrimary = () => {
    const { closeCardModal, closeCard, activeCardIndex } = this.props;
    closeCardModal(MODAL_TYPE.CONFIRM_CLOSE);
    closeCard(activeCardIndex);
  }

  confirmUpToDateModalPrimary = () => {
    const { closeCardModal, updateCardStatus } = this.props;
    closeCardModal(MODAL_TYPE.CONFIRM_UP_TO_DATE);
    updateCardStatus(CARD_STATUS.UP_TO_DATE);
  }

  confirmUpToDateSaveModalPrimary = () => {
    const { closeCardModal, updateCardStatus } = this.props;
    closeCardModal(MODAL_TYPE.CONFIRM_UP_TO_DATE_SAVE);
    updateCardStatus(CARD_STATUS.UP_TO_DATE);
  }

  getModalLoaderProps = (loaderCondition, defaultIcon) => {
    return {
      iconLeft: false,
      icon: loaderCondition ? <Loader className={s("ml-sm")} size="sm" color="white" /> : defaultIcon,
      disabled: loaderCondition,      
    }
  }

  renderModals = () => {
    const {
      closeCardModal, closeCard, activeCardIndex,
      requestDeleteCard, deleteError, isDeletingCard, 
      requestUpdateCard, updateError, isUpdatingCard,
      requestMarkUpToDate, requestMarkOutOfDate, isMarkingStatus, markStatusError,
    } = this.props;

    return (
      <React.Fragment>
        <CardConfirmModal
          modalType={MODAL_TYPE.CONFIRM_CLOSE} 
          title="Save Changes"
          description="You have unsaved changes on this card. Would you like to save your changes before closing?"
          primaryButtonProps={{
            text: "Save",
            onClick: () => requestUpdateCard(true),
            ...this.getModalLoaderProps(isUpdatingCard)
          }}
          secondaryButtonProps={{
            text: "No",
            onClick: () => closeCard(activeCardIndex)
          }}
        />
        <CardConfirmModal
          modalType={MODAL_TYPE.CONFIRM_CLOSE_UNDOCUMENTED} 
          title="Close Card"
          description="You have not yet documented this card. All changes will be lost upon closing. Are you sure you want to close this card?"
          primaryButtonProps={{
            text: "Close Card",
            onClick: this.confirmCloseModalUndocumentedPrimary
          }}
        />
        <CardConfirmModal
          modalType={MODAL_TYPE.CONFIRM_OUT_OF_DATE} 
          title="Are you sure this card needs to be updated?"
          body={
            <div>
              <div className={s("text-xs text-gray-light mb-xs")}> Reason for Update </div>
              <textarea
                type="textarea"
                className={s("w-full")}
                placeholder="Please explain why this card is out of date."
              />
            </div>
          }
          error={markStatusError}
          primaryButtonProps={{
            text: "Yes",
            onClick: requestMarkOutOfDate,
            ...this.getModalLoaderProps(isMarkingStatus)
          }}
        />
        <CardConfirmModal
          modalType={MODAL_TYPE.CONFIRM_UP_TO_DATE} 
          title="Confirm Up-to-Date"
          description="Are you sure this card is now Up to Date?"
          error={markStatusError}
          primaryButtonProps={{
            text: "Confirm and send to owner",
            onClick: requestMarkUpToDate,
            ...this.getModalLoaderProps(isMarkingStatus)
          }}
        />
        <CardConfirmModal
          modalType={MODAL_TYPE.CONFIRM_UP_TO_DATE_SAVE} 
          title="Card Update"
          description="This card was originally not labeled as up to date. Would you like to mark it as Up to Date?"
          primaryButtonProps={{
            text: "Yes",
            onClick: () => this.confirmUpToDateSaveModalPrimary()
          }}
        />
        <CardConfirmModal
          modalType={MODAL_TYPE.ERROR_UPDATE} 
          title="Update Error"
          description={`${updateError} Please try again.`}
          primaryButtonProps={{
            text: "Ok",
            onClick: () => closeCardModal(MODAL_TYPE.ERROR_UPDATE)
          }}
          showSecondary={false}
        />
        <CardConfirmModal
          modalType={MODAL_TYPE.ERROR_UPDATE_CLOSE} 
          title="Update Error"
          description={`${updateError} Would you still like to close the card?`}
          primaryButtonProps={{
            text: "Yes",
            onClick: () => closeCard(activeCardIndex)
          }}
        />
        <CardConfirmModal
          modalType={MODAL_TYPE.ERROR_DELETE} 
          title="Deletion Error"
          description={`${deleteError} Please try again.`}
          primaryButtonProps={{
            text: "Ok",
            onClick: () => closeCardModal(MODAL_TYPE.ERROR_DELETE),
          }}
          showSecondary={false}
        />
        <CardConfirmModal
          modalType={MODAL_TYPE.CONFIRM_DELETE} 
          title="Confirm Deletion"
          description="Deletion is permanent. All information will be lost upon closing. Are you sure you want to delete this card?"
          primaryButtonProps={{
            text: "Delete",
            onClick: () => requestDeleteCard(activeCardIndex),
            ...this.getModalLoaderProps(isDeletingCard)
          }}
        />
      </React.Fragment>
    );
  }

  render() {
    const {
      hasLoaded, isGettingCard, getError,
      isEditing, tags, sideDockOpen, closeCardModal, modalOpen, openCardSideDock, closeCardSideDock, cardStatus
    } = this.props;
    
    if (!hasLoaded && getError) {
      return (
        <div className={s("flex flex-col h-full justify-center items-center bg-purple-light")}>
          <div className={s("mb-sm")}> Something went wrong! </div>
          <Button
            color="primary"
            text="Reload Card"
            onClick={this.loadCard}
          />
        </div>
      );      
    }

    if (!hasLoaded || isGettingCard) {
      return (
        <div className={s("flex flex-col h-full justify-center bg-purple-light")}>
          <Loader />
        </div>
      );
    }

    return (
      <div className={s("flex-grow flex flex-col min-h-0 relative")}>
      	<div className={s("flex-grow flex flex-col min-h-0")}>
	        { this.renderHeader() }
	        { this.renderAnswer() }
	        { this.renderThreadModal() }
          { this.renderModals() }
        </div>
        { this.renderFooter() }
        <CardSideDock />
        <CardCreateModal />
      </div>
    );
  }
}

export default CardContent;