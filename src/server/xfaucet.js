//const {CONFIG, xchain, bintools} = require('./ava');
const {CONFIG, xchain} = require('./ava');
//const {sendAvaC, CONFIG_C} = require("./eth");
const BN = require('bn.js');

const xfaucet = {
    sendTokens: async function(addr){
        let myAddresses = [CONFIG.FAUCET_ADDRESS];
        console.log(myAddresses);
        let utxos = await xchain.getUTXOs(myAddresses);
        console.log(utxos.getAllUTXOs());
        let sendAmount = new BN(CONFIG.DROP_SIZE);


        // If balance is lower than drop size, throw an insufficient funds error
        let balance = await xchain.getBalance(CONFIG.FAUCET_ADDRESS, CONFIG.ASSET_ID);
        let balanceVal = new BN(balance.balance);

        if(sendAmount.gt(balanceVal)){
            console.log("Insufficient funds. Remaining AVAX: ",balanceVal.toString());
            return {
                status: 'error',
                message: 'Insufficient funds to create the transaction. Please file an issues on the repo: https://github.com/ava-labs/faucet-site'
            }
        }
        console.log(xchain.getBlockchainID());
        console.log("sendAmount: ", sendAmount);
        console.log("CONFIG.ASSET_ID: ", CONFIG.ASSET_ID);
        console.log("[addr]: ", [addr]);
        console.log("myAddresses: ", myAddresses);
        let unsigned_tx = await xchain.buildBaseTx(utxos, sendAmount, CONFIG.ASSET_ID,[addr], myAddresses, myAddresses ).catch(err => {
            console.log(err);
        });

        // Meaning an error occurred
        if(unsigned_tx.status){
            return unsigned_tx;
        }

        let signed_tx = xchain.signTx(unsigned_tx);
        let txid = await xchain.issueTx(signed_tx);

        console.log(`(X) Sent a drop with tx id:  ${txid} to address: ${addr}`);
        return txid;
    }
}

// Sends a drop from the faucet to the given address
/*async function sendTokens(addr){
    let myAddresses = [CONFIG.FAUCET_ADDRESS];
    console.log(myAddresses);
    let utxos = await avm.getUTXOs(myAddresses);
    console.log(utxos.getAllUTXOs());
    let sendAmount = new BN(CONFIG.DROP_SIZE);


    // If balance is lower than drop size, throw an insufficient funds error
    let balance = await avm.getBalance(CONFIG.FAUCET_ADDRESS, CONFIG.ASSET_ID);
    let balanceVal = new BN(balance.balance);

    if(sendAmount.gt(balanceVal)){
        console.log("Insufficient funds. Remaining AVAX: ",balanceVal.toString());
        return {
            status: 'error',
            message: 'Insufficient funds to create the transaction. Please file an issues on the repo: https://github.com/ava-labs/faucet-site'
        }
    }
    console.log(avm.getBlockchainID());
    let unsigned_tx = await avm.buildBaseTx(utxos, sendAmount, CONFIG.ASSET_ID,[addr], myAddresses, myAddresses ).catch(err => {
        console.log(err);
    });

    // Meaning an error occurred
    if(unsigned_tx.status){
        return unsigned_tx;
    }

    let signed_tx = avm.signTx(unsigned_tx);
    let txid = await avm.issueTx(signed_tx);

    console.log(`(X) Sent a drop with tx id:  ${txid} to address: ${addr}`);
    return txid;
}*/

export default xfaucet;
/*module.exports = {
    xfaucet
};*/