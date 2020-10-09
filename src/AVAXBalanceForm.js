import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {xchain, myKeychain, bintools, BN} from './server/ava';

class AVAXBalanceForm extends Component {
    constructor(props) {
        super(props);
        
        this.initialState = {
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
        
        let AVAXAssetID = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
        console.log("AVAX ID: ", AVAXAssetID)
        let avaxBalance = utxos.utxos.getBalance(addresses, AVAXAssetID);
        console.log("avaxBalance: ", avaxBalance)
        let _avaxBalance = avaxBalance.toNumber()/1000000000;
        console.log("AVAX Balance: ", _avaxBalance)
        this.setState({ balance: _avaxBalance})
    }

    onFormSubmitSend = async (event) => {
        event.preventDefault();

        let addresses = myKeychain.getAddresses();
        let addressStrings = myKeychain.getAddressStrings(); 
        console.log(addresses)
        console.log(addressStrings)

        let utxos = await xchain.getUTXOs(addressStrings)
        console.log("utoxs: ", utxos);

        let AVAXAssetID = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK";
        console.log("AVAX ID: ", AVAXAssetID)

        let unsignedTx = await xchain.buildBaseTx(utxos.utxos, new BN(this.state.amount), AVAXAssetID, [this.state.friend], addressStrings, addressStrings);
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
        const {balance, amount, friend} = this.state; 

        return (
            <>
            <Form onSubmit={this.onFormSubmitBalance}>
                <Form.Group>
                    <Form.Control type="text" name="balance" id="balance" placeholder="avax balance" value={balance} readOnly />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Get Balance
                </Button>
            </Form>
            <br />
            <Form onSubmit={this.onFormSubmitSend}>
                <Form.Group>
                    <Form.Control type="text" name="amount" id="amount" placeholder="avax amount to send" value={amount} onChange={this.handleChange} />
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

export default AVAXBalanceForm;