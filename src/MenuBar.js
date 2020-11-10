import React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import AhojFinanceLogo from './img/narwhal75x78.png'

import { logout } from './App';
//"X-everest15z9krm5kfsy4vagstfxg9va2qykzgvw806gu8u"

const MenuBar = (props) => {
    const { userEmail, avaxAddress } = props;

    return (
        <Navbar fixed="top" collapseOnSelect expand="md" bg="light" variant="light">
            <Navbar.Brand href="#creatingasset"><img src={AhojFinanceLogo} width="40" height="40" className="d-inline-block align-top" alt="Ahoj Finance logo"
      /></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="justify-content-between"> 
                <Navbar.Text>
                    <b>Signed in as:</b>
                </Navbar.Text>
                <Nav>
                    <NavDropdown title={userEmail} id="avax-address">
                        <NavDropdown.Item><i>Avalanche Wallet Address:</i> {avaxAddress}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item><b>Asset Portfolio</b></NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item>AVAX: 40</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Form inline>
                    <Button type="submit">Logout</Button>
                </Form>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default MenuBar;