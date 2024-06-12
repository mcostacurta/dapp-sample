import Web3 from "web3";
import ABI from "./ABI.json"

const CONTRACT_ADDRESS = "0x5133a3c9b4947e9130d119a639dd9fe86ea963c1";

function getContract(){
    if(!window.ethereum) throw new Error("Sem MetaMask instalada!")

    const from = localStorage.getItem("wallet");
    const web3 = new Web3(window.ethereum);

    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function doLogin(){
    if(!window.ethereum) throw new Error("Sem MetaMask instalada!");

    const web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.requestAccounts();
    if (!accounts || !accounts.length) throw new Error("Carteira não permitida")

    localStorage.setItem("wallet", accounts[0].toLowerCase);

    return accounts[0];

}

export async function getOpenRequest(lastId = 0){
    const contract = getContract();
    const requests = contract.methods.getOpenRequest(lastId + 1, 10).call();

    return requests.filter(req => req.title !== "");
}

export async function openRequest({ tittle, description, contact, goal}){
    const contract = getContract();
    return  contract.methods.openRequest(tittle, description, contact, Web3.utils.toWei(goal, "ether")).send();
}

export async function closeRequest(id){
    const contract = getContract();
    return  contract.methods.closeRequest(id).send();
}

export async function donate(id, donationInBnb){
    const contract = getContract();
    return  contract.methods.donate(id).send({
        value: Web3.utils.toWei(donationInBnb, "ether")
    })
}