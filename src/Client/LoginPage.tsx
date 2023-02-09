import { log } from "console";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { trpc } from "./utils/trpc";

export default function LoginPage() {
    const [loginEnable, setLoginEnable] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const login = trpc.login.useQuery({
        username: username, password: password
    }, { enabled: loginEnable })
    useEffect(() => {
        if (login.isFetched) {
            if (login.data) {
                console.log("giusto");
            }
            else {
                console.log("errato");
                setLoginEnable(false);
            }
        }
    }, [login.isFetched, loginEnable])
    function logIn() {
        setLoginEnable(true);

    }
    return <div className="flex w-full h-screen flex-col items-center">
        <div className="flex flex-grow items-center">
            <div className="flex border-2 border-black rounded-lg p-3 flex-col w-full space-y-2">
                <div>
                    <div>Username</div>
                    <input type="text" className="border border-black rounded py-1 px-2" id="userInput" value={username} onChange={e => { setUsername(e.target.value) }} />
                </div>
                <div>
                    <div>Password</div>
                    <input type="password" className="border border-black rounded py-1 px-2" id="passwordInput" value={password} onChange={e => { setPassword(e.target.value) }} />
                </div>
                <div className="flex justify-center">
                    <button className="border border-black rounded px-1" onClick={logIn}>
                        Log In
                    </button>
                </div>
            </div>
        </div>
    </div>
}