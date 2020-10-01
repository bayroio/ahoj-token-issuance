import React, {Component}  from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import {xchain, myKeychain, bintools, BN} from './server/ava'
import {InitialStates, SECPTransferOutput} from 'avalanche/dist/apis/avm'

import Table4Assets from './Table4Assets';
import MenuBar from './MenuBar';
import AssetForm from './AssetForm';

import 'bootstrap/dist/css/bootstrap.min.css';

async function CreateAsset(asset) {
    console.log("--- Creating Asset --- ", asset);

    
    let name = asset.name;
    let symbol = asset.symbol;

    // Where is the decimal point indicate what 1 asset is and where fractional assets begin
    // Ex: 1 AVAX is denomination 9, so the smallest unit of AVAX is nanoAVAX (nAVAX) at 10^-9 AVAX
    let denomination = 9;

    /*
    let addresses = myKeychain.getAddresses();
    let initialHolders = [{"address": addresses[0], "amount": "1000000000000000"}]; //asset.totalsupply}];
    let assetID = xchain.createFixedCapAsset("eherrador", "LFMOxto24", name, symbol, denomination, initialHolders);
    console.log("asset ID: ", assetID)
    return(assetID);
    */

    //myKeychain.makeKey();
    //myKeychain.makeKey();

    let addresses = myKeychain.getAddresses();
    let addressStrings = myKeychain.getAddressStrings(); 
    console.log("addressStrings: ", addressStrings)
    console.log("addresses[0]: ", addresses[0])
    let keypair = myKeychain.getKey(addresses[0])
    console.log("keypair: ", keypair)
    console.log("asset.totalsupply: ", asset.totalsupply);

    // Create outputs for the asset's inistial state
    let secpOutput1 = new SECPTransferOutput(new BN(asset.totalsupply), addresses, new BN(asset.totalsupply), 1);
    //let secpOutput1 = new SECPTransferOutput(new BN(400), addresses, new BN(400), 1)
    //let secpOutput2 = new SecpOutput(new BN(500), [addresses[1]], new BN(400), 1);
    //let secpOutput3 = new SecpOutput(new BN(600), [addresses[1], addresses[2]], new BN(400), 1);

    // Populate the initialStates with the outputs
    let initialState = new InitialStates();
    initialState.addOutput(secpOutput1);
    //initialState.addOutput(secpOutput2);
    //initialState.addOutput(secpOutput3);

    // Fetch the UTXOSet for our addresses
    let utxos = await xchain.getUTXOs(addressStrings); //[0]);
    console.log("utoxs: ", utxos);

    // Make an unsigned Create Asset transaction from the data compiled earlier
    console.log("name: ", name)

    //let unsigned = utxos.utxos.buildCreateAssetTx(5, xchain.getBlockchainID, addresses, addresses, initialState, name, symbol, denomination);

    let unsigned = await xchain.buildCreateAssetTx(
        utxos.utxos, addressStrings, addressStrings, initialState, 
        name, symbol, denomination
    );
    console.log("unsigned: ", unsigned);

    //let signed = unsigned.sign(myKeychain)
    let signed = xchain.signTx(unsigned); //returns a Tx class
    console.log("signed: ", signed);
    console.log("tx signed: ", signed.toString());

    // using the Tx class
    let txid = await xchain.issueTx(signed.toBuffer()); //returns an Avalanche serialized string for the TxID
    // using the base-58 representation
    //let txid = await xchain.issueTx(signed.toString()); //returns an Avalanche serialized string for the TxID
    // using the transaction Buffer
    //let txid = await xchain.issueTx(signed.toBuffer()); //returns an Avalanche serialized string for the TxID

    console.log("utoxs: ", utxos.utxos.getAssetIDs());

    // returns one of: "Accepted", "Processing", "Unknown", and "Rejected"
    let status = await xchain.getTxStatus(txid); 
    //let Transaccion = await xchain.getTx(txid);
    let AVAXAssetID = xchain.AVAXAssetID;

    console.log("Status: ", status)
    console.log("Asset ID/TxID: ", txid)
    //console.log("asset ID: ", assetID)
    //console.log("Transaccion: ", Transaccion)
    //console.log("AVAX Asset ID - Buffer: ", AVAXAssetID)
    console.log("AVAX Asset ID - String: ", bintools.cb58Encode(AVAXAssetID))

    return(txid);
}

async function AssetAirdrop() {
    console.log("--- Asset Airdrop ---");

    let addresses = myKeychain.getAddresses();
    let addressStrings = myKeychain.getAddressStrings(); 

    let assetid = "2qoA17geKM6D8oFwaZzRgQ4bE2sthDxhQJ8ZE7sjRC6BRJ7bDh"; //avaSerialized string

    // Fetch the UTXOSet for our addresses
    let utxos = await xchain.getUTXOs(addresses);
    let mybalance = utxos.getBalance(addresses, assetid);

    let sendAmount = new BN(5); //amounts are in BN format
    let friendsAddress = "X-everest1vpd7skm7q45rm5jey4me4ak40tunj3fsz3802f"; // address format is Bech32

    //The below returns a UnsignedTx
    //Parameters sent are (in order of appearance):
    //   * The UTXO Set
    //   * The amount being sent as a BN
    //   * An array of addresses to send the funds
    //   * An array of addresses sending the funds
    //   * An array of addresses any leftover funds are sent
    //   * The AssetID of the funds being sent
    console.log("1");
    let unsignedTx = await xchain.buildBaseTx(utxos, sendAmount, assetid, [friendsAddress], addressStrings, addressStrings);
    console.log("2");
    let signedTx = xchain.signTx(unsignedTx);
    console.log("3");
    let txid = await xchain.issueTx(signedTx);
    console.log("4");

    // returns one of: "Accepted", "Processing", "Unknown", and "Rejected"
    let status = await xchain.getTxStatus(txid);
    console.log("status Tx: ", status)
    console.log("5");
    let updatedUTXOs = await xchain.getUTXOs(addresses);
    console.log("6");
    let newBalance = utxos.getBalance(addresses, assetid);
    console.log("7");
    if(newBalance.toNumber() !== mybalance.sub(sendAmount).toNumber()){
        throw Error("heyyy these should equal!");
    }
}

async function CheckBalance() {
    console.log("--- Check Balance ---")

    let addresses = myKeychain.getAddresses();
    let addressStrings = myKeychain.getAddressStrings();
    
    let assetid = "2qoA17geKM6D8oFwaZzRgQ4bE2sthDxhQJ8ZE7sjRC6BRJ7bDh"; //avaSerialized string

    // Fetch the UTXOSet for our addresses
    let utxos = await xchain.getUTXOs(addresses);

    let mybalance = utxos.getBalance(addresses, assetid);
    console.log("Address ", addressStrings[0], " balance: ", mybalance.toNumber())

    /*xchain.getBalance(addressStrings[0], "2qoA17geKM6D8oFwaZzRgQ4bE2sthDxhQJ8ZE7sjRC6BRJ7bDh").then(res => {
        let balance =  res.balance;
        console.log("Address ", addressStrings[0], " balance: ", res.balance)
    });*/
}

/*function DisplayEnviroment() {
    //console.log(`Nombre ${process.env.REACT_APP_NOMBRE}`);
    console.log("REACT_APP_AVA_IP: ", process.env.REACT_APP_AVA_IP);
    console.log("REACT_APP_ASSET_ID: ", process.env.REACT_APP_ASSET_ID);
    console.log("REACT_APP_DROP_SIZE_X: ", process.env.REACT_APP_DROP_SIZE_X);
}*/

class App extends Component {
    constructor(props) {
        super(props);
        
        this.initialState = {
            assets: [],
            // Internal Address: X-fuji10749uc4dqgvhasvyrd0urq2jcyrheyfe3aldq9
            // External Address 0 with Balance: X-fuji1fd2h5ers2xffll2s7d9m0npn4wf0ghwfmmcuaf
            // External Address 1: X-fuji1vpd7skm7q45rm5jey4me4ak40tunj3fshysfw6
            // Derived AVAX Wallet Address: X-fuji1vpd7skm7q45rm5jey4me4ak40tunj3fshysfw6
            avaxAddress: myKeychain.getAddressStrings(),//'X-fuji1fd2h5ers2xffll2s7d9m0npn4wf0ghwfmmcuaf',
            modalShow: false,
            setModalShow: false
        };

        this.state = this.initialState;
    }

    SendAsset = index => {
        const { assets } = this.state;
    }

    handleSubmit = async (asset) => {
        console.log("Valores: ", asset);
        let txId = await CreateAsset(asset);
        console.log("txID: ", txId);
        asset.assetid = txId;
        asset.totalsupply = asset.totalsupply/1000000000;
        console.log("asset.assetid: ", asset.assetid);
        this.setState({assets: [...this.state.assets, asset]});
    }

    render() {
        const { assets, avaxAddress } = this.state;

        return (
            <div>
                <MenuBar avaxAddress={avaxAddress} />
                <br></br><br></br><br></br>
                <div id="creatingasset">
                    <Container>
                        <Card>
                            <Card.Body>
                                <h1>Assets</h1>
                                <AssetForm handleSubmit={this.handleSubmit} />
                            </Card.Body>
                        </Card>
                        <Table4Assets assetData={assets} sendAsset={this.sendAsset}/>
                    </Container>
                </div>
            </div>
        );
    }
}

export default App;
