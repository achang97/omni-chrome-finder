import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '../../components/common/Button';
import { FiMaximize2 } from 'react-icons/fi';
import { MdAdd } from 'react-icons/md';
import { EditorState } from 'draft-js';
import TextEditor from '../../components/editors/TextEditor';
import SuggestionPanel from '../../components/suggestions/SuggestionPanel';

import ScreenRecordButton from '../../components/attachments/ScreenRecordButton';
import AttachmentDropdown from '../../components/attachments/AttachmentDropdown';
import AttachmentDropzone from '../../components/attachments/AttachmentDropzone';

import { openCard } from '../../actions/cards';
import { requestSearchCards } from '../../actions/search';
import * as createActions from '../../actions/create';
import { showDescriptionEditor } from '../../actions/create';

import { DEBOUNCE_60_HZ, SEARCH_TYPE } from '../../utils/constants';
import { generateFileKey, convertAttachmentsToBackendFormat } from '../../utils/file';

import style from './create.css';
import { getStyleApplicationFn } from '../../utils/style';
import { EDITOR_TYPE } from '../../utils/constants';
const s = getStyleApplicationFn(style);

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionInputFocused: true,
    };
  }

  openCard = (createModalOpen = false) => {
    const { openCard, attachments, clearCreatePanel, question, descriptionEditorState, answerEditorState, user: { _id, firstname, lastname, img } } = this.props;

    // Open card with random ID and clear out Create panel
    const newCardInfo = {
      question,
      descriptionEditorState,
      answerEditorState,
      attachments: convertAttachmentsToBackendFormat(attachments),
      owners: [{ _id, name: `${firstname} ${lastname}`, img }] // Add own user by default
    };
    openCard(newCardInfo, createModalOpen, true);
    clearCreatePanel();
  }

  addCreateAttachments = (files) => {
    const { requestAddCreateAttachment } = this.props;
    files.forEach((file) => {
      requestAddCreateAttachment(generateFileKey(), file);
    });
  }

  renderInputSection = () => {
    const {
      showCreateDescriptionEditor, isDescriptionEditorShown,
      question, updateCreateQuestion,
      descriptionEditorState, updateCreateDescriptionEditor,
      answerEditorState, updateCreateAnswerEditor
    } = this.props;

    return (
      <React.Fragment>
        <input
          placeholder="Question"
          className={s('w-full my-xl')}
          value={question}
          onChange={e => updateCreateQuestion(e.target.value)}
          autoFocus
          onFocus={() => this.setState({ questionInputFocused: true })}
          onBlur={() => this.setState({ questionInputFocused: false })}
        />
        {
          isDescriptionEditorShown ?
            <TextEditor
              onEditorStateChange={updateCreateDescriptionEditor}
              editorState={descriptionEditorState}
              editorType="EXTENSION"
              editorRole={EDITOR_TYPE.DESCRIPTION}
            />
          :
            <Button
              text={'Add Description'}
              onClick={showCreateDescriptionEditor}
              color={'secondary'}
              className={s('description-button justify-start shadow-none')}
              icon={<MdAdd className={s('mr-reg')} />}
              underline={false}
            />
        }
        <div className={s('horizontal-separator my-lg')} />
        <TextEditor
          onEditorStateChange={updateCreateAnswerEditor}
          editorState={answerEditorState}
          editorType="EXTENSION"
          editorRole={EDITOR_TYPE.ANSWER}
        />
      </React.Fragment>
    );
  }

  renderAttachmentSection = () => {
    const { attachments, updateCreateAttachmentName, requestRemoveCreateAttachment } = this.props;
    return (
      <div className={s('flex px-xs pt-reg')}>
        <ScreenRecordButton
          onSuccess={recording => this.addCreateAttachments([recording])}
          onError={error => console.log(error)}
        />
        <AttachmentDropzone
          className={s('mx-xs')}
          onDrop={this.addCreateAttachments}
        />
        <AttachmentDropdown
          attachments={attachments}
          onFileNameChange={({ key, fileName }) => updateCreateAttachmentName(key, fileName)}
          onRemoveClick={(key) => requestRemoveCreateAttachment(key)}
        />
      </div>
    );
  }

  render() {
    const { question, answerEditorState } = this.props;
    const showRelatedQuestions = question.length > 0 && this.state.questionInputFocused;

    return (
      <div className={s('flex flex-col flex-1 min-h-0')}>
        <div className={s('p-lg flex flex-col flex-grow')}>
          <div className={s('flex justify-between items-center')}>
            <div> Create a Card </div>
            <Button
              text={'Expand Card'}
              onClick={this.openCard}
              color={'primary'}
              className={s('p-sm text-xs')}
              icon={<FiMaximize2 className={s('ml-reg')} />}
              iconLeft={false}
            />
          </div>
          { this.renderInputSection() }
          { this.renderAttachmentSection() }
        </div>
        <Button
          className={s('self-stretch justify-between rounded-t-none rounded-br-none rounded-bl-reg text-reg flex-shrink-0')}
          onClick={() => this.openCard(true)}
          color="primary"
          text="Create Card"
          iconLeft={false}
          disabled={question === '' || !answerEditorState.getCurrentContent().hasText()}
          icon={
            <span className={s('rounded-full h-3xl w-3xl flex justify-center items-center bg-white text-purple-reg')}>
              <MdAdd />
            </span>
          }
        />
        <SuggestionPanel
          isVisible={showRelatedQuestions}
          query={question}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.create,
    user: state.profile.user,
  }),
  dispatch =>
    bindActionCreators(
      {
        openCard,
        requestSearchCards,
        ...createActions,
      },
      dispatch
    )
)(Create);
