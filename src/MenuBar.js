import React, {Component} from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
//"X-everest15z9krm5kfsy4vagstfxg9va2qykzgvw806gu8u"

const MenuBar = (props) => {
    const { avaxAddress } = props;

    return (
        <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#creatingasset">Asset Issuance</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto" /> 
                <Nav>
                    <NavDropdown title={avaxAddress} id="avax-address">
                        <NavDropdown.Item href="#">{avaxAddress}</NavDropdown.Item>
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
    );
}

export default MenuBar;