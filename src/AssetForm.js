import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Row,Col } from 'react-bootstrap';

class AssetForm extends Component {
    constructor(props) {
        super(props);
        
        this.initialState = {
            //assetid:'',
            name: '',
            symbol: '',
            totalsupply: ''
        };

        this.state = this.initialState;
    }

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({[name] : value});
        console.log(event.target.name);
        console.log(event.target.value);
    }

    onFormSubmit = (event) => {
        event.preventDefault();
        
        this.props.handleSubmitAssetForm(this.state);
        this.setState(this.initialState);
    }

    render() {
        const { name, symbol, totalsupply } = this.state; 

        return (
            <Form onSubmit={this.onFormSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" id="name" placeholder="name of asset" value={name} onChange={this.handleChange}/>
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Symbol</Form.Label>
                            <Form.Control type="text" name="symbol" id="symbol" placeholder="symbol" value={symbol} onChange={this.handleChange}/>
                        </Form.Group>
                    </Col>  
                    <Col>
                        <Form.Group>
                            <Form.Label>Total Supply</Form.Label>
                            <Form.Control type="text" name="totalsupply" id="totalsupply" placeholder="total supply" value={totalsupply} onChange={this.handleChange}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit">
                    Create Asset
                </Button>
            </Form>
        );
    }
}

export default AssetForm;