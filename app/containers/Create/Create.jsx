import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiMaximize2 } from 'react-icons/fi';
import { MdAdd, MdOpenInNew } from 'react-icons/md';
import { EditorState } from 'draft-js';

import { Button, Separator, BackButton, Select } from 'components/common';
import TextEditor from 'components/editors/TextEditor';
import SuggestionPanel from 'components/suggestions/SuggestionPanel';
import { ScreenRecordButton, AttachmentDropdown, AttachmentDropzone } from 'components/attachments';

import { generateFileKey, isAnyLoading } from 'utils/file';
import { getNewCardBaseState } from 'utils/card';
import { createSelectOptions, createSelectOption } from 'utils/select';
import { getEditorStateFromContentState } from 'utils/editor';
import { UserPropTypes, NodePropTypes } from 'utils/propTypes';

import { getStyleApplicationFn } from 'utils/style';
import style from './create.css';

const s = getStyleApplicationFn(style);

const Create = ({
  question,
  answerEditorState,
  attachments,
  finderNode,
  user,
  isTemplateView,
  templates,
  selectedTemplateCategory,
  updateSelectedTemplateCategory,
  toggleTemplateView,
  requestGetTemplates,
  updateCreateQuestion,
  updateCreateAnswerEditor,
  clearCreatePanel,
  requestAddCreateAttachment,
  updateCreateAttachmentName,
  requestRemoveCreateAttachment,
  openCard
}) => {
  useEffect(() => {
    if (isTemplateView) {
      requestGetTemplates();
    }
  }, [isTemplateView, requestGetTemplates]);

  const openCardWithProps = (createModalOpen = false, edits = {}) => {
    // Open card with random ID and clear out Create panel
    const newCardInfo = { ...getNewCardBaseState(user), finderNode };
    newCardInfo.edits = {
      ...newCardInfo.edits,
      question,
      answerEditorState,
      attachments,
      ...edits
    };
    openCard(newCardInfo, true, createModalOpen);
    clearCreatePanel();
  };

  const addCreateAttachments = (files) => {
    files.forEach((file) => {
      requestAddCreateAttachment(generateFileKey(), file);
    });
  };

  const renderInputSection = () => (
    <div>
      <textarea
        placeholder="Title or Question"
        className={s('w-full')}
        value={question}
        onChange={(e) => updateCreateQuestion(e.target.value)}
        autoFocus
      />
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
      <AttachmentDropzone className={s('mx-xs')} onDrop={addCreateAttachments} />
      <AttachmentDropdown
        attachments={attachments}
        onFileNameChange={({ key, fileName }) => updateCreateAttachmentName(key, fileName)}
        onRemoveClick={(key) => requestRemoveCreateAttachment(key)}
      />
    </div>
  );

  const openTemplate = ({ question: templateQuestion, answer }) => {
    openCardWithProps(false, {
      question: templateQuestion,
      answerEditorState: getEditorStateFromContentState(answer)
    });
  };

  const renderTemplateView = () => {
    const selectedCategory = selectedTemplateCategory || createSelectOption(user.team);
    const selectedTemplates = templates[selectedCategory && selectedCategory.value] || [];

    return (
      <div>
        <div className={s('pt-lg px-lg')}>
          <div className={s('flex items-center mb-lg')}>
            <BackButton className={s('mr-lg')} onClick={toggleTemplateView} />
            <div className={s('font-bold')}> Template View </div>
          </div>
          <Select
            options={createSelectOptions(Object.keys(templates))}
            placeholder="Select a category"
            value={selectedCategory}
            onChange={updateSelectedTemplateCategory}
          />
          <div className={s('mt-lg mb-sm text-gray-dark text-xs')}> Templates </div>
          {selectedTemplates.length === 0 && (
            <div className={s('text-gray-light my-sm text-center')}>
              Please select a template category.
            </div>
          )}
        </div>
        <div className={s('pb-lg')}>
          {selectedTemplates.map((template) => (
            <div
              key={template.title}
              className={s(
                'flex items-center justify-between text-purple-reg text-sm font-semibold px-lg py-reg cursor-pointer hover:bg-purple-gray-10'
              )}
              onClick={() => openTemplate(template)}
            >
              <div className={s('truncate flex-1')}> {template.title} </div>
              <MdOpenInNew />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMainView = () => {
    return (
      <div className={s('flex flex-col flex-1 min-h-0')}>
        <div className={s('p-lg flex flex-col flex-grow overflow-auto min-h-0')}>
          <div className={s('flex justify-between items-center')}>
            <div> Create a Card </div>
            <Button
              text="Expand Card"
              onClick={openCardWithProps}
              disabled={isAnyLoading(attachments)}
              color="primary"
              className={s('p-sm text-xs')}
              icon={<FiMaximize2 className={s('ml-reg')} />}
              iconLeft={false}
            />
          </div>
          <Button
            onClick={toggleTemplateView}
            text="Use a Template"
            color="transparent"
            className={s('mt-reg')}
          />
          <div className={s('text-gray-light mt-reg mb-sm flex items-center')}>
            <Separator horizontal className={s('section-separator')} />
            <div className={s('text-xs')}> OR </div>
            <Separator horizontal className={s('section-separator')} />
          </div>
          {renderInputSection()}
          {renderAttachmentSection()}
        </div>
        <Button
          className={s(
            'self-stretch justify-between rounded-t-none rounded-br-none rounded-bl-reg text-reg flex-shrink-0'
          )}
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
            <span
              className={s(
                'rounded-full h-3xl w-3xl flex justify-center items-center bg-white text-purple-reg'
              )}
            >
              <MdAdd />
            </span>
          }
        />
        <SuggestionPanel query={question} />
      </div>
    );
  };

  return isTemplateView ? renderTemplateView() : renderMainView();
};

Create.propTypes = {
  question: PropTypes.string.isRequired,
  answerEditorState: PropTypes.instanceOf(EditorState).isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  finderNode: NodePropTypes,
  user: UserPropTypes.isRequired,
  isTemplateView: PropTypes.bool.isRequired,
  templates: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  selectedTemplateCategory: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }),

  // Redux Actions
  updateSelectedTemplateCategory: PropTypes.func.isRequired,
  toggleTemplateView: PropTypes.func.isRequired,
  requestGetTemplates: PropTypes.func.isRequired,
  updateCreateQuestion: PropTypes.func.isRequired,
  updateCreateAnswerEditor: PropTypes.func.isRequired,
  clearCreatePanel: PropTypes.func.isRequired,
  requestAddCreateAttachment: PropTypes.func.isRequired,
  updateCreateAttachmentName: PropTypes.func.isRequired,
  requestRemoveCreateAttachment: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired
};

export default Create;
