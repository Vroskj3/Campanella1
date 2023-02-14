import React, { useState } from "react";
import { Icon } from "@blueprintjs/core";
import classNames from "classnames";

export default function HomePage() {
    const [isBellRinging, setBellRinging] = useState(false)
    return <div className="flex p-20 border border-purple-500 h-full">
        <div className="flex flex-col border border-blue-800">
            <div className="flex border">
                <Icon icon="notifications" size={200} className={classNames(isBellRinging ? "animate-wave" : "animate-none", "fill-purple-800")} onClick={() => setBellRinging((prev) => !prev)} />
            </div>
            <div>{isBellRinging ? "La campana sta suonando" : "La campana suona fra " + new Date().getHours().toString() + ":" + (new Date().getMinutes() + 5).toString()}</div>
        </div>
    </div>
}