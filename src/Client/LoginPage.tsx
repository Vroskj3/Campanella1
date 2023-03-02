import { Icon } from "@blueprintjs/core";
import React, { useState } from "react";
import { trpc } from "./utils/trpc";
import classNames from "classnames";

const SIGNINCODE = "sg28011";

export default function LoginPage(p: { setLogged: (isLogged: boolean) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isShowed, setShow] = useState(false);
    const [isSingIn, setSignin] = useState(false);
    const [signCode, setSignCode] = useState("");
    const [failedLogin, setFailedLogin] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [isCodeWrong, setIsCodeWrong] = useState(false);
    const login = trpc.login.useMutation();
    const adduser = trpc.addUser.useMutation();
    const isAlreadySigned = trpc.isAlreadySigned.useMutation();
    async function logIn() {
        setFailedLogin(false)
        setIsSigned(false)
        setIsCodeWrong(false)
        const isLogged = await login.mutateAsync({ username: username, password: password })
        if (isLogged) {
            console.log("giusto");
            p.setLogged(true)
        }
        else {
            console.log("errato");
            setFailedLogin(true)
        }
    }
    async function signIn() {
        setFailedLogin(false)
        setIsSigned(false)
        setIsCodeWrong(false)
        await new Promise(r => setTimeout(r, 0));
        if (SIGNINCODE === signCode) {
            const signed = await isAlreadySigned.mutateAsync({ username: username })
            if (signed) {
                setIsSigned(true)
                setFailedLogin(true)
            }
            else {
                if (password != "") {
                    adduser.mutate({ username: username, password: password, lastLogin: new Date().toISOString() })
                    p.setLogged(true)
                }
                else {
                    setFailedLogin(true)
                    setIsSigned(true)
                }
            }
        }
        else {
            setFailedLogin(true)
            setIsCodeWrong(true)
        }
    }
    return <div className="flex w-full h-screen flex-col items-center bg-center bg-cover bg-no-repeat bg-foto-marconi">
        <div className="flex flex-grow items-center">
            <div className={classNames("flex border-2 border-black rounded-lg p-3 flex-col w-full space-y-2 gap bg-white bg-opacity-80", failedLogin ? "animate-error" : "")}>
                <div className="flex flex-col">
                    <div>Username</div>
                    <input type="text" className="border border-black rounded py-1 px-2 focus:outline-none" id="userInput" value={username} onChange={e => { setUsername(e.target.value) }} />
                </div>
                <div>
                    <div>Password</div>
                    <div className="border border-black rounded py-1 px-2 flex flex-grow items-center bg-white">
                        <input type={isShowed ? "text" : "password"} className="flex-grow focus:outline-none" id="passwordInput" value={password} onChange={e => { setPassword(e.target.value) }} />
                        <Icon icon={isShowed ? "eye-open" : "eye-off"} onClick={() => setShow(!isShowed)}></Icon>
                    </div>
                </div>
                {isSingIn ? <div className="flex flex-col">
                    <div>Codice di Registrazione</div>
                    <input type="text" className="border border-black rounded py-1 px-2 focus:outline-none" id="codeInput" value={signCode} onChange={e => { setSignCode(e.target.value) }} />
                </div> : <div></div>}
                <div className="flex justify-center text-red-500 text-sm">
                    {
                        failedLogin ? (isSigned ? <div>Username già registrato o password vuota</div> :
                            (isCodeWrong ? <div>Codice di Registrazione errato</div> : <div>Username o password errati</div>)) : <div></div>
                    }
                </div>
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