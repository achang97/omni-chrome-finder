import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '../../components/common/Button';
import { FiMaximize2 } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import { EditorState } from 'draft-js';
import TextEditor from '../../components/editors/TextEditor';

import { openCard, changeCreateDescriptionEditor, changeCreateAnswerEditor, changeCreateQuestion, clearCreatePanel} from '../../actions/cards';
import { showDescriptionEditor } from '../../actions/create';


import style from "./create.css";
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
  	createDescriptionEditorState: state.cards.createDescriptionEditorState,
  	createAnswerEditorState: state.cards.createAnswerEditorState,
  	createQuestion: state.cards.createQuestion,
  	viewDescriptionEditor: state.create.showDescriptionEditor,
  }),
  dispatch =>
    bindActionCreators(
      {
        openCard,
        changeCreateDescriptionEditor,
        changeCreateAnswerEditor,
        changeCreateQuestion,
        clearCreatePanel,
        showDescriptionEditor
      },
      dispatch
    )
)

export default class Create extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
	    };
	 }

	onDescriptionEditorStateChange = (editorState) => {
    //this.setState({ descriptionEditorState : editorState });
    this.props.changeCreateDescriptionEditor(editorState)
	}

	onAnswerEditorStateChange = (editorState) => {
    //this.setState({ answerEditorState : editorState });
    this.props.changeCreateAnswerEditor(editorState)
	}

	showDescriptionEditor = () => {
		this.setState( { showDescriptionEditor: true} );
	}

	openCard = (openCreateModal=false) => {
    // Open card with random ID
    this.props.openCard({ fromCreate: true, createModalOpen: openCreateModal });

    // Clear out the Create panel
    this.props.clearCreatePanel();
  	
  }

  changeQuestionValue = (event) => {
  	this.props.changeCreateQuestion(event.target.value);
  }

  render() {
    const { createDescriptionEditorState, createAnswerEditorState, viewDescriptionEditor, showDescriptionEditor, createQuestion } = this.props;
    return (
      <div className={s('flex flex-col flex-1 min-h-0')}>
        <div className={s("p-lg flex flex-col flex-grow")}>
        	<div className={s("flex justify-between items-center")}>
        		<div> Create a Card </div>
        		<Button
        			text={"Expand Card"}
        			onClick={this.openCard}
        			color={"primary"}
        			className={s("p-sm text-xs")}
        			icon={<FiMaximize2 className={s("ml-reg")}/>}
        			iconLeft={false}
        		/>
        	</div>
        	<input
            	placeholder="Question"
            	className={s("w-full my-xl")}
            	value={createQuestion}
            	onChange={this.changeQuestionValue}
          	/>
          {
          	viewDescriptionEditor ?
          	<TextEditor 
	            onEditorStateChange={this.onDescriptionEditorStateChange} 
	            editorState={createDescriptionEditorState} 
	            editorType="EXTENSION"
	          />
          	:
	          <Button
	          	text={"Add Description"}
	          	onClick={() => showDescriptionEditor()}
	          	color={"secondary"}
	          	className={s("description-button justify-start shadow-none")}
	          	icon={<MdAdd className={s("mr-reg")}/>}
	          	underline={false}
	          	/>
          }
          <div className={s("horizontal-separator my-lg")} ></div>
          <TextEditor 
            onEditorStateChange={this.onAnswerEditorStateChange} 
            editorState={createAnswerEditorState} 
            editorType="EXTENSION"
          />

        </div>

        <Button
	        className={s('self-stretch justify-between rounded-t-none rounded-br-none rounded-bl-reg text-reg flex-shrink-0')}
	        onClick={() => this.openCard(true)}
	        color="primary"
	        text="Create Card"
	        iconLeft={false}
	        icon={
	          <span className={s("rounded-full h-3xl w-3xl flex justify-center items-center bg-white text-purple-reg")}>
	            <MdAdd />
	          </span>
	        }
	      />
      </div>
    );
  }
}
