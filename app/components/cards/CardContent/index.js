import React, { Component } from 'react';
import { MdCheck, MdArrowDropDown, MdMoreHoriz, MdModeEdit, MdThumbUp, MdBookmarkBorder } from "react-icons/md";

import { bindActionCreators } from 'redux';
import { EditorState } from 'draft-js';
import { connect } from 'react-redux';
import { editCard, saveCard } from '../../../actions/display';
import TextEditorCard from '../../editors/TextEditorCard';
import Button from '../../common/Button/Button';

import style from './card-content.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const editIcon = require('../../../assets/images/icons/edit.svg');

@connect(
  state => ({

  }),
  dispatch => bindActionCreators({
    editCard,
    saveCard,
  }, dispatch)
)

export default class CardContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	answerEditorState: EditorState.createEmpty(),
    }
  }

  editCard = (id) => {
  	this.props.editCard(id);
  }

  saveCard = (id) => {
  	this.props.saveCard(id, this.state.answerEditorState);
  }


  onEditorStateChange = (editorState) => {
  	this.setState({answerEditorState : editorState });
  }

  render() {
    const { id, isEditing, answerEditorState } = this.props;
    return (
      <div>
        <div className={s("bg-purple-light p-sm")}>
          <strong className={s("text-xs text-purple-reg px-lg pt-lg pb-sm flex items-center justify-between opacity-75")}>
            <div>2 Days Ago</div>
            <div className={s("flex items-center")}>
              <MdMoreHoriz />
            </div>
          </strong>
          <div className={s("px-lg pb-lg")}>
            <div className={s("text-2xl font-semibold")}>How do I delete a user? ({id}) </div>
            <div className={s("my-lg text-sm")}>Here is the answer on how to do that. This should eventually be in a rich text editor, but we'll deal with that later. </div>
            <div className={s("flex items-center justify-between")}>
              <div className={s("flex items-center")}>
                { ['Customer Request Actions', 'Onboarding'].map(tag => (
                  <div key={tag} className={s("flex items-center p-xs mr-xs bg-purple-grey text-purple-reg rounded-full font-semibold text-xs")}>
                    <div className={s("mr-xs")}>Customer Request Actions</div>
                  </div> 
                ))}
              </div>
              <div className={s("flex items-center p-xs bg-green-xlight text-green-reg rounded-lg font-semibold text-xs")}> 
                <MdCheck className={s("mr-xs")} />
                <div>Up To Date</div>
                <MdArrowDropDown />
              </div>
            </div>
          </div>
        </div>
        { isEditing ?
        	<TextEditorCard onEditorStateChange={this.onEditorStateChange} editorState={this.state.answerEditorState} 
        	wrapperClassName={'text-editor-wrapper-edit'} editorClassName={'text-editor'} toolbarClassName={'text-editor-toolbar'}/> 
        	:
        	<TextEditorCard onEditorStateChange={this.onEditorStateChange} editorState={this.state.answerEditorState} toolbarHidden 
        	wrapperClassName={'text-editor-wrapper'} editorClassName={'text-editor-view'} toolbarClassName={''} readOnly/>
        }
        <div className={s("flex items-center justify-between fixed bottom-0 bg-purple-light rounded-b-lg p-lg left-0 right-0")}>
          
          <Button 
          	text={"Edit Card"} 
          	icon={<MdModeEdit className={s("mr-sm")} />} 
          	onClickButton={() => this.editCard(id)}
          />

          <div className={s("flex")}>
	          <Button 
	          	text={"Helpful"} 
	          	icon={<MdThumbUp  className={s("mr-sm")}/>} 
	          	onClickButton={() => this.editCard(id)}
	          	buttonClassName={s("bg-white no-background-image text-purple-reg mr-reg")}/>

	          <Button 
	          	icon={<MdBookmarkBorder />} 
	          	onClickButton={() => this.editCard(id)}
	          	buttonClassName={s("bg-white no-background-image text-purple-reg text-lg")}/>

	          <button onClick={() => this.saveCard(id)}>
	            Save Card
	          </button>
          </div>
        </div>
      </div>
    );
  }
}