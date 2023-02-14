import React, { useEffect, useState } from "react";
import { trpc } from "./utils/trpc";

export default function LoginPage(p: { setLogged: (isLogged: boolean) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const login = trpc.login.useMutation();
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
        console.log("registrazione")
        return <div>ok</div>
    }
    return <div className="flex w-full h-screen flex-col items-center">
        <div className="flex flex-grow items-center">
            <div className="flex border-2 border-black rounded-lg p-3 flex-col w-full space-y-2 gap">
                <div>
                    <div>Username</div>
                    <input type="text" className="border border-black rounded py-1 px-2" id="userInput" value={username} onChange={e => { setUsername(e.target.value) }} />
                </div>
                <div>
                    <div>Password</div>
                    <input type="password" className="border border-black rounded py-1 px-2" id="passwordInput" value={password} onChange={e => { setPassword(e.target.value) }} />
                </div>
                <div className="flex justify-center">
                    <button className="border border-black rounded px-1 mt-1" onClick={logIn}>
                        Log In
                    </button>
                </div>
                <div className="flex justify-end">
                    <button className="text-sm -mt-2 text-sky-500" onClick={signIn}>Registrati</button>
                </div>
            </div>
        </div>
    </div>
}