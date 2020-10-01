import React from 'react';
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

const TableHeaderAssets = () => { 
    return (
        <thead className="text-center">        
            <tr>
                <th></th>
                <th>Name</th>
                <th width="40px">Symbol</th>
                <th width="200px">Supply</th>
                <th width="100px"><Button variant="outline-info"></Button></th>
            </tr>
        </thead>
    );
}

const TableBodyAssets = props => { 
    const rows = props.assetData.map((row, index) => {
        return (
            <tr key={index}>
                <td>{index}</td>
                <td>{row.name}</td>
                <td>{row.symbol}</td>
                <td>{row.totalsupply}</td>
                <td><Button variant="outline-success" onClick={() => props.sendAsset(index)}>Send</Button></td>
            </tr>
        );
    });

    return <tbody>{rows}</tbody>;
}

const Table4Assets = (props) => {
    const { assetData, sendAsset } = props;

    return (
        <Table striped bordered hover variant="dark">
            <TableHeaderAssets />
            <TableBodyAssets assetData={assetData} sendAsset={sendAsset} />
        </Table>
    );
}

export default Table4Assets;