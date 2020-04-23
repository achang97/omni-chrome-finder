import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AnimateHeight from 'react-animate-height';
import { bindActionCreators } from 'redux';
import { FiMaximize2 } from 'react-icons/fi';
import { MdAdd } from 'react-icons/md';
import { EditorState } from 'draft-js';

import { Button, Separator } from 'components/common';
import TextEditor from 'components/editors/TextEditor';
import SuggestionPanel from 'components/suggestions/SuggestionPanel';
import { ScreenRecordButton, AttachmentDropdown, AttachmentDropzone } from 'components/attachments';

import { generateFileKey, isAnyLoading } from 'utils/file';

import style from './create.css';
import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn(style);

const Create = ({
  question, descriptionEditorState, answerEditorState, attachments, user,
  showCreateDescriptionEditor, isDescriptionEditorShown,
  updateCreateQuestion, updateCreateDescriptionEditor, updateCreateAnswerEditor, clearCreatePanel,
  requestAddCreateAttachment, updateCreateAttachmentName, requestRemoveCreateAttachment, openCard
}) => {
  const openCardWithProps = (createModalOpen = false) => {
    const { _id, firstname, lastname, profilePicture } = user;

    // Open card with random ID and clear out Create panel
    const ownUser = [{ _id, name: `${firstname} ${lastname}`, profilePicture }];
    const newCardInfo = {
      owners: ownUser,
      subscribers: ownUser,  
      edits: {
        question,
        descriptionEditorState,
        answerEditorState,
        attachments,
        owners: ownUser,
        subscribers: ownUser   
      }
    };
    openCard(newCardInfo, createModalOpen, true);
    clearCreatePanel();
  }

  const addCreateAttachments = (files) => {
    files.forEach((file) => {
      requestAddCreateAttachment(generateFileKey(), file);
    });
  }

  const renderInputSection = () => (
    <div>
      <input
        placeholder="Title or Question"
        className={s('w-full my-reg')}
        value={question}
        onChange={e => updateCreateQuestion(e.target.value)}
        autoFocus
      />
      <AnimateHeight height={!isDescriptionEditorShown ? 'auto' : 0}>
        <Button
          text={'Add Description'}
          onClick={showCreateDescriptionEditor}
          color={'secondary'}
          className={s('description-button justify-start shadow-none')}
          icon={<MdAdd className={s('mr-reg')} />}
          underline={false}
        />
      </AnimateHeight>
      <AnimateHeight height={isDescriptionEditorShown ? 'auto' : 0}>
        <TextEditor
          onEditorStateChange={updateCreateDescriptionEditor}
          editorState={descriptionEditorState}
          editorType="EXTENSION"
          placeholder="Add a description here"
        />
      </AnimateHeight>
      <Separator horizontal className={s('my-reg')} />
      <TextEditor
        onEditorStateChange={updateCreateAnswerEditor}
        editorState={answerEditorState}
        editorType="EXTENSION"
        placeholder="Add an answer here"
      />
    </div>
  );

  const renderAttachmentSection = () => (
    <div className={s('flex px-xs pt-reg')}>
      <ScreenRecordButton
        onSuccess={({ recording }) => addCreateAttachments([recording])}
        id="create"
      />
      <AttachmentDropzone
        className={s('mx-xs')}
        onDrop={addCreateAttachments}
      />
      <AttachmentDropdown
        attachments={attachments}
        onFileNameChange={({ key, fileName }) => updateCreateAttachmentName(key, fileName)}
        onRemoveClick={(key) => requestRemoveCreateAttachment(key)}
      />
    </div>
  );

  return (
    <div className={s('flex flex-col flex-1 min-h-0')}>
      <div className={s('p-lg flex flex-col flex-grow overflow-auto min-h-0')}>
        <div className={s('flex justify-between items-center')}>
          <div> Create a Card </div>
          <Button
            text={'Expand Card'}
            onClick={openCardWithProps}
            disabled={isAnyLoading(attachments)}
            color={'primary'}
            className={s('p-sm text-xs')}
            icon={<FiMaximize2 className={s('ml-reg')} />}
            iconLeft={false}
          />
        </div>
        { renderInputSection() }
        { renderAttachmentSection() }
      </div>
      <Button
        className={s('self-stretch justify-between rounded-t-none rounded-br-none rounded-bl-reg text-reg flex-shrink-0')}
        onClick={() => openCardWithProps(true)}
        color="primary"
        text="Create Card"
        iconLeft={false}
        disabled={
          question === '' ||
          !answerEditorState.getCurrentContent().hasText() ||
          isAnyLoading(attachments)
        }
        icon={
          <span className={s('rounded-full h-3xl w-3xl flex justify-center items-center bg-white text-purple-reg')}>
            <MdAdd />
          </span>
        }
      />
      <SuggestionPanel
        query={question}
      />
    </div>
  );
}

export default Create;