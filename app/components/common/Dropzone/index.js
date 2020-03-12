import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
import { colors } from '../../../styles/colors';

const baseStyle = {
  borderWidth: '2px',
  borderRadius: '8px',
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
};

const activeStyle = {
  borderColor: colors.purple.light
};

const acceptStyle = {
  borderColor: colors.purple.reg
};

const rejectStyle = {
  borderColor: '#f56565'
};

function StyledDropzone(props) {
  const onDrop = useCallback(acceptedFiles => props.onDrop(acceptedFiles), []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: props.accept, onDrop });

  const style = useMemo(() => ({
    ...baseStyle,
    ...props.style,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject
  ]);

  return (
    <div {...getRootProps({ style })} className={props.className}>
      <input {...getInputProps()} />
      {props.children}
    </div>
  );
}

StyledDropzone.propTypes = {
  accept: PropTypes.string,
  onDrop: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

StyledDropzone.defaultProps = {
  accept: '',
  className: '',
  style: {},
};

export default StyledDropzone;
