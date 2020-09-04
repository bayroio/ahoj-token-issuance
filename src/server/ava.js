const avalanche = require("avalanche");
const BN = require('bn.js');


const AVA_IP = process.env.REACT_APP_AVA_IP || "localhost";
const AVA_PORT = process.env.REACT_APP_AVA_PORT || 9650;
const AVA_PROTOCOL = process.env.REACT_APP_AVA_PROTOCOL || "https";
const AVA_NETWORK_ID = process.env.REACT_APP_AVA_NETWORK_ID || "12345";

let AVA_CHAIN_ID = process.env.REACT_APP_AVA_CHAIN_ID || 'avm';

const PK_X =  process.env.REACT_APP_PRIVATE_KEY_X; // The private key that holds the given assets to supply the faucet
const PK_C =  process.env.REACT_APP_PRIVATE_KEY_C; // The private key that holds the given assets to supply the faucet
const ASSET_ID = process.env.REACT_APP_ASSET_ID; // Which asset is being sent from the faucet
const DROP_SIZE =  process.env.REACT_APP_DROP_SIZE_X || 1000; // how much of the given asset to transfer from the faucet
const AVAX_FEE =  process.env.REACT_APP_AVAX_FEE || 0; // how much of the given asset to transfer from the faucet

let bintools = avalanche.BinTools.getInstance();

let ava = new avalanche.Avalanche(AVA_IP, AVA_PORT, AVA_PROTOCOL, parseInt(AVA_NETWORK_ID), AVA_CHAIN_ID);
let xchain = ava.XChain();
    xchain.setFee(new BN(AVAX_FEE));


let myKeychain = xchain.keyChain();
let keypair = myKeychain.importKey(PK_X);
const FAUCET_ADDRESS = keypair.getAddressString();  //X-everest1r2fy8xjmx72zxl9ky0xxq9agy5h0tk945ps08w


const CONFIG = {
    AVA_IP: AVA_IP,
    AVA_PORT: AVA_PORT,
    AVA_PROTOCOL: AVA_PROTOCOL,
    AVA_NETWORK_ID: AVA_NETWORK_ID,
    AVA_CHAIN_ID: AVA_CHAIN_ID,
    AVAX_FEE: AVAX_FEE,
    PK_X: PK_X,
    PK_C: PK_C,
    ASSET_ID: ASSET_ID,
    DROP_SIZE: DROP_SIZE,
    FAUCET_ADDRESS: FAUCET_ADDRESS
};

console.log(CONFIG);

function printXInfo(){
    xchain.getBalance(CONFIG.FAUCET_ADDRESS, CONFIG.ASSET_ID).then(res => {
        let balance =  res.balance;
        let fee = xchain.getFee();

        console.log("(X) Faucet Address: ", FAUCET_ADDRESS)
        console.log("(X) Private Key: ", PK_X)
        console.log("(X) Available Balance: ",balance);
        console.log("(X) Droplet size: \t",CONFIG.DROP_SIZE);
        console.log(`(X) Tx Fee: ${fee.toString()}`)
    });
}
printXInfo();

async function checkAssetId(){
    if(!CONFIG.ASSET_ID){
        let res = await xchain.getAssetDescription('AVA');
        CONFIG.ASSET_ID = bintools.cb58Encode(res.assetID);
        console.log("Updated Asset Id: ",CONFIG.ASSET_ID);
    }else{
        let res = await xchain.getAssetDescription(CONFIG.ASSET_ID);
        CONFIG.ASSET_ID = bintools.cb58Encode(res.assetID);
        console.log("Updated Asset Id: ",CONFIG.ASSET_ID);
    }
}
checkAssetId();


module.exports = {
    ava,
    xchain,
    myKeychain,
    bintools,
    BN,
    CONFIG
};
