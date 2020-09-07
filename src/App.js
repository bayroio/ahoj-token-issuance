import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button'
import {ava, xchain, myKeychain, BN, CONFIG} from './server/ava'
import xfaucet from './server/xfaucet'
import {Avalanche, Buffer} from 'avalanche'
import {InitialStates, SecpOutput} from 'avalanche/dist/apis/avm'

//let newAddress1, newAddress2, newAddress3;
//let addressStrings;

async function ManagingXChainKeys(){
    let newAddress1 = myKeychain.makeKey(); 
    console.log("newAddress1: ", newAddress1)

    let newAddress2 = myKeychain.makeKey(); 
    console.log("newAddress2: ", newAddress2)

    let addresses = myKeychain.getAddresses(); //returns an array of Buffers for the addresses
    let addressStrings = myKeychain.getAddressStrings(); 
    console.log("addressStrings: ", addressStrings)

    let exists = myKeychain.hasKey(addresses[0]);
    console.log("exists: ", exists)
    let keypair = myKeychain.getKey(addresses[0])
    console.log("keypair: ", keypair)
    
    let pubk = keypair.getPublicKey(); //returns Buffer
    let pubkstr = keypair.getPublicKeyString(); //returns a cb58 encoded string
    console.log("pubk: ", pubk)
    console.log("pubkstr: ", pubkstr)

    let privk = keypair.getPrivateKey(); //returns Buffer
    let privkstr = keypair.getPrivateKeyString(); //returns a cb58 encoded string
    console.log("privk: ", privk)
    console.log("privkstr: ", privkstr)

    let message = Buffer.from("Wubalubadubdub");
    let signature = keypair.sign(message); //returns a Buffer with the signature
    console.log("signature: ", signature)

    let signerPubk = keypair.recover(message, signature);
    console.log("signerPubk: ", signerPubk)
    let isValid = keypair.verify(message, signature); //returns a boolean
    console.log("isValid: ", isValid)
}

async function CreateAsset() {
//let myNetworkID = 4; //default is 3, we want to override that for our local network
//let myBlockchainID = "jnUjZSRt16TcRnZzmh5aMhavwVHz3zBrSN8GfFMTQkzUnoBxC"; // The XChain blockchainID on this network
let avax = new Avalanche("localhost", 9650, "http") //, myNetworkID, myBlockchainID);
let xchain = avax.XChain();

    // Name our new coin and give it a symbol
    //let name = "TEcoin the coin of Team Entropy";
    //let symbol = "TEEN";
    let name = "MXCoin";
    let symbol = "MXMX";

    // Where is the decimal point indicate what 1 asset is and where fractional assets begin
    // Ex: 1 AVAX is denomination 9, so the smallest unit of AVAX is nanoAVAX (nAVAX) at 10^-9 AVAX
    let denomination = 9;

    myKeychain.makeKey();
    myKeychain.makeKey();

    let addresses = myKeychain.getAddresses();
    let addressStrings = myKeychain.getAddressStrings(); 
    console.log("addressStrings: ", addressStrings)
    let keypair = myKeychain.getKey(addresses[0])
    console.log("keypair: ", keypair)

    // Create outputs for the asset's initial state
    let secpOutput1 = new SecpOutput(new BN(400), addresses, new BN(400), 1);
    let secpOutput2 = new SecpOutput(new BN(500), [addresses[1]], new BN(400), 1);
    let secpOutput3 = new SecpOutput(new BN(600), [addresses[1], addresses[2]], new BN(400), 1);

    // Populate the initialStates with the outputs
    let initialState = new InitialStates();
    initialState.addOutput(secpOutput1);
    initialState.addOutput(secpOutput2);
    initialState.addOutput(secpOutput3);

    // Fetch the UTXOSet for our addresses
    let utxos = await xchain.getUTXOs(addresses);
    console.log("utoxs: ", utxos);

    // Make an unsigned Create Asset transaction from the data compiled earlier
    let unsigned = await xchain.buildCreateAssetTx(utxos, addresses, initialState, name, symbol, denomination);
    console.log("unsigned: ", unsigned);

    let signed = unsigned.sign(myKeychain)
    //let signed = xchain.signTx(unsigned); //returns a Tx class
    console.log("signed: ", signed);
    console.log("tx signed: ", signed.toString());

    // using the Tx class
    let txid = await xchain.issueTx(signed); //returns an Avalanche serialized string for the TxID
    // using the base-58 representation
    //let txid = await xchain.issueTx(signed.toString()); //returns an Avalanche serialized string for the TxID
    // using the transaction Buffer
    //let txid = await xchain.issueTx(signed.toBuffer()); //returns an Avalanche serialized string for the TxID

    // returns one of: "Accepted", "Processing", "Unknown", and "Rejected"
    let status = await xchain.getTxStatus(txid); 

    console.log("Status: ", status)
    console.log("Asset ID: ", txid)
}

async function CreatingAndFundingAddresses() {
    console.log("--- Creating Address ---")

    myKeychain.makeKey();
    myKeychain.makeKey();
    myKeychain.makeKey();

    let addressStrings = myKeychain.getAddressStrings();

    let balance1 = await xchain.getBalance(addressStrings[0], CONFIG.ASSET_ID);
    //let balance1Val = new BN(balance1.balance);
    let balance2 = await xchain.getBalance(addressStrings[1], CONFIG.ASSET_ID);
    let balance3 = await xchain.getBalance(addressStrings[2], CONFIG.ASSET_ID);
    let balance4 = await xchain.getBalance(addressStrings[3], CONFIG.ASSET_ID);

    console.log("Address 1 (faucet): ", addressStrings[0], " balance: ", balance1.balance)
    console.log("Address 2: ", addressStrings[1], " balance: ", balance2.balance)
    console.log("Address 3: ", addressStrings[2], " balance: ", balance3.balance)
    console.log("Address 4: ", addressStrings[3], " balance: ", balance4.balance)

    /*xfaucet.sendTokens(addressStrings[1]).then(txid => {
                    if(txid.status){
                        console.log("TX Id: ", txid);
                    }else{
                        console.log("Success: ", txid);
                    }
                }).catch(err => {
                    console.error("error: ", err);
                });
    */    
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
    let secpOutput3 = new SecpOutput(new BN(600), [addresses[1], addresses[2], addresses[3]], new BN(400), 1);

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
            <Button variant="primary" onClick={ManagingXChainKeys}>Managing X-Chain Keys</Button>{' '}
            <br></br><br></br>
            <Button variant="primary" onClick={CreateAsset}>Creating Kiki Asset</Button>{' '}
            <br></br><br></br>
            <Button variant="primary" onClick={CreatingAndFundingAddresses}>Create Asset</Button>{' '}
            <br></br><br></br>
            <Button variant="primary" onClick={MintingTheAsset}>Minting An Asset</Button>{' '}
        </div>
  );
}

export default App;
