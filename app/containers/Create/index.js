import React, { Component, PropTypes } from 'react';
import Button from '../../components/common/Button';
import { FiMaximize2 } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import { EditorState } from 'draft-js';
import TextEditor from '../../components/editors/TextEditor';

import style from "./create.css";
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);


export default class Create extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
	      // Text editors
	      descriptionEditorState: EditorState.createEmpty(),
	      answerEditorState: EditorState.createEmpty(),
	      showDescriptionEditor: false,
	    };
	 }

	onDescriptionEditorStateChange = (editorState) => {
    this.setState({ descriptionEditorState : editorState });
	}

	onAnswerEditorStateChange = (editorState) => {
    this.setState({ answerEditorState : editorState });
	}

	showDescriptionEditor = () => {
		this.setState( { showDescriptionEditor: true} );
	}

  render() {
  	const { descriptionEditorState, answerEditorState, showDescriptionEditor } = this.state;
    return (
      <div className={s('flex flex-col flex-1 min-h-0')}>
        <div className={s("p-lg flex flex-col flex-grow")}>
        	<div className={s("flex justify-between items-center")}>
        		<div> Create a Card </div>
        		<Button
        			text={"Expand Card"}
        			color={"primary"}
        			className={s("p-sm text-xs")}
        			icon={<FiMaximize2 className={s("ml-reg")}/>}
        			iconLeft={false}
        		/>
        	</div>
        	<input
            	placeholder="Question"
            	className={s("w-full my-xl")}
          	/>
          {
          	showDescriptionEditor ?
          	<TextEditor 
	            onEditorStateChange={this.onDescriptionEditorStateChange} 
	            editorState={descriptionEditorState} 
	            editorType="EXTENSION"
	          />
          	:
	          <Button
	          	text={"Add Description"}
	          	onClick={this.showDescriptionEditor}
	          	color={"secondary"}
	          	className={s("description-button justify-start shadow-none")}
	          	icon={<MdAdd className={s("mr-reg")}/>}
	          	underline={false}
	          	/>
          }
          <TextEditor 
            onEditorStateChange={this.onAnswerEditorStateChange} 
            editorState={answerEditorState} 
            editorType="EXTENSION"
          />

        </div>

        <div> Create Card </div>
      </div>
    );
  }
}
