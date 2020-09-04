import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button'
import {xchain, myKeychain, BN, CONFIG} from './server/ava'
import xfaucet from './server/xfaucet'
//import {Buffer} from 'avalanche'
import {InitialStates, SecpOutput} from 'avalanche/dist/apis/avm'

//let newAddress1, newAddress2, newAddress3;
//let addressStrings;

async function CreatingAndFundingAddresses() {
    console.log("--- Creating Addresses ---")

    /*newAddress1 = myKeychain.makeKey();
    newAddress2 = myKeychain.makeKey();
    newAddress3 = myKeychain.makeKey();*/
    myKeychain.makeKey();
    myKeychain.makeKey();
    myKeychain.makeKey();

    let addressStrings = myKeychain.getAddressStrings();

    let balance = await xchain.getBalance(addressStrings[0], CONFIG.ASSET_ID);
    let balanceVal = new BN(balance.balance);

    console.log("Address 1: ", addressStrings[0], " balance: ", balance, " balanceVal: ", balanceVal)
    console.log("Address 2: ", addressStrings[1], " balance: ", balance, " balanceVal: ", balanceVal)
    console.log("Address 3: ", addressStrings[2], " balance: ", balance, " balanceVal: ", balanceVal)
    console.log("Address 4: ", addressStrings[3], " balance: ", balance, " balanceVal: ", balanceVal)

    xfaucet.sendTokens(addressStrings[1]).then(txid => {
                    if(txid.status){
                        console.log("TX Id: ", txid);
                    }else{
                        console.log("Success: ", txid);
                    }
                }).catch(err => {
                    console.error("error: ", err);
                });
    
    
}

async function MintingTheAsset() {
    // Name our new coin and give it a symbol
    let name = "Kikicoin is the most intelligent coin";
    let symbol = "KIKI";

    // Where is the decimal point indicate what 1 asset is and where fractional assets begin
    // Ex: 1 $AVAX is denomination 9, so the smallest unit of $AVAX is nano-AVAX ($nAVAX) at 10^-9 $AVAX
    let denomination = 9;

    let addresses = myKeychain.getAddresses(); 

    // === Creating the initial state ===
    // We want to mint an asset with 400 coins to all of our managed keys, 500 to the second address we know of, 
    // and 600 to the second and third address. This sets up the state that will result from the Create Asset transaction.
    // Note: This example assumes we have the keys already managed in our AVM Keychain.

    // Create outputs for the asset's initial state
    let secpOutput1 = new SecpOutput(new BN(400), addresses, new BN(400), 1);
    let secpOutput2 = new SecpOutput(new BN(500), [addresses[1]], new BN(400), 1);
    let secpOutput3 = new SecpOutput(new BN(600), [addresses[1], addresses[2]], new BN(400), 1);

    console.log("secpOutput1: ", secpOutput1)
    console.log("secpOutput2: ", secpOutput2)
    console.log("secpOutput3: ", secpOutput3)

    // Populate the initialStates with the outputs
    let initialState = new InitialStates();
    initialState.addOutput(secpOutput1);
    initialState.addOutput(secpOutput2);
    initialState.addOutput(secpOutput3);

    // Fetch the UTXOSet for our addresses
    let utxos = await xchain.getUTXOs(addresses);

    // Make an unsigned Create Asset transaction from the data compiled earlier
    let unsigned = await xchain.buildCreateAssetTx(utxos, addresses, initialState, name, symbol, denomination);

    let signed = xchain.signTx(unsigned); //returns a Tx class

    // using the Tx class
    let txid = await xchain.issueTx(signed); //returns an Avalanche serialized string for the TxID

    // returns one of: "Accepted", "Processing", "Unknown", and "Rejected"
    let status = await xchain.getTxStatus(txid); 

    console.log("Status: ", status)
    console.log("Asset ID: ", txid)
}

async function CreatingAnAsset() {
    console.log("=== Creating An Asset ===")
    MintingTheAsset();
}

/*function DisplayEnviroment() {
    //console.log(`Nombre ${process.env.REACT_APP_NOMBRE}`);
    console.log("REACT_APP_AVA_IP: ", process.env.REACT_APP_AVA_IP);
    console.log("REACT_APP_ASSET_ID: ", process.env.REACT_APP_ASSET_ID);
    console.log("REACT_APP_DROP_SIZE_X: ", process.env.REACT_APP_DROP_SIZE_X);
}*/

function App() {
    return (
        <div>
            <header className="App-header">
                <p>
                    Ahoj Token Issuance
                </p>
            </header>
            <Button variant="primary" onClick={CreatingAndFundingAddresses}>Creating Addresses</Button>{' '}
            <Button variant="primary" onClick={CreatingAnAsset}>Minting An Asset</Button>{' '}
        </div>
  );
}

export default App;
