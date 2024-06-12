"use client"

import { useState, useEffect } from "react"
import { doLogin } from "@/services/Web3Service"

export default function Header() {

    const [wallet, setWallet] = useState("");

    useEffect(() => {
        setWallet(localStorage.getItem("wallet") || "");
    },[]);

    function btnLoginClick(){
        doLogin()
        .then(wallet => setWallet(wallet))
        .catch(err => {
            console.log(err);
            alert(err.message);
        })
    }


    return (
        <header className="p-3 text-bg-dark">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center">
                    <a href="/" className="justify-content-start" style={{ textDecoration: "none" }}>
                        <h1 className="fw-bold text-light">FloodHelp</h1>
                    </a>
                    <div className="text-end col-9">
                        {
                            wallet
                            ? <a href="/create" className="btn btn-warning">Pedir Ajuda</a>
                            : <button type="button" className="btn btn-outline-light me-2" onClick={btnLoginClick}>
                                <img src="https://img.icons8.com/ios/50/000000/ethereum.png" width="24" className="me-3" />
                                Entrar
                               </button>
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}