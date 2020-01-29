import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdArrowDropDown, MdMoreHoriz, MdModeEdit, MdThumbUp, MdBookmarkBorder } from "react-icons/md";

import { bindActionCreators } from 'redux';
import { EditorState } from 'draft-js';
import { connect } from 'react-redux';
import { editCard, saveCard } from '../../../actions/display';
import TextEditorCard from '../../editors/TextEditorCard';
import Button from '../../common/Button';
import CardStatus from '../CardStatus';

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

class CardContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answerEditorState: EditorState.createEmpty(),
      descriptionEditorState: EditorState.createEmpty(),
      descriptionEditorEnabled: false,
      answerEditorEnabled: true,

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
      <div>
        {
        isEditing ?

        <Button
          text={"Save Changes"}
          onClick={() => this.saveCard(id)}
          className={s("fixed bottom-0 left-0 right-0 rounded-t-none p-lg")}
          underline
        />

        
          :
          <div className={s("flex items-center justify-between fixed bottom-0 bg-purple-light rounded-b-lg p-lg left-0 right-0")}>      
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
      <div>
        <div className={s("bg-purple-light p-sm")}>
          <strong className={s("text-xs text-purple-reg px-lg pt-lg pb-sm flex items-center justify-between opacity-75")}>
            <div>2 Days Ago</div>
            <div className={s('flex items-center')}>
              <MdMoreHoriz />
            </div>
          </strong>
          <div className={s("px-lg pb-lg")}>
            <div className={s("text-2xl font-semibold")}>How do I delete a user? ({id}) </div>

            { isEditing ?

              
                descriptionEditorEnabled ?
                <TextEditorCard 
                  onEditorStateChange={this.onDescriptionEditorStateChange} 
                  editorState={this.state.descriptionEditorState} 
                wrapperClassName={s('card-description-text-editor-wrapper-edit')} 
                editorClassName={s('text-editor')} 
                toolbarClassName={s('text-editor-toolbar')}/>
          :
          <div onClick={() => this.enableDescriptionEditor()} >
                  <TextEditorCard
                    onEditorStateChange={this.onDescriptionEditorStateChange} 
                    editorState={this.state.descriptionEditorState}
                  wrapperClassName={s('card-description-text-editor-wrapper-inactive cursor-pointer')} 
                  editorClassName={s('text-editor card-description-text-editor-view')} 
                  toolbarClassName={s('')}
                  toolbarHidden
                  readOnly/>
              </div>
            : 
            <TextEditorCard 
              onEditorStateChange={this.onDescriptionEditorStateChange} 
              editorState={this.state.descriptionEditorState} 
              wrapperClassName={s('text-editor-wrapper card-description-text-editor-wrapper-view ')} 
              editorClassName={s('text-editor card-description-text-editor-view')} 
              toolbarClassName={''} 
              toolbarHidden
              readOnly/>
            }

            { !isEditing &&
              <div className={s("flex items-center justify-between")}>
                <div className={s("flex items-center")}>
                  { tags.map(tag => (
                    <div key={tag} className={s("flex items-center p-xs mr-xs bg-purple-gray-10 text-purple-reg rounded-full font-semibold text-xs")}>
                      <div className={s("mr-xs")}>Customer Request Actions</div>
                    </div> 
                  ))}
                </div>
                <CardStatus isUpToDate={true} />
              </div>
      }
          </div>
        </div>
        <div className={s('p-2xl')}>
          { isEditing ?

            answerEditorEnabled ?
              <TextEditorCard 
                onEditorStateChange={this.onAnswerEditorStateChange} 
                editorState={this.state.answerEditorState} 
                wrapperClassName={'card-answer-text-editor-wrapper-edit'} 
                editorClassName={'text-editor'} 
                toolbarClassName={'text-editor-toolbar'} />
              :
              <div onClick={() => this.enableAnswerEditor()} >
                <TextEditorCard 
                  onEditorStateChange={this.onAnswerEditorStateChange} 
                  editorState={this.state.answerEditorState} 
                  wrapperClassName={'card-answer-text-editor-wrapper-inactive cursor-pointer'} 
                  editorClassName={'text-editor card-answer-text-editor-view'} 
                  toolbarClassName={s('')}
                  toolbarHidden
                  readOnly/>
              </div>
            :
            <TextEditorCard 
              onEditorStateChange={this.onAnswerEditorStateChange} 
              editorState={this.state.answerEditorState} 
              wrapperClassName={'text-editor-wrapper'} 
              editorClassName={'text-editor card-answer-text-editor-view'} 
              toolbarClassName={''} 
              toolbarHidden
              readOnly/>
          }
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