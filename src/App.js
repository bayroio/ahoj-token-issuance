import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button'
import {
    Avalanche,
    BinTools,
    Buffer,
    BN
  } from 'avalanche'

import {
    InitialStates,
    SecpOutput
  } from 'avalanche/dist/apis/avm'

let bintools = BinTools.getInstance();

let ava;
let xchain;
let myKeychain;
let newAddress1, newAddress2, newAddress3;

let keypair;
let addressStrings;

/// The keychain is accessed through the AVM API and can be referenced directly or through a reference variable.
/// This exposes the instance of the class AVM Keychain which is created when the AVM API is created.
/// At present, this supports secp256k1 curve for ECDSA key pairs.
async function AccessingTheKeychain() {
    console.log("--- Accessing Keychain @ X-Chain ---")
    //let mynetworkID = 12345; //default is 3, we want to override that for our local network
    //let myBlockchainID = "rrEWX7gc7D9mwcdrdBxBTdqh1a7WDVsMuadhTZgyXfFcRz45L"; // The AVM blockchainID on this network
    ava = new Avalanche("localhost", 9650, "http") //, mynetworkID, myBlockchainID);
    xchain = ava.XChain(); //returns a reference to the AVM API used by Avalanche.js

    // --- Accessing the keychain ---
    myKeychain = xchain.keyChain();

    console.log("Avalanche instance: ", ava)
    console.log("X-Chain reference: ", xchain)
    console.log("myKeyChain: ", myKeychain)
}

async function CreatingXchainKeypairs() {
    console.log("--- Creating X-Chain key pairs ---")
    newAddress1 = myKeychain.makeKey();
    newAddress2 = myKeychain.makeKey();
    newAddress3 = myKeychain.makeKey();

    let addressStrings = myKeychain.getAddressStrings();

    console.log("Address 1: ", addressStrings[0])
    console.log("Address 2: ", addressStrings[1])
    console.log("Address 3: ", addressStrings[2])
}

async function ManagingKeys() {
    console.log("=== Managing Keys ===")
    AccessingTheKeychain();
    CreatingXchainKeypairs();
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

function App() {
    return (
        <div>
            <header className="App-header">
                <p>
                    Ahoj Token Issuance
                </p>
            </header>
            <body className="App-body">
                <Button variant="primary" onClick={ManagingKeys}>Create Addresses</Button>{' '}
                <Button variant="primary" onClick={CreatingAnAsset}>Minting An Asset</Button>{' '}
            </body>
        </div>
  );
}

export default App;
