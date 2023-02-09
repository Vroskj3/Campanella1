import React, { useEffect, useState } from "react";
import { z } from "zod";
import { trpc } from "./utils/trpc";

export default function LoginPage() {
    const [loginEnable, useLoginEnable] = useState(false);
    let isjoaj = trpc.test.useQuery().data
    console.log(isjoaj);
    /*const login = trpc.login.useQuery({ username: "Alfio", password: "Alfio1" }).data; {
        username: (document.getElementById("userInput") as HTMLInputElement).value ?? "",
        password: (document.getElementById("passwordInput") as HTMLInputElement).value ?? ""
    }, { enabled: false }) */
    function ok() {
        console.log(isjoaj);
    }
    /* useEffect(() => {
        if (login === undefined) {
            console.log("user not exist")
        }
        else if (login) {
            console.log("giusto");
        }
        else {
            console.log("errato");
        }
    }, [loginEnable]) */
    /* function logIn(login: any) {
        useLoginEnable(true);
        
    } */
    return <div className="flex w-full h-screen flex-col items-center">
        <div className="flex flex-grow items-center">
            <div className="flex border-2 border-black rounded-lg p-3 flex-col w-full space-y-2">
                <div>
                    <div>Username</div>
                    <input type="text" className="border border-black rounded" id="userInput" />
                </div>
                <div>
                    <div>Password</div>
                    <input type="password" className="border border-black rounded" id="passwordInput" />
                </div>
                <div className="flex justify-center">
                    <button className="border border-black rounded px-1" onClick={ok}>
                        Log In
                    </button>
                </div>
            </div>
        </div>
    </div>
}