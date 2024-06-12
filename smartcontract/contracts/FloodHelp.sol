// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

enum Status { Pending, Approved, Rejected }

struct Request {
    uint id;
    address author;
    string title;
    string description;
    string contact;
    uint timestamp;
    uint goal;//wei menor fracao de um ether
    uint balance;
    bool open;
    uint totalDonations;
    Status status;

}

contract owned {
    constructor() { owner = msg.sender; }
    address owner;

    modifier onlyOwner {
        require(owner != address(0), "Invalid address");
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
}

contract FloodHelp is owned{
    uint public lastId = 0;
    mapping(uint => Request) public requests;
    mapping(address => bool) public blacklisted;

    // Event to log blacklisting and unblacklisting
    event Blacklisted(address indexed _address);
    event Unblacklisted(address indexed _address);

    modifier validAddressNotBlacklisted(address _address) {
        require(_address != address(0), "Invalid address");
        require(!blacklisted[_address], "Address is blacklisted");
        _;
    }

    function blacklistAddress(address _address) external onlyOwner {
        blacklisted[_address] = true;
        emit Blacklisted(_address);
    }

    function unblacklistAddress(address _address) external onlyOwner {
        blacklisted[_address] = false;
        emit Unblacklisted(_address);
    }


    function openRequest(string memory title, string memory description, string memory contact, uint goal) public validAddressNotBlacklisted(msg.sender){

        for (uint256 i = 1; i <= lastId; i++) {
            if (requests[i].author == msg.sender) revert(unicode"Você já possui um pedido aberto");
        }

        lastId++;
        requests[lastId] = Request({
            id: lastId,
            title: title,
            description: description,
            contact: contact,
            goal: goal,
            balance: 0,
            timestamp: block.timestamp,
            author: msg.sender,
            open: true,
            totalDonations: 0,
            status: Status.Pending
        });
    }

    function closeRequest(uint id)  public {
        address author = requests[id].author;
        uint balance = requests[id].balance;
        uint goal = requests[id].goal;
        require(requests[id].open && (msg.sender == author || balance >= goal), unicode"Você não pode fechar este pedido");

        requests[id].open = false;

        if(balance > 0 ){
            requests[id].balance = 0;
            payable(author).transfer(balance);
        }
    }

    function approveRequest(uint id)  public onlyOwner {
        requests[id].status = Status.Approved;
    }

    function rejectRequest(uint id)  public onlyOwner {
        requests[id].status = Status.Rejected;
    }

    function forceCloseRequest(uint id)  public onlyOwner {
        address author = requests[id].author;
        uint balance = requests[id].balance;

        requests[id].open = false;

        if(balance > 0 ){
            requests[id].balance = 0;
            payable(author).transfer(balance);
        }

    }

    function donate(uint id) public payable validAddressNotBlacklisted(msg.sender) {
        if (requests[id].open == false) revert("Request is closed");
        if (msg.value == 0) revert("Invalid value");

        if (requests[id].status == Status.Rejected) revert("Request is rejected");
        if(requests[id].status == Status.Pending) revert("Request is pending");
        // if (requests[id].status == Status.Approved && requests[id].balance + msg.value > requests[id].goal) revert("Donation exceeds goal");
        if(requests[id].timestamp + 30 days < block.timestamp) revert("Request is expired");
        

        requests[id].balance += msg.value;
        requests[id].totalDonations++;

        if(requests[id].balance >= requests[id].goal)
            closeRequest(id);
    }

    function getOpenRequest(uint startId, uint quantity) public view returns (Request[] memory) {
        if (quantity == 0 || startId == 0 || startId > lastId) revert("Invalid quantity or startId");
        Request[] memory result = new Request[](quantity);
        uint id = startId;
        uint count = 0;

        do{
            if(requests[id].open){
                result[count] = requests[id];
                count++;
            }
            id++;
        }while(count < quantity && id <= lastId);

        return result;
    }
}