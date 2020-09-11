import React from 'react';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Nav from 'react-bootstrap/Nav'
import {xchain, myKeychain, BN} from './server/ava'
import {InitialStates, SecpOutput} from 'avalanche/dist/apis/avm'
import 'bootstrap/dist/css/bootstrap.min.css';

async function CreateAsset() {
    console.log("--- Creating Asset ---");

    let name = "Castor Token";
    let symbol = "KTOR";

    // Where is the decimal point indicate what 1 asset is and where fractional assets begin
    // Ex: 1 AVAX is denomination 9, so the smallest unit of AVAX is nanoAVAX (nAVAX) at 10^-9 AVAX
    let denomination = 9;

    //myKeychain.makeKey();
    //myKeychain.makeKey();

    let addresses = myKeychain.getAddresses();
    let addressStrings = myKeychain.getAddressStrings(); 
    console.log("addressStrings: ", addressStrings)
    let keypair = myKeychain.getKey(addresses[0])
    console.log("keypair: ", keypair)

    // Create outputs for the asset's initial state
    let secpOutput1 = new SecpOutput(new BN(400), addresses[0], new BN(400), 1);
    //let secpOutput2 = new SecpOutput(new BN(500), [addresses[1]], new BN(400), 1);
    //let secpOutput3 = new SecpOutput(new BN(600), [addresses[1], addresses[2]], new BN(400), 1);

    // Populate the initialStates with the outputs
    let initialState = new InitialStates();
    initialState.addOutput(secpOutput1);
    //initialState.addOutput(secpOutput2);
    //initialState.addOutput(secpOutput3);

    // Fetch the UTXOSet for our addresses
    let utxos = await xchain.getUTXOs(addresses);
    //console.log("utoxs: ", utxos);

    // Make an unsigned Create Asset transaction from the data compiled earlier
    let unsigned = await xchain.buildCreateAssetTx(utxos, addresses, initialState, name, symbol, denomination);
    //console.log("unsigned: ", unsigned);

    //let signed = unsigned.sign(myKeychain)
    let signed = xchain.signTx(unsigned); //returns a Tx class
    //console.log("signed: ", signed);
    //console.log("tx signed: ", signed.toString());

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

function App() {
    return (
        <div>
            <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#creatingasset">Ahoj.AssetIssuance</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        
                    </Nav>
                    <Nav>
                        <NavDropdown title="X-everest15z9krm5kfsy4vagstfxg9va2qykzgvw806gu8u" id="avax-address">
                            <NavDropdown.Item href="#">X-everest15z9krm5kfsy4vagstfxg9va2qykzgvw806gu8u</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">+ new address</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">Access / Disconnect</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Everest" id="select-network">
                            <NavDropdown.Item href="#">Everest Testnet</NavDropdown.Item>
                            <NavDropdown.Item href="#">Localhost</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">+ custom network</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <br></br><br></br><br></br>
            <main>
                <div id="creatingasset">
                    <Container>
                        <Card>
                            <Card.Body><h1>Assets</h1><Button variant="link" onClick={CreateAsset}>+ create asset</Button></Card.Body>
                        </Card>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Asset ID</th>
                                    <th>Name</th>
                                    <th>Symbol</th>
                                    <th>Total Supply</th>
                                    <th><Button variant="outline-info">Reload</Button></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>2wR5jFEHeECTQLbWWQr1fhJuj4FDNjGviCBRTamvGTqayVBDrC</td>
                                    <td>TEcoin the coin of Team Entropy</td>
                                    <td>TEEN</td>
                                    <td>0.00</td>
                                    <th>
                                        <Button variant="outline-success" onClick={AssetAirdrop}>Send</Button>
                                    </th>
                                </tr>
                                    <td>2</td>
                                    <td>2J8rV9wPmsJJXHHzLf9aUiqWRC5LmHdN3dfuvNUvaYnoSr8pVe</td>
                                    <td>Psycho Token</td>
                                    <td>SIKO</td>
                                    <td>0.00</td>
                                    <th>
                                        <Button variant="outline-success" onClick={AssetAirdrop}>Send</Button>
                                    </th>
                            </tbody>
                        </Table>
                    </Container>
                </div>
            </main>
        </div>
    );
}

export default App;
