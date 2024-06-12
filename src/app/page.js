"use client"

import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getOpenRequest } from "@/services/Web3Service";

export default function Home() {
  
  const [requests, setRequests] = useState([]);


  useEffect(() => {
    loadRequests(0);
  }, [])

  async function loadRequests(lastId){
    try {
      const result = await getOpenRequest(lastId);
      console.log(result);
      if(lastId === 0){
        setRequests(result);
      } else {
        requests.push(...result);
        setRequests(requests)
      }

    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <>
    <Header />
    <div>
      <div className="container">
        <div className="row ps-5">
          <p className="lead m-4">Ajude os desabrigados pelas enchentes</p>
        </div>
        <div className="p-4 mx5">
          <div className="list-group">
              {
                requests && requests.length
                ? requests.map(rq => <Request key={rq.id} data={rq}/>)
                : <>Conect sua carteira MetaMask no botão "Entrar" para ajudar ou pedir ajuda.</>
              }
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </>
   
  );
}
