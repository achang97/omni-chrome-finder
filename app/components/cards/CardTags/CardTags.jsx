import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { IoMdAdd } from 'react-icons/io';
import _ from 'lodash';

import Select from 'components/common/Select';
import { ANIMATE, REQUEST } from 'appConstants';
import { createConfig } from 'utils/request';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-tags.css';
import CardTag from '../CardTag';

const s = getStyleApplicationFn(style);

class CardTags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstHiddenIndex: props.tags.length,
      showSelect: false
    };

    this.tagRefs = [];
  }

  componentDidMount() {
    const firstHiddenIndex = this.getFirstHiddenIndex();
    this.setState({ firstHiddenIndex });
  }

  componentDidUpdate(prevProps) {
    const { maxWidth, tags } = this.props;
    if (
      prevProps.maxWidth !== maxWidth ||
      JSON.stringify(prevProps.tags) !== JSON.stringify(tags)
    ) {
      const firstHiddenIndex = this.getFirstHiddenIndex();

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ firstHiddenIndex });
    }
  }

  getFirstHiddenIndex = () => {
    const { maxWidth, tags } = this.props;

    let totalWidth = 0;

    if (maxWidth) {
      let i;
      for (i = 0; i < tags.length; i++) {
        if (this.tagRefs[i]) {
          const { width } = this.tagRefs[i].getBoundingClientRect();
          totalWidth += width;

          if (totalWidth >= maxWidth) return i;
        } else {
          break;
        }
      }
    }

    return tags.length;
  };

  getContainerStyle = () => {
    const { maxWidth } = this.props;
    if (!maxWidth) {
      return {};
    }
    return { maxWidth };
  };

  getSelectOptionLabel = ({ name, label, __isNew__ }) => {
    return __isNew__ ? label : name;
  };

  getSelectOptionValue = ({ _id, value, __isNew__ }) => {
    return __isNew__ ? value : _id;
  };

  isValidNewOption = (inputValue, selectValue, selectOptions) => {
    return (
      inputValue && !selectOptions.some(({ name }) => name === inputValue.trim().toLowerCase())
    );
  };

  // TODO: Remove this once React-Select gets their shit together.
  getNewOptionData = (inputValue, optionLabel) => ({
    value: inputValue,
    label: optionLabel,
    __isNew__: true,
    isEqual: () => false
  });

  handleCreateOption = (name) => {
    const { token, tags, onChange } = this.props;
    axios.post(`${REQUEST.URL.SERVER}/tags`, { name }, createConfig(token)).then(({ data }) => {
      onChange([...tags, data]);
    });
  };

  renderTag = (tag, index) => {
    const { maxWidth, tags, onTagClick, onRemoveClick, isEditable } = this.props;
    const { firstHiddenIndex } = this.state;
    const { name, _id, className } = tag;

    return (
      <React.Fragment key={_id}>
        {index === firstHiddenIndex && (
          <CardTag
            name={`+${tags.length - firstHiddenIndex}`}
            className={s(`flex items-center mb-xs ${className}`)}
            onClick={onTagClick && (() => onTagClick(null, -1))}
          />
        )}
        <CardTag
          name={name}
          ref={
            maxWidth &&
            ((instance) => {
              this.tagRefs[index] = instance;
            })
          }
          className={s(
            `flex items-center mr-xs mb-xs ${
              maxWidth ? `whitespace-no-wrap ${index >= firstHiddenIndex ? 'invisible' : ''}` : ''
            } ${className}`
          )}
          onClick={onTagClick && (() => onTagClick(tag, index))}
          onRemoveClick={isEditable && onRemoveClick ? () => onRemoveClick(tag, index) : null}
        />
      </React.Fragment>
    );
  };

  loadOptions = (inputValue) => {
    const { requestSearchTags } = this.props;
    requestSearchTags(inputValue);
  };

  render() {
    const {
      className,
      tags,
      tagOptions,
      isSearchingTags,
      onChange,
      maxWidth,
      isEditable,
      isCreatable,
      showPlaceholder,
      hideSelectOnBlur,
      showSelect: propsShowSelect
    } = this.props;
    const { showSelect: stateShowSelect } = this.state;
    const containerStyle = this.getContainerStyle();

    return (
      <div
        className={s(
          `card-tags-container ${
            maxWidth ? 'flex-shrink-1 min-w-0' : 'card-tags-container-wrap'
          } ${className}`
        )}
        style={containerStyle}
      >
        {(stateShowSelect || propsShowSelect) && isEditable ? (
          <Select
            type={isCreatable ? 'creatable' : 'default'}
            className={s('w-full')}
            value={tags}
            options={tagOptions}
            onChange={onChange}
            onInputChange={_.debounce(this.loadOptions, ANIMATE.DEBOUNCE.MS_300)}
            onFocus={() => this.loadOptions('')}
            isSearchable
            isMulti
            menuShouldScrollIntoView
            isClearable={false}
            placeholder="Add tags..."
            onBlur={hideSelectOnBlur ? () => this.setState({ showSelect: false }) : null}
            getOptionLabel={this.getSelectOptionLabel}
            getOptionValue={this.getSelectOptionValue}
            onCreateOption={this.handleCreateOption}
            isValidNewOption={this.isValidNewOption}
            getNewOptionData={this.getNewOptionData}
            noOptionsMessage={() => (isSearchingTags ? 'Searching tags...' : 'No options')}
          />
        ) : (
          <>
            {tags.map((tag, i) => this.renderTag(tag, i))}
            {!isEditable && tags.length === 0 && showPlaceholder && (
              <div className={s('text-sm text-gray-light')}>No current tags</div>
            )}
            {isEditable && (
              <CardTag
                name={
                  <div className={s('flex items-center')}>
                    <div> Add Tag </div>
                    <IoMdAdd className={s('ml-xs')} />
                  </div>
                }
                className={s('mr-xs mb-xs primary-gradient text-white')}
                onClick={() => this.setState({ showSelect: true })}
              />
            )}
          </>
        )}
      </div>
    );
  }
}

const TagPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    className: PropTypes.string
  })
);

CardTags.propTypes = {
  isEditable: PropTypes.bool,
  isCreatable: PropTypes.bool,
  className: PropTypes.string,
  tags: TagPropTypes.isRequired,
  maxWidth: PropTypes.number,
  onChange: PropTypes.func,
  onTagClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  showPlaceholder: PropTypes.bool,
  showSelect: PropTypes.bool,
  hideSelectOnBlur: PropTypes.bool,

  // Redux State
  tagOptions: TagPropTypes.isRequired,
  isSearchingTags: PropTypes.bool,
  token: PropTypes.string.isRequired,

  // Redux Actions
  requestSearchTags: PropTypes.func.isRequired
};

CardTags.defaultProps = {
  className: '',
  isEditable: false,
  isCreatable: false,
  showPlaceholder: false,
  showSelect: false,
  hideSelectOnBlur: false,
  maxWidth: null,
  onChange: null,
  onTagClick: null,
  onRemoveClick: null
};

export default CardTags;
