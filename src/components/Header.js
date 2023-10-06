import React, { useState, useEffect } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

function Header() {

    const [isOpen, setIsOpen] = useState(false);
    let token = localStorage.getItem("jwt-token");
    const navigate = useNavigate();

    useEffect(() => {
        token = localStorage.getItem("jwt-token");
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("auth");
    };

    return (
        token ?
            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
                    <NavbarToggler onClick={() => { setIsOpen(!isOpen) }} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="justify-content-end" style={{ width: "100%" }} navbar>
                            <NavItem>
                                <NavLink onClick={handleLogout}>Logout</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
            : <></>
    );
};

export default Header;