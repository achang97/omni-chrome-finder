import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdArrowDropDown, MdMoreHoriz, MdModeEdit, MdThumbUp, MdBookmarkBorder } from "react-icons/md";

import { bindActionCreators } from 'redux';
import { EditorState } from 'draft-js';
import { connect } from 'react-redux';
import { editCard, saveCard } from '../../../actions/display';
import TextEditor from '../../editors/TextEditor';
import Button from '../../common/Button';
import CardStatus from '../CardStatus';
import { Resizable } from 're-resizable';


import style from './card-content.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const editIcon = require('../../../assets/images/icons/edit.svg');
const TABS_HEIGHT = 51;
const FOOTER_HEIGHT = 78;
const MIN_ANSWER_HEIGHT = 165;
const MIN_QUESTION_HEIGHT = 165;

@connect(
  state => ({

  }),
  dispatch => bindActionCreators({
    editCard,
    saveCard,
  }, dispatch)
)

class CardContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	answerEditorState: EditorState.createEmpty(),
    	descriptionEditorState: EditorState.createEmpty(),
    	descriptionEditorEnabled: false,
    	answerEditorEnabled: false,
    }
  }

  enableDescriptionEditor = () => {
    this.disableAnswerEditor();
    this.setState({ descriptionEditorEnabled: true });
  }

  disableDescriptionEditor = () => {
    this.setState({ descriptionEditorEnabled: false });
  }

  enableAnswerEditor = () => {
    this.disableDescriptionEditor();
    this.setState({ answerEditorEnabled: true });
  }

  disableAnswerEditor = () => {
    this.setState({ answerEditorEnabled: false });
  }

  editCard = (id) => {
  	this.props.editCard(id);
  	this.enableAnswerEditor();
  }

  saveCard = (id) => {
    this.setState({ descriptionEditorEnabled: false });
    this.props.saveCard(id, this.state.answerEditorState, this.state.descriptionEditorState);
  }


  onAnswerEditorStateChange = (editorState) => {
    this.setState({answerEditorState : editorState });
  }

  onDescriptionEditorStateChange = (editorState) => {
    this.setState({descriptionEditorState : editorState });
  }

  renderFooter = () => {
  	const { id, isEditing } = this.props;
  	return (
  		<div className={s("flex-shrink-0 min-h-0")}>
  			{
  			isEditing ?

  			<Button
  				text={"Save Changes"}
  				onClick={() => this.saveCard(id)}
  				buttonClassName={s("rounded-t-none p-lg")}
  				underline
  			/>

  			
	        :
	        <div className={s("flex items-center justify-between bg-purple-light rounded-b-lg p-lg")}>     
	          <Button 
	          	text={"Edit Card"} 
	          	icon={<MdModeEdit className={s("mr-sm")} />} 
	          	onClick={() => this.editCard(id)}
	          />
	          <div className={s("flex")}>
		          <Button 
		          	text={"Helpful"} 
		          	icon={<MdThumbUp className={s("mr-sm")}/>} 
		          	buttonClassName={s("mr-reg")}
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

  componentDidMount() {
  	console.log(this.divRef.clientHeight);
  }

  render() {
    const { id, isEditing, answerEditorState, tags } = this.props;
    const { descriptionEditorEnabled, answerEditorEnabled } = this.state;
    return (
      <div className={s("flex-grow flex flex-col min-h-0")}>
      	<div className={s("flex-grow flex flex-col min-h-0")}>
	        {/*<div className={s("bg-purple-light py-sm px-2xl min-h-0 overflow-scroll flex-shrink-0 max-height-165")}>*/}
	        <Resizable
	            className={s("bg-purple-light py-sm px-2xl min-h-0 flex-shrink-0 flex flex-col")}
	            defaultSize={{ height: MIN_QUESTION_HEIGHT }}
	            minHeight={ MIN_QUESTION_HEIGHT }
	            maxHeight={ this.props.cardHeight - TABS_HEIGHT - FOOTER_HEIGHT - MIN_ANSWER_HEIGHT }
	            enable={{ top:false, right:false, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false }}
	        >
	          <strong className={s("text-xs text-purple-reg pt-xs pb-sm flex items-center justify-between opacity-75")}>
	            <div>2 Days Ago</div>
	            <div className={s("flex items-center")}>
	              <MdMoreHoriz />
            	</div>
	          </strong>
	          <div className={s("text-2xl font-semibold")}>How do I delete a user? ({id})</div>
	          { isEditing ?

	            	
	            		descriptionEditorEnabled ?
	            		<TextEditor 
	            			onEditorStateChange={this.onDescriptionEditorStateChange} 
	            			editorState={this.state.descriptionEditorState} 
		        			wrapperClassName={s('card-description-text-editor-wrapper-edit')} 
		        			editorClassName={s('text-editor')} 
		        			toolbarClassName={s('text-editor-toolbar')}
		        			autoFocus />
	 					:
	 					<div onClick={() => this.enableDescriptionEditor()} >
		            		<TextEditor
		            			onEditorStateChange={this.onDescriptionEditorStateChange} 
		            			editorState={this.state.descriptionEditorState}
		        				wrapperClassName={s('card-description-text-editor-wrapper-inactive cursor-pointer')} 
		        				editorClassName={s('text-editor card-description-text-editor-view')} 
		        				toolbarClassName={s('')}
		        				toolbarHidden
		        				readOnly/>
	        			</div>
	        		: 
	        		<TextEditor 
	        			onEditorStateChange={this.onDescriptionEditorStateChange} 
	        			editorState={this.state.descriptionEditorState} 
	        			wrapperClassName={s('text-editor-wrapper card-description-text-editor-wrapper-view overflow-scroll flex-grow')} 
	        			editorClassName={s('text-editor card-description-text-editor-view')} 
	        			toolbarClassName={''} 
	        			toolbarHidden
	        			readOnly/>
	            }

	            { !isEditing &&
		            <div className={s("flex items-center justify-between")}>
		              <div className={s("flex items-center")}>
		                { ['Customer Request Actions', 'Onboarding'].map(tag => (
		                  <div key={tag} className={s("flex items-center p-xs mr-xs bg-purple-gray-10 text-purple-reg rounded-full font-semibold text-xs")}>
		                    <div className={s("mr-xs")}>Customer Request Actions</div>
		                  </div> 
		                ))}
		              </div>
		              <div className={s("flex items-center p-sm bg-green-xlight text-green-reg rounded-lg font-semibold text-xs")}> 
		                <MdCheck className={s("mr-xs")} />
		                <div>Up To Date</div>
		                <MdArrowDropDown />
		              </div>
		            </div>
				}
			</Resizable>
	        {/*</div>*/}
	        <div ref={element => this.divRef = element} className={s('p-2xl flex-grow min-h-0 overflow-scroll')}>
		        { isEditing ?

		        	answerEditorEnabled ?
			        	<TextEditor 
			        		onEditorStateChange={this.onAnswerEditorStateChange} 
			        		editorState={this.state.answerEditorState} 
			        		wrapperClassName={'card-answer-text-editor-wrapper-edit'} 
			        		editorClassName={'text-editor'} 
			        		toolbarClassName={'text-editor-toolbar'}
			        		autoFocus />
			        	:
			        	<div onClick={() => this.enableAnswerEditor()} >
				        	<TextEditor 
				        		onEditorStateChange={this.onAnswerEditorStateChange} 
				        		editorState={this.state.answerEditorState} 
				        		wrapperClassName={'card-answer-text-editor-wrapper-inactive cursor-pointer'} 
				        		editorClassName={'text-editor card-answer-text-editor-view'} 
				        		toolbarClassName={s('')}
			        			toolbarHidden
			        			readOnly
			        			/>
		        		</div>
		        	:
		        	<TextEditor 
		        		onEditorStateChange={this.onAnswerEditorStateChange} 
		        		editorState={this.state.answerEditorState} 
		        		wrapperClassName={'text-editor-wrapper'} 
		        		editorClassName={'text-editor card-answer-text-editor-view'} 
		        		toolbarClassName={''} 
		        		toolbarHidden
		        		readOnly
		        		/>
		        }
	        </div>
        </div>
        { this.renderFooter() }
      </div>
    );
  }
}

CardContent.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default CardContent;