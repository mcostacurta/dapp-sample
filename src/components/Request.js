import { closeRequest } from "@/services/Web3Service";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import web3 from "web3"


export default function Request({ data }){

    function btnCloseClick(){
        if(!confirm("Tem certeza que deseja fechar o pedido?")) return;
    
        closeRequest(data.id)
        .then(result => {
            alert("Pedido fecahdo com sucesso. Em alguns minutos deixara de ser visto no site.")
            window.location.reload();
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        })
    }
    
    function btnHelpClick(){
        const donationInBnb = prompt("O quanto deseja doar (em BNB)", 0);
        donate(data.id, donationInBnb)
        .then(result => {
            alert("Doação efetuada com sucesso. Em alguns minutos será processada!");
            window.location.reload();
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        })
    }

    returrn (
        <>
            <div className="list-group-item list-group-item-action d-flex gap-3 py-3">
                <img src={generateAvatarURL(data.author)} width="32" height="32" className="rouded-circle" />
                <div className="d-flex gap-2 w-100 justify-content-between">
                    <div className="w-100">
                        <div className="row">
                            <div className="col-10">
                                <div className="mb-0">
                                    <h6 className="mb-0">{data.title} &rsaquo;&rsaquo; Contato {data.contact} </h6>
                                </div>
                                <div className="col-2">
                                    <div className="text-end">
                                        {
                                            localStorage.getItem("wallet") === data.author.toLowerCase()
                                            ? <button type="button" className="btn btn-danger btn-small" onClick={btnCloseClick}>Fechar</button>
                                            : <button type="button" className="btn btn-success btn-small" onClick={btnHelpClick}>&#36; Ajudar</button>
                                        }

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="opacity-75 pe-5 mb-0 me-5">{data.description}</p>
            <div className="row">
                <div className="col">
                    <span className="me-1 opacity-75">Meta:</span>
                    <span className="me-1 opacity-50">
                        {
                            data.balance
                                ? `BNB ${web3.utils.fromWei(data.balance, "ether")} obtidos de ${web3.utils.fromWei(data.goal, "ether")}`
                                : `BNB ${web3.utils.fromWei(data.goal, "ether")}`
                        }
                    </span>
                </div>
            </div>

        </>
    )
}