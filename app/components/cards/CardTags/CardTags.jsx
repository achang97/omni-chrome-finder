import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IoMdAdd } from 'react-icons/io';
import { MdLock } from 'react-icons/md';
import _ from 'lodash';

import Select from 'components/common/Select';
import { NOOP, ANIMATE } from 'appConstants';

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

  renderOptionLabel = ({ name, locked }) => (
    <div className={s('flex items-center')}>
      <div> {name} </div>
      {locked && <MdLock className={s('ml-xs')} />}
    </div>
  );

  renderTag = ({ name, _id, locked, className }, i) => {
    const { maxWidth, tags, onTagClick, onRemoveClick, isEditable } = this.props;
    const { firstHiddenIndex } = this.state;
    return (
      <React.Fragment key={_id}>
        {i === firstHiddenIndex && (
          <CardTag
            name={`+${tags.length - firstHiddenIndex}`}
            className={s(`flex items-center mb-xs ${className}`)}
            onClick={onTagClick}
          />
        )}
        <CardTag
          name={name}
          locked={locked}
          ref={
            maxWidth &&
            ((instance) => {
              this.tagRefs[i] = instance;
            })
          }
          className={s(
            `flex items-center mr-xs mb-xs ${
              maxWidth ? `whitespace-no-wrap ${i >= firstHiddenIndex ? 'invisible' : ''}` : ''
            } ${className}`
          )}
          onClick={onTagClick}
          onRemoveClick={isEditable ? () => onRemoveClick(i) : null}
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
        {stateShowSelect || propsShowSelect ? (
          <Select
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
            onBlur={hideSelectOnBlur ? () => this.setState({ showSelect: false }) : NOOP}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option._id}
            formatOptionLabel={this.renderOptionLabel}
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

CardTags.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  className: PropTypes.string,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
      locked: PropTypes.bool.isRequired,
      className: PropTypes.string
    })
  ).isRequired,
  maxWidth: PropTypes.number,
  onChange: PropTypes.func,
  onTagClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  showPlaceholder: PropTypes.bool,
  showSelect: PropTypes.bool,
  hideSelectOnBlur: PropTypes.bool,

  // Redux State
  tagOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSearchingTags: PropTypes.bool,

  // Redux Actions
  requestSearchTags: PropTypes.func.isRequired
};

CardTags.defaultProps = {
  className: '',
  showPlaceholder: false,
  showSelect: false,
  hideSelectOnBlur: false,
  maxWidth: null,
  onChange: null,
  onTagClick: null,
  onRemoveClick: null,

  isSearchingTags: false
};

export default CardTags;
