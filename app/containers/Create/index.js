import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '../../components/common/Button';
import { FiMaximize2 } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import { EditorState } from 'draft-js';
import TextEditor from '../../components/editors/TextEditor';

import { openCard } from '../../actions/cards';
import * as createActions from '../../actions/create';
import { showDescriptionEditor } from '../../actions/create';

import style from "./create.css";
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
  	...state.create,
    user: state.profile.user,
  }),
  dispatch =>
    bindActionCreators(
      {
        openCard,
        ...createActions,
      },
      dispatch
    )
)

export default class Create extends Component {
	constructor(props) {
    super(props);
  }  

	openCard = (createModalOpen=false) => {
    const { openCard, clearCreatePanel, question, descriptionEditorState, answerEditorState, user: { _id, firstname, lastname, img } } = this.props;

    // Open card with random ID and clear out Create panel
    const newCardInfo = {
      question,
      descriptionEditorState,
      answerEditorState,
      owners: [{ _id, name: `${firstname} ${lastname}`, img }] // Add own user by default
    };
    openCard(newCardInfo, createModalOpen, true);
    clearCreatePanel();
  }

  updateQuestionValue = (event) => {
  	this.props.updateCreateQuestion(event.target.value);
  }

  render() {
    const {
      showCreateDescriptionEditor, isDescriptionEditorShown, 
      question,
      descriptionEditorState, updateCreateDescriptionEditor,
      answerEditorState, updateCreateAnswerEditor,
    } = this.props;
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
            	value={question}
            	onChange={this.updateQuestionValue}
          	/>
          {
          	isDescriptionEditorShown ?
          	<TextEditor 
	            onEditorStateChange={updateCreateDescriptionEditor} 
	            editorState={descriptionEditorState} 
	            editorType="EXTENSION"
	          />
          	:
	          <Button
	          	text={"Add Description"}
	          	onClick={showCreateDescriptionEditor}
	          	color={"secondary"}
	          	className={s("description-button justify-start shadow-none")}
	          	icon={<MdAdd className={s("mr-reg")}/>}
	          	underline={false}
	          	/>
          }
          <div className={s("horizontal-separator my-lg")} ></div>
          <TextEditor 
            onEditorStateChange={updateCreateAnswerEditor} 
            editorState={answerEditorState} 
            editorType="EXTENSION"
          />

        </div>

        <Button
	        className={s('self-stretch justify-between rounded-t-none rounded-br-none rounded-bl-reg text-reg flex-shrink-0')}
	        onClick={() => this.openCard(true)}
	        color="primary"
	        text="Create Card"
	        iconLeft={false}
	        disabled={question === '' || !answerEditorState.getCurrentContent().hasText()}
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
