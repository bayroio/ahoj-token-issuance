import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {xchain, myKeychain, bintools, BN} from './server/ava';

async function EVM_GetBalance(cchainaddress) {
    console.log("C-Chain Address: ", cchainaddress)

    fetch("http://localhost:9650/ext/bc/C/rpc", {
        body: JSON.stringify({jsonrpc:'2.0',method:'eth_getBalance',params:[cchainaddress, "latest"],id:1}),
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Accept": "application/json, text/plain, */*",
        },
        method: "POST",
        mode: 'no-cors',
    })
    .then(response => response.json())
    .then((result) => {
        console.log("Balance: ", result)
        this.state.balance=result.result
    })
    .catch((error) => {
        console.log(error);
    });
}

class GetContractBalanceFromCForm extends Component {
    constructor(props) {
        super(props);
        
        this.initialState = {
            balance: '',
            address: '',
        };

        this.state = this.initialState;
    }

    onFormSubmitBalance = async (event) => {
        event.preventDefault();

        await EVM_GetBalance(this.state.address)
    }

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({[name] : value});
        console.log(event.target.name);
        console.log(event.target.value);
    }

    render() {
        const {balance, address} = this.state; 

        return (
            <Form onSubmit={this.onFormSubmitBalance}>
                <Form.Group>
                    <Form.Control type="text" name="address" id="address" placeholder="C-Chain address" value={address} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Control type="text" name="balance" id="balance" placeholder="avax balance" value={balance} readOnly />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Get Balance
                </Button>
            </Form>
        );
    }
}

export default GetContractBalanceFromCForm;