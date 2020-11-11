import React, {Component}  from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import {myKeychain} from './server/ava'
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

    //myKeychain.makeKey();
    //myKeychain.makeKey();

    let addresses = myKeychain.getAddresses();
    let addressStrings = myKeychain.getAddressStrings(); 
    console.log("addressStrings: ", addressStrings)
    console.log("addresses[0]: ", addresses[0])
    let keypair = myKeychain.getKey(addresses[0])
    console.log("keypair: ", keypair)

    // Create outputs for the asset's initial state
    //let secpOutput1 = SecpOutput(new BN(asset.totalsupply), addresses, new BN(asset.totalsupply), 1);
    let secpOutput1 = new SECPTransferOutput(new BN(400), new BN(400), 1, addresses)
    //let secpOutput2 = new SecpOutput(new BN(500), [addresses[1]], new BN(400), 1);
    //let secpOutput3 = new SecpOutput(new BN(600), [addresses[1], addresses[2]], new BN(400), 1);

    // Populate the initialStates with the outputs
    let initialState = new InitialStates();
    initialState.addOutput(secpOutput1);
    //initialState.addOutput(secpOutput2);
    //initialState.addOutput(secpOutput3);

    // Fetch the UTXOSet for our addresses
    let utxos = await xchain.getUTXOs(addresses);
    console.log("utoxs: ", utxos);

    // Make an unsigned Create Asset transaction from the data compiled earlier
    let unsigned = await xchain.buildCreateAssetTx(utxos, addresses, initialState, name, symbol, denomination);
    console.log("unsigned: ", unsigned);

    //let signed = unsigned.sign(myKeychain)
    let signed = xchain.signTx(unsigned); //returns a Tx class
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
            avaxAddress: 'X-everest15z9krm5kfsy4vagstfxg9va2qykzgvw806gu8u',
            modalShow: false,
            setModalShow: false
        };

        this.state = this.initialState;
    }
    /*state = {
        assets: [],
        avaxAddress: "X-everest15z9krm5kfsy4vagstfxg9va2qykzgvw806gu8u"
    };*/

    SendAsset = index => {
        const { assets } = this.state;
    }

    handleSubmit = async (asset) => {
        console.log("Valores: ", asset);
        await CreateAsset(asset);
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
