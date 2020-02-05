import _ from 'underscore';
import globalStyle from '../styles/global.css';

export function getStyleApplicationFn() {
  const hashedClassNameMap = _.extend(globalStyle, ...arguments);
  return function (classNameString) {
    return classNameString.split(/\s+/).map(className => hashedClassNameMap[className] || className).join(' ');
  };
}

export function isOverflowing(el) {
  if (!el) return false;

  var curOverflow = el.style.overflow;

  if ( !curOverflow || curOverflow === "visible" ) {
    el.style.overflow = "hidden";
  }

  var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

  el.style.overflow = curOverflow;

  return isOverflowing;
 }