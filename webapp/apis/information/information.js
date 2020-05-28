const path = require('path');
const Web3 = require("web3");

const contract_abi = require(path.resolve("../dapp/build/contracts/MyContract.json"));
const httpEndpoint = 'http://localhost:8540';
const myKey = require("../../keys/mykey.json");
const NodeRSA = require('node-rsa');

let contractAddress = require('../../utils/parityRequests').contractAddress;

const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

let web3 = new Web3(httpEndpoint, null, OPTIONS);

let MyContract = new web3.eth.Contract(contract_abi.abi, contractAddress);

module.exports = {
    renderEditInfo: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('editInfo.html');
        }
    },
    renderEditAppInfo: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('editAppInfo.html');
        }
    },
    renderAddAppInfo: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('addAppInfo.html');
        }
    },
    renderViewAvailableData: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('viewAvailableData.html');
        }
    },
    getInformation: async (req, res) => {
        console.log(contractAddress);
        let userAddr = req.session.address;
        console.log("*** Getting Information ***", userAddr);

        await MyContract.methods.getPrivateData()
            .call({ from: userAddr, gas: 3000000 })
            .then(function (privateData){
                const key = new NodeRSA(myKey.privateKey);
                privateData = key.decrypt(privateData, 'utf8');
                res.send({ error: false, msg: "Informações resgatadas com sucesso", privateData});
            }).catch(function (error) {
                console.log("Error:"+error);
                res.send({ error: true, msg: error});
            });
    },
    getAppInfo: async (req, res) => {
        console.log(contractAddress);
        let userAddr = req.session.address;
        let pk = req.body.id;
        console.log("*** Getting APP Info ***", userAddr, pk);

        await MyContract.methods.appInfo(pk)
            .call({ from: userAddr, gas: 3000000 })
            .then(function (appInfo){
                let app = {};
                app.pk = pk; 
                app.name = appInfo['0'];
                app.requiredData = appInfo['1'];
                app.availableData  = appInfo['2'];
                res.send({ error: false, msg: "Informações resgatadas com sucesso", app});
            }).catch(function (error) {
                console.log("Error:"+error);
                res.send({ error: true, msg: error});
            });
    },
    getAppInfos: async (req, res) => {
        console.log(contractAddress)
        let userAddr = req.session.address;
        console.log("*** Getting APPs Info ***", userAddr);
        //console.log(req);

        await MyContract.methods.getAppInfos()
            .call({ from: userAddr, gas: 3000000 })
            .then(function (appInfos) {

                console.log("AppInfos", appInfos);
                if (appInfos === null) {
                    return res.send({ error: false, msg: "no APPs info yet"});
                }

                let appInfoList = [];
                for (i = 0; i < appInfos['0'].length; i++) {
                    let app = {};

                    app.pk = appInfos['0'][i];
                    app.name = appInfos['1'][i];
                    app.requiredData = appInfos['2'][i];
                    app.availableData = appInfos['3'][i];

                    appInfoList.push(app);
                }

                console.log("appInfosList", appInfoList);

                res.send({ error: false, msg: "APPs info resgatadas com sucesso", appInfoList});
                return true;
            })
            .catch(error => {
                console.log("*** informationApi -> getAppInfos ***error:", error);
                res.send({ error: true, msg: error});
            })
    },
    updateInformation: async (req, res) => {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
        
            let userAddr  = req.session.address;
            let pass      = req.session.password;
            let newPrivateData = req.body.newPrivateData;
            const key = new NodeRSA(myKey.publicKey);
            newPrivateData = key.encrypt(newPrivateData, 'base64');

            console.log("apis -> information -> updateInformation: ", userAddr, newPrivateData);

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                console.log("Account unlocked?", accountUnlocked);
                if (accountUnlocked) {

                    await MyContract.methods.updatePrivateData(JSON.stringify(newPrivateData))
                        .send({ from: userAddr, gas: 3000000 })
                        .then(receipt => {
                            console.log(receipt);
                            return res.send({ 'error': false, 'msg': 'Informações atualizadas com sucesso.'}); 
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.json({ 'error': true, msg: "erro ao se comunicar com o contrato"});
                        })
                }
            } catch (error) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    },
    addNewAppInfo: async function(req, res) {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            console.log("*** informationApi -> addNewAppInfo ***");

            let pk = req.body.pk;
            let name   = req.body.name;
            let requiredData = req.body.requiredData;
            let userAddr = req.session.address;
            let pass     = req.session.password;

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                if (accountUnlocked) {

                    await MyContract.methods.setAppInfo(pk, name, requiredData)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(function(result) {
                            console.log(result);
                            return res.send({ 'error': false, 'msg': 'APP cadastrado com sucesso.'});  
                        })
                        .catch(function(err) {
                            console.log(err);
                            return res.send({ 'error': true, 'msg': 'Erro ao comunicar com o contrato.'});
                        })
                } 
            } catch (err) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    },
    eraseDataTo: async function(req, res) {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            console.log("*** informationApi -> eraseDataTo ***");

            let pk = req.body.pk;
            let userAddr = req.session.address;
            let pass     = req.session.password;

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                if (accountUnlocked) {

                    await MyContract.methods.eraseDataTo(pk)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(function(result) {
                            console.log(result);
                            return res.send({ 'error': false, 'msg': 'Informações removidas com sucesso.'});  
                        })
                        .catch(function(err) {
                            console.log(err);
                            return res.send({ 'error': true, 'msg': 'Erro ao comunicar com o contrato.'});
                        })
                } 
            } catch (err) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    },
    setAvailableDataTo: async function(req, res) {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            console.log("*** informationApi -> setAvailableDataTo ***");

            let pk = req.body.pk;
            let userAddr = req.session.address;
            let pass     = req.session.password;

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                if (accountUnlocked) {

                    let privateData = await MyContract.methods.getPrivateData()
                        .call({ from: userAddr, gas: 3000000 });
                    privateData = new NodeRSA(myKey.privateKey).decrypt(privateData, 'utf8');
                    privateData = JSON.parse(privateData);

                    let appInfo = await MyContract.methods.appInfo(pk)
                        .call({ from: userAddr, gas: 3000000});

                    let availableData = {};
                    let requiredData = appInfo['1'];
                    for(let i = 0; i < requiredData.length; i++){
                        availableData[requiredData[i]] = privateData[requiredData[i]];
                    }

                    let newPrivateData = new NodeRSA(pk,'public').encrypt(availableData, 'base64');
                    console.log("newData:"+newPrivateData);

                    await MyContract.methods.setAvailableDataTo(pk, newPrivateData)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(function(result) {
                            console.log(result);
                            return res.send({ 'error': false, 'msg': 'Informações atualizadas com sucesso.'});  
                        })
                        .catch(function(err) {
                            console.log(err);
                            return res.send({ 'error': true, 'msg': 'Erro ao comunicar com o contrato.'});
                        })
                } 
            } catch (err) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.', err});
            }
        }
    },
    decodeData: async (req, res) => {
        let encryptedData = req.body.encryptedData;
        let privateKey = req.body.privateKey;

        try{
            privateData = new NodeRSA(privateKey, 'private').decrypt(encryptedData, 'utf8');
            return res.send({ 'error': false, 'msg': 'Dado decifrado com sucesso!', privateData});
        }catch (err){
            return res.send({ 'error': true, 'msg': 'Erro ao decifrar o dato!', err});
        }
    },
}