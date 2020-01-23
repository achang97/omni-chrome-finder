import React, { Component } from 'react';
import { MdCheck, MdArrowDropDown, MdMoreHoriz } from "react-icons/md";

import style from './card-content.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

export default class CardContent extends Component {
  render() {
    const { id } = this.props;
    return (
      <div>
        <div className={s("bg-grey-xlight p-sm")}>
          <strong className={s("px-lg pt-lg pb-sm flex items-center justify-between")}>
            <div>2 Days Ago</div>
            <div className={s("flex items-center")}>
              <MdMoreHoriz />
            </div>
          </strong>
          <div className={s("px-lg pb-lg")}>
            <div className={s("text-2xl font-semibold")}>How do I delete a user? ({id}) </div>
            <div className={s("my-lg")}>Here is the answer on how to do that. This should eventually be in a rich text editor, but we'll deal with that later. </div>
            <div className={s("flex items-center justify-between")}>
              <div className={s("flex items-center")}>
                { ['Customer Request Actions', 'Onboarding'].map(tag => (
                  <div className={s("flex items-center p-xs mr-xs bg-grey-light text-purple-reg rounded-full font-semibold text-xs")}>
                    <div className={s("mr-xs")}>Customer Request Actions</div>
                  </div> 
                ))}
              </div>
              <div className={s("flex items-center p-xs bg-green-xlight text-green-reg rounded-lg font-semibold text-xs")}> 
                <MdCheck className={s("mr-xs")} />
                <div>Up To Date</div>
                <MdArrowDropDown />
              </div>
            </div>
          </div>
        </div>
        <div className={s("card-content-bottom-panel flex items-center justify-between fixed bottom-0 w-full bg-grey-light")}>
          <button>
            Edit Card
          </button>
        </div>
      </div>
    );
  }
}