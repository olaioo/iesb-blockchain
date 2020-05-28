const path = require('path');

const allAccountsInfoRequest = { 
    "method": "parity_allAccountsInfo", 
    "params": [], 
    "id": 1, 
    "jsonrpc": "2.0" 
};

const headers = { 'Content-Type': 'application/json' };
const ownerAccount = "0x004ec07d2329997267ec62b4166639513386f32e";
const MyContractJson = require(path.resolve('../dapp/build/contracts/MyContract.json'));
const network = MyContractJson['networks']
const contractAddress = network['8995'].address;

function newAccountRequest(name, pass) {
    let newAccountRequest = { "method": "parity_newAccountFromPhrase", "params": [name, pass], "id": 1, "jsonrpc": "2.0" };

    return newAccountRequest;
}

function setAccountNameRequest(accountAddress, name) {
    let setAccountNameRequest = { "method": "parity_setAccountName", "params": [accountAddress, name], "id": 1, "jsonrpc": "2.0" };

    return setAccountNameRequest; 
}

module.exports = {
    allAccountsInfoRequest,
    newAccountRequest,
    setAccountNameRequest,
    headers,
    ownerAccount,
    contractAddress
}