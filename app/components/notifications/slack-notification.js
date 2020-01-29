import React from "react"
import { default as SlackIcon } from "../../assets/images/icons/Slack_Mark.svg"


import GlobalStyle from '../../styles/global.css';
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const tw = getStyleApplicationFn(GlobalStyle)

export const SlackNotification = ({ message, person }) => {
    return (
        <div className={tw("bg-white p-lg flex flex-row w-full")}>
            <div className={tw("w-1/5 m-sm")}>
                <img className={tw("h-16 w-16 rounded-full object-contain")} src={SlackIcon} />
            </div>
            <div className={tw("mx-sm w-4/5 flex flex-col")} >
                <div className={tw("mt-sm flex flex-row justify-between text-xs text-gray-500 tracking-tight")} >
                    <span>Slack</span>
                    <span>Just Now</span>
                </div>
                <span className={tw("my-sm text-xl font-bold text-black")}>
                    New message from {" "}
                    <span className={tw("capitalize")}>
                        {person}
                    </span>
                </span>
                <span className={tw("mb-sm text-gray-600 text-sm vertical-ellipsis-2")} >
                    {message}
                </span>
            </div>
        </div>
    )
}