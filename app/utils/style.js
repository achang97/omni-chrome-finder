import _ from 'lodash';
import globalStyle from 'styles/global.css';

export function getStyleApplicationFn(...args) {
  const hashedClassNameMap = _.extend(globalStyle, ...args);
  return (classNameString) => {
    return classNameString
      .split(/\s+/)
      .map((className) => hashedClassNameMap[className] || className)
      .join(' ');
  };
}

export default { getStyleApplicationFn };
