import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {xchain, myKeychain, bintools, BN} from './server/ava';

class AnyOtherAssetForm extends Component {
    constructor(props) {
        super(props);
        
        this.initialState = {
            assetid1: '',
            assetid2: '',
            balance: '',
            amount: '',
            friend: ''
        };

        this.state = this.initialState;
    }

    onFormSubmitBalance = async (event) => {
        event.preventDefault();

        let addresses = myKeychain.getAddresses();
        let addressStrings = myKeychain.getAddressStrings(); 
        console.log(addresses)
        console.log(addressStrings)

        let utxos = await xchain.getUTXOs(addressStrings)
        console.log("utoxs: ", utxos);
        
        let assetID = this.state.assetid1;
        console.log("any other asset: ", assetID)
        let assetBalance = utxos.utxos.getBalance(addresses, assetID);
        console.log("assetBalance: ", assetBalance)
        let _assetBalance = assetBalance.toNumber()/1000000000;
        console.log("Any Other Asset ID Balance: ", _assetBalance)
        this.setState({ balance: _assetBalance})
    }

    onFormSubmitSend = async (event) => {
        event.preventDefault();

        let addresses = myKeychain.getAddresses();
        let addressStrings = myKeychain.getAddressStrings(); 
        console.log(addresses)
        console.log(addressStrings)

        let utxos = await xchain.getUTXOs(addressStrings)
        console.log("utoxs: ", utxos);

        let assetID = this.state.assetid;
        console.log("AnyOther Asset ID: ", assetID)

        let unsignedTx = await xchain.buildBaseTx(utxos.utxos, new BN(this.state.amount), assetID, [this.state.friend], addressStrings, addressStrings);
        let signedTx = xchain.signTx(unsignedTx);
        let txid = await xchain.issueTx(signedTx);  //<-- And the transaction is sent!

        let status = await xchain.getTxStatus(txid);
        console.log("status Tx: ", status)
    }

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({[name] : value});
        console.log(event.target.name);
        console.log(event.target.value);
    }

    render() {
        const {assetid1, assetid2, balance, amount, friend} = this.state; 

        return (
            <>
            <Form onSubmit={this.onFormSubmitBalance}>
                <Form.Group>
                    <Form.Control type="text" name="assetid1" id="assetid1" placeholder="any other asset id" value={assetid1} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Control type="text" name="balance" id="balance" placeholder="any other asset balance" value={balance} readOnly />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Get Balance
                </Button>
            </Form>
            <br />
            <Form onSubmit={this.onFormSubmitSend}>
                <Form.Group>
                    <Form.Control type="text" name="assetid2" id="assetid2" placeholder="any other asset id" value={assetid2} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Control type="text" name="amount" id="amount" placeholder="any other asset amount to send" value={amount} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Control type="text" name="friend" id="friend" placeholder="friend address" value={friend} onChange={this.handleChange} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Send
                </Button>
            </Form>
            </>
        );
    }
}

export default AnyOtherAssetForm;