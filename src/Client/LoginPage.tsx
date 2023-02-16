import { Icon } from "@blueprintjs/core";
import React, { useState } from "react";
import { trpc } from "./utils/trpc";

const SIGNINCODE = "sg28011";

export default function LoginPage(p: { setLogged: (isLogged: boolean) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isShowed, setShow] = useState(false);
    const [isSingIn, setSignin] = useState(false);
    const [signCode, setSignCode] = useState("");
    const login = trpc.login.useMutation();
    const adduser = trpc.addUser.useMutation();
    async function logIn() {
        const isLogged = await login.mutateAsync({ username: username, password: password })
        if (isLogged) {
            console.log("giusto");
            p.setLogged(true)
        }
        else {
            console.log("errato");
        }
    }
    async function signIn() {
        if (SIGNINCODE === signCode) {
            adduser.mutate({ username: username, password: password, lastLogin: new Date().toISOString() })
            p.setLogged(true)
        }
    }
    return <div className="flex w-full h-screen flex-col items-center">
        <div className="flex flex-grow items-center">
            <div className="flex border-2 border-black rounded-lg p-3 flex-col w-full space-y-2 gap">
                <div className="flex flex-col">
                    <div>Username</div>
                    <input type="text" className="border border-black rounded py-1 px-2 focus:outline-none" id="userInput" value={username} onChange={e => { setUsername(e.target.value) }} />
                </div>
                <div>
                    <div>Password</div>
                    <div className="border border-black rounded py-1 px-2 flex items-center">
                        <input type={isShowed ? "text" : "password"} className="focus:outline-none" id="passwordInput" value={password} onChange={e => { setPassword(e.target.value) }} />
                        <Icon icon={isShowed ? "eye-open" : "eye-off"} onClick={() => setShow(!isShowed)}></Icon>
                    </div>
                </div>
                {isSingIn ? <div className="flex flex-col">
                    <div>Codice di Registrazione</div>
                    <input type="text" className="border border-black rounded py-1 px-2 focus:outline-none" id="codeInput" value={signCode} onChange={e => { setSignCode(e.target.value) }} />
                </div> : <div></div>}
                <div className="flex justify-center">
                    {isSingIn ? <button className="border border-black rounded px-1 mt-1" onClick={signIn}>
                        Sign In
                    </button> : <button className="border border-black rounded px-1 mt-1" onClick={logIn}>
                        Log In
                    </button>}
                </div>
                <div className="flex justify-end">
                    {isSingIn ?
                        <button className="text-sm -mt-2 text-sky-500" onClick={() => setSignin(false)}>Log In</button>
                        : <button className="text-sm -mt-2 text-sky-500" onClick={() => setSignin(true)}>Registrati</button>}
                </div>
            </div>
        </div>
    </div>
}