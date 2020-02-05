import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '../../components/common/Button';
import { FiMaximize2 } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import { EditorState } from 'draft-js';
import TextEditor from '../../components/editors/TextEditor';

import { openCard } from '../../actions/cards';

import style from "./create.css";
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
  }),
  dispatch =>
    bindActionCreators(
      {
        openCard,
      },
      dispatch
    )
)

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

	openCard = () => {
    // eslint-disable-next-line no-tabs,no-mixed-spaces-and-tabs,react/prop-types
    // Open card with random ID
    this.props.openCard(Math.floor(Math.random() * Math.floor(10000)), Math.floor(Math.random() * Math.floor(10000)), this.state.descriptionEditorState, this.state.answerEditorState);
  	
    const temp = this.state.descriptionEditorState;
  	this.setState({ descriptionEditorState: EditorState.createEmpty(), answerEditorState: EditorState.createEmpty() }, () => {
  		console.log(temp === this.state.descriptionEditorState)
  	});
  };

  render() {
  	const { descriptionEditorState, answerEditorState, showDescriptionEditor } = this.state;
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
          <div className={s("horizontal-separator my-lg")} ></div>
          <TextEditor 
            onEditorStateChange={this.onAnswerEditorStateChange} 
            editorState={answerEditorState} 
            editorType="EXTENSION"
          />

        </div>

        <Button
	        className={s('self-stretch justify-between rounded-t-none rounded-br-none rounded-bl-reg text-reg flex-shrink-0')}
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
