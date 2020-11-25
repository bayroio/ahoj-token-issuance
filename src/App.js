import React, { useState, useEffect }  from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import { avm, keyStore, xKeychain, BN } from './server/ava'
//import { InitialStates, SECPTransferOutput } from 'avalanche/dist/apis/avm'

import { Magic } from "magic-sdk";
//import { AvalancheExtension } from "@magic-ext/avalanche";

import Table4Assets from './Table4Assets';
import MenuBar from './MenuBar';
import AssetForm from './AssetForm';
import AVAXBalanceForm from './AVAXBalanceForm'
import GetContractBalanceFromCForm from './GetContractBalanceFromCForm'

import 'bootstrap/dist/css/bootstrap.min.css';

const magic = new Magic('pk_test_F4B7DB2E256635A0');

async function CreateAsset(asset) {
    console.log("--- Creating Asset --- ", asset);

    let name = asset.name;
    let symbol = asset.symbol;
    // Where is the decimal point indicate what 1 asset is and where fractional assets begin
    // Ex: 1 AVAX is denomination 9, so the smallest unit of AVAX is nanoAVAX (nAVAX) at 10^-9 AVAX
    let denomination = 9;

    /*
    let addresses = xKeychain.getAddresses();
    let initialHolders = [{"address": addresses[0], "amount": "1000000000000000"}]; //asset.totalsupply}];
    let assetID = xchain.createFixedCapAsset("eherrador", "LFMOxto24", name, symbol, denomination, initialHolders);
    console.log("asset ID: ", assetID)
    return(assetID);
    */

    //xKeychain.makeKey();
    //xKeychain.makeKey();

    let addresses = xKeychain.getAddresses();
    let addressStrings = xKeychain.getAddressStrings(); 
    console.log("addressStrings: ", addressStrings)
    console.log("addresses[0]: ", addresses[0])
    let keypair = xKeychain.getKey(addresses[0])
    console.log("keypair: ", keypair)
    console.log("asset.totalsupply: ", asset.totalsupply);

    /*
    // Create outputs for the asset's inistial state
    let secpOutput1 = new SECPTransferOutput(new BN(asset.totalsupply), addresses, new BN(asset.totalsupply), 1);

    // Populate the initialStates with the outputs
    let initialState = new InitialStates();
    initialState.addOutput(secpOutput1);

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

    //let signed = unsigned.sign(xKeychain)
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
    console.log("asset ID: ", assetID)
    console.log("Transaccion: ", Transaccion)
    console.log("AVAX Asset ID - Buffer: ", AVAXAssetID)
    console.log("AVAX Asset ID - String: ", bintools.cb58Encode(AVAXAssetID))

    return(txid);
    */
}

async function AssetAirdrop() {
    console.log("--- Asset Airdrop ---");

    let addresses = xKeychain.getAddresses();
    let addressStrings = xKeychain.getAddressStrings(); 

    let assetid = "2qoA17geKM6D8oFwaZzRgQ4bE2sthDxhQJ8ZE7sjRC6BRJ7bDh"; //avaSerialized string

    // Fetch the UTXOSet for our addresses
    let utxos = await avm.getUTXOs(addresses);
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
    let unsignedTx = await avm.buildBaseTx(utxos, sendAmount, assetid, [friendsAddress], addressStrings, addressStrings);
    console.log("2");
    let signedTx = avm.signTx(unsignedTx);
    console.log("3");
    let txid = await avm.issueTx(signedTx);
    console.log("4");

    // returns one of: "Accepted", "Processing", "Unknown", and "Rejected"
    let status = await avm.getTxStatus(txid);
    console.log("status Tx: ", status)
    console.log("5");
    let updatedUTXOs = await avm.getUTXOs(addresses);
    console.log("6");
    let newBalance = utxos.getBalance(addresses, assetid);
    console.log("7");
    if(newBalance.toNumber() !== mybalance.sub(sendAmount).toNumber()){
        throw Error("heyyy these should equal!");
    }
}

async function CheckBalance() {
    console.log("--- Check Balance ---")

    let addresses = xKeychain.getAddresses();
    let addressStrings = xKeychain.getAddressStrings();
    
    let assetid = "2qoA17geKM6D8oFwaZzRgQ4bE2sthDxhQJ8ZE7sjRC6BRJ7bDh"; //avaSerialized string

    // Fetch the UTXOSet for our addresses
    let utxos = await avm.getUTXOs(addresses);

    let mybalance = utxos.getBalance(addresses, assetid);
    console.log("Address ", addressStrings[0], " balance: ", mybalance.toNumber())
}

//class App extends Component {
export default function App() {
    const [email, setEmail] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [assets, setAssets] = useState([]);
    const [userMetadata, setUserMetadata] = useState({});
    const [publicAddress, setPublicAddress] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
        setIsLoggedIn(magicIsLoggedIn);
        if (magicIsLoggedIn) {
            const metadata = await magic.user.getMetadata()
            console.log("Metadata: ", metadata)
            setEmail(metadata.email)
            //setPublicAddress(metadata.publicAddress);
            //setUserMetadata(metadata);
        }
        });
    }, [isLoggedIn, userName, password]);

    const login = async () => {
        let DID_Token = await magic.auth.loginWithMagicLink({ email });
        console.log("DID Token ", DID_Token)
        //llamar al api de wallet en el server y pasarle el DID_Token
        //https://3001-fe77f40d-cd5e-45d8-84a7-63e44a6567c1.ws-us02.gitpod.io/api/wallet/getAddress
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await magic.user.logout();
        setIsLoggedIn(false);
    };

    const sendAsset = (asset) => {
        //const { assets } = this.state;
        console.log("asset: ", asset);
    };

    const handleSubmitAssetForm = async (asset) => {
        console.log("Valores: ", asset);
        let txId = await CreateAsset(asset);
        console.log("txID: ", txId);
        asset.assetid = txId;
        asset.totalsupply = asset.totalsupply/1000000000;
        console.log("asset.assetid: ", asset.assetid);
        this.setState({assets: [...this.state.assets, asset]});
    };

    return (
        <div className="App">
        {!isLoggedIn ? (
            <div className="container">
                <h1>Ahoj.Finance</h1>
                <h3>Ahoj.Issuance</h3>
                <hr/>
                <h4><i>Please sign up or login</i></h4>
                <input
                    type="email"
                    name="email"
                    required="required"
                    placeholder="Enter your email"
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
                <button onClick={login}>Send</button>
            </div>
        ) : (
            <div>
                <MenuBar userEmail={userMetadata.email} avaxAddress={publicAddress} logout={logout} />
                <br></br><br></br><br></br>
                <div className="container">
                    <h1>Ahoj.Issuance</h1>
                    <p>Admin Tools for Team Entropy... only!</p>
                    {/* <br />
                    <button onClick={logout}>Logout</button> */}
                </div>
                <div id="creatingasset">
                    <Container>
                        <Card>
                            <Card.Body>
                                <h1>Mint New Assets</h1>
                                <p>PLEASE: Do not mint AHOJ Token!</p>
                                <AssetForm handleSubmitAssetForm={handleSubmitAssetForm} />
                            </Card.Body>
                        </Card>
                        <Table4Assets assetData={assets} sendAsset={sendAsset}/>
                    </Container>
                </div>
                <div id="sendasset">
                    <Container>
                        <Card>
                            <Card.Body>
                                <h1>Send Asset</h1>
                                <AVAXBalanceForm magic={magic} />
                            </Card.Body>
                        </Card>
                    </Container>
                </div>
                <div id="getbalancecontract">
                    <Container>
                        <Card>
                            <Card.Body>
                                <h1>Get Balance of a Contract from C-Chain</h1>
                                < GetContractBalanceFromCForm />
                            </Card.Body>
                        </Card>
                    </Container>
                </div>
                <div id="getbalanceacount">
                    <Container>
                        <Card>
                            <Card.Body>
                                <h1>Get Balance of an Account</h1>
                                < GetContractBalanceFromCForm />
                            </Card.Body>
                        </Card>
                    </Container>
                </div>
            </div>
        )}
        </div>  
    );
}
