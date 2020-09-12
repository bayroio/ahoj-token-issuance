import React, {Component} from 'react';

class Form extends Component {
    constructor(props) {
        super(props);
        
        this.initialState = {
            assetid: '',
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
        
        this.props.handleSubmit(this.state);
        this.setState(this.initialState);
    }

    render() {
        const { assetid, name, symbol, totalsupply } = this.state; 

        return (
            <form onSubmit={this.onFormSubmit}>
                <label for="name">Asset Id</label>{' '}
                <input 
                    type="text" 
                    name="assetid" 
                    id="assetid"
                    value={assetid} 
                    onChange={this.handleChange} />
                <br></br>
                <label for="job">Name</label>{' '}
                <input 
                    type="text" 
                    name="name" 
                    id="name"
                    value={name} 
                    onChange={this.handleChange} />
                <br></br>
                <label for="job">Symbol</label>{' '}
                <input 
                    type="text" 
                    name="symbol" 
                    id="symbol"
                    value={symbol} 
                    onChange={this.handleChange} />
                <br></br>
                <label for="job">Total Supply</label>{' '}
                <input 
                    type="text" 
                    name="totalsupply" 
                    id="totalsupply"
                    value={totalsupply} 
                    onChange={this.handleChange} />
                {' '}
                <button type="submit">
                    Submit
                </button>
            </form>
        );
    }
}

export default Form;