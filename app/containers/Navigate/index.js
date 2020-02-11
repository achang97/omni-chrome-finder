import React, { Component, PropTypes } from 'react';
import { MdSearch } from "react-icons/md";
import style from "./navigate.css";
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

export default class Create extends Component {
  render() {
    return (
      <div className={s("flex flex-col flex-grow")}>
        <div className={s("bg-purple-xlight p-lg flex flex-col")}>
        	<div className={s("flex")}>
	        	<input
	            	placeholder="Search all knowledge"
	            	className={s("flex-grow rounded-r-none border-r-none")}
	          	/>
	          	<div className={s("bg-white flex flex-col items-center justify-center text-purple-reg rounded-r-lg pr-reg")}> <MdSearch /> </div>
          	</div>
          	<div className={s("my-sm text-xs")}> View cards by tags </div>
        </div>
        <div>
        </div>
      </div>
    );
  }
}
