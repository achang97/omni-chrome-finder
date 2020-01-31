import React, { Component, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdArrowDropDown, MdMoreHoriz, MdModeEdit, MdThumbUp, MdBookmarkBorder, MdPerson, MdAttachment } from "react-icons/md";
import { FaSlack } from "react-icons/fa";

import { bindActionCreators } from 'redux';
import { EditorState } from 'draft-js';
import { connect } from 'react-redux';
import { editCard, saveCard } from '../../../actions/display';
import TextEditor from '../../editors/TextEditor';
import Button from '../../common/Button';
import CardStatus from '../CardStatus';
import { Resizable } from 're-resizable';
import {useDropzone} from 'react-dropzone';
import Dropzone from 'react-dropzone'

import style from './card-content.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const TABS_HEIGHT = 51;
const MIN_ANSWER_HEIGHT = 180;
const MIN_QUESTION_HEIGHT = 180;

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
    	footerHeight: 0,
    	descriptionSectionHeight: MIN_QUESTION_HEIGHT,
    	showMessageManager: false,
    };
  }

  componentDidMount() {
  	this.setState({ footerHeight: this.footerRef.clientHeight })
  	console.log(this.state.footerHeight);
  }

  componentDidUpdate(prevProps, prevState) {
  	if (prevState.footerHeight !== this.footerRef.clientHeight) {
  		this.setState({ footerHeight: this.footerRef.clientHeight });
  	}
  }

  enableDescriptionEditor = () => {
    this.disableAnswerEditor();
    this.setState({ descriptionEditorEnabled: true });
    this.setState({ descriptionSectionHeight: this.getMaxDescriptionHeight()});
  }

  disableDescriptionEditor = () => {
    this.setState({ descriptionEditorEnabled: false });
  }

  enableAnswerEditor = () => {
    this.disableDescriptionEditor();
    this.setState({ answerEditorEnabled: true });
    this.setState({ descriptionSectionHeight: MIN_QUESTION_HEIGHT });
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

  getMaxDescriptionHeight = () => {
  	return this.props.cardHeight - TABS_HEIGHT - this.state.footerHeight - MIN_ANSWER_HEIGHT;
  }

  toggleMessageManager = () => {
  	this.setState({ showMessageManager: !this.state.showMessageManager });
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
  	const { id, isEditing, tags } = this.props;
    const { descriptionEditorEnabled } = this.state;
    
  	return (
  		<Resizable
            className={s("bg-purple-light py-sm px-2xl min-h-0 flex-shrink-0 flex flex-col")}
            defaultSize={{ height: MIN_QUESTION_HEIGHT }}
            minHeight={ MIN_QUESTION_HEIGHT }
            maxHeight={ this.getMaxDescriptionHeight() }
            size={{ height: this.state.descriptionSectionHeight }}
            onResizeStop={(e, direction, ref, d) => {
              this.setState({
                descriptionSectionHeight: this.state.descriptionSectionHeight + d.height,
              });
            }}
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

            	<div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
		        	{
	            		descriptionEditorEnabled ?
	            		<TextEditor 
	            			onEditorStateChange={this.onDescriptionEditorStateChange} 
	            			editorState={this.state.descriptionEditorState} 
		        			wrapperClassName={s('card-description-text-editor-wrapper-edit flex flex-col flex-grow min-h-0 my-reg')} 
		        			editorClassName={s('text-editor overflow-auto bg-white')} 
		        			toolbarClassName={s('text-editor-toolbar')}
		        			autoFocus />
	 					:
	 					<div className={s("flex-grow my-reg flex flex-col flex-grow min-h-0")} onClick={() => this.enableDescriptionEditor()} >
		            		<TextEditor
		            			onClick={() => this.enableDescriptionEditor()}
		            			onEditorStateChange={this.onDescriptionEditorStateChange} 
		            			editorState={this.state.descriptionEditorState}
		        				wrapperClassName={s('card-description-text-editor-wrapper-inactive cursor-pointer flex flex-col flex-grow min-h-0')} 
		        				editorClassName={s('text-editor card-description-text-editor-view overflow-auto')} 
		        				toolbarClassName={s('')}
		        				toolbarHidden
		        				readOnly/>
	        			</div>
	        		}
	        		<div className={s("flex justify-between")}>
		        		<div className={s("flex text-purple-reg text-sm cursor-pointer element-underline items-center")}> 
		        			<MdAttachment className={s("mr-sm")} />
		        			<div >3 Attachments</div>
		        		</div>
		        		<StyledDropzone />
					</div>
        		</div>
        		: 
        		<TextEditor 
        			onEditorStateChange={this.onDescriptionEditorStateChange} 
        			editorState={this.state.descriptionEditorState} 
        			wrapperClassName={s('text-editor-wrapper card-description-text-editor-wrapper-view flex-grow flex flex-col min-h-0 my-reg')} 
        			editorClassName={s('text-editor card-description-text-editor-view overflow-auto')} 
        			toolbarClassName={''} 
        			toolbarHidden
        			readOnly/>
            }

            { !isEditing &&
	            <div className={s("flex items-center justify-between")}>
	              <div className={s("flex items-center")}>
	                { ['Customer Request Actions', 'Onboarding'].map(tag => (
	                  <div key={tag} className={s("flex items-center padding-6 mr-xs bg-purple-gray-10 text-purple-reg rounded-full font-semibold text-xs")}>
	                    <div className={s("mr-xs")}>Customer Request Actions</div>
	                  </div> 
	                ))}
	              </div>
	              <div className={s("flex")}>
	              	  <Button 
	              	  	text={"2"}
	              	  	iconLeft={false}
	              	  	icon={<MdAttachment className={s("ml-xs")} />}
	              	  	color={"secondary"}
	              	  	className={s("py-sm px-reg rounded-full")}
	              	  />
	              	  <div className={s("width-1 bg-gray-xlight mx-sm")} ></div>
		              <div className={s("flex items-center shadow-md p-sm bg-green-xlight text-green-reg rounded-lg font-semibold text-xs")}> 
		                <MdCheck className={s("mr-xs")} />
		                <div>Up To Date</div>
		                <MdArrowDropDown />
		              </div>
	              </div>
	            </div>
			}
		</Resizable>
  	)
  }

  renderAnswer = () => {
  	const { isEditing  } = this.props;
    const { answerEditorEnabled } = this.state;
  	return (
  		<div className={s('p-2xl flex-grow min-h-0 flex flex-col min-h-0')}>
	        { isEditing ?
	        	<div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
	        	{
		        	answerEditorEnabled ?
			        	<TextEditor 
			        		onEditorStateChange={this.onAnswerEditorStateChange} 
			        		editorState={this.state.answerEditorState} 
			        		wrapperClassName={'card-answer-text-editor-wrapper-edit flex flex-col flex-grow min-h-0 my-reg'} 
			        		editorClassName={'text-editor overflow-auto'} 
			        		toolbarClassName={'text-editor-toolbar'}
			        		autoFocus />
			        	:
			        	<div className={s("flex-grow mb-reg flex flex-col flex-grow min-h-0")} onClick={() => this.enableAnswerEditor()} >
				        	<TextEditor 
				        		onEditorStateChange={this.onAnswerEditorStateChange} 
				        		editorState={this.state.answerEditorState} 
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
		        		iconLeft={false}
		        		underline
		        	/>
		        	{
		        		this.state.showMessageManager ?
		        		<div className={s("message-manager-container rounded-lg flex-grow flex flex-col overflow-auto mt-reg")}> 
		        			{PLACEHOLDER_MESSAGES.map((messageObj, i) => (
		        				<div className={s("flex p-reg")}>
		        					<div className={s("message-photo-container rounded-lg bg-purple-reg flex-shrink-0 text-white flex justify-center mr-reg items-center")}>
		        						<MdPerson />
		        					</div>
		        					<div className={s("flex flex-col flex-grow")}> 
		        						<div className={s("flex items-end")}>
		        							<div className={s("text-sm font-semibold mr-reg")}> { messageObj.senderName } </div>
		        							<div className={s("text-sm text-gray-dark")}> { messageObj.time } </div>
		        						</div>
		        						<div className={s("mt-sm text-sm")}> {messageObj.message}</div>
		        					</div>
		        					<div className={s("flex-shrink-0")}>
		        						Check
		        					</div>
		        				</div>
					          ))}
		        		</div>
		        		:
		        		null
		        	}
	        	</div>
	        	:
	        	<TextEditor 
	        		onEditorStateChange={this.onAnswerEditorStateChange} 
	        		editorState={this.state.answerEditorState} 
	        		wrapperClassName={'text-editor-wrapper flex-grow flex flex-col min-h-0'} 
	        		editorClassName={'text-editor card-answer-text-editor-view overflow-auto'} 
	        		toolbarClassName={''} 
	        		toolbarHidden
	        		readOnly
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
  				onClick={() => this.saveCard(id)}
  				className={s("rounded-t-none p-lg")}
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
    const { id, isEditing, answerEditorState, tags } = this.props;
    const { descriptionEditorEnabled, answerEditorEnabled } = this.state;
    return (
      <div className={s("flex-grow flex flex-col min-h-0")}>
      	<div className={s("flex-grow flex flex-col min-h-0")}>
	        { this.renderHeader() }
	        { this.renderAnswer() }
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