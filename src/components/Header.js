import React, { useState, useEffect } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

function Header() {

    const [isOpen, setIsOpen] = useState(false);
    let token = localStorage.getItem("jwt-token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticated()) {
            navigate("/auth");
        }
    }, []);

    const authenticated = () => {
        if (token) {
            const now = new Date();
            const expiry = new Date(Number(localStorage.getItem("jwt-token-expiry")));
            if (expiry > now) return true;
        }
        localStorage.clear();
        return false;
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/auth");
    };


    return (
        token ?
            <div style={{ padding: '5px 15px' }}>
                <Navbar color="light" expand="md">
                    <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
                    <NavbarBrand className="justify-content-end"
                        tag={Link} to="/auth" onClick={handleLogout}>Logout
                    </NavbarBrand>
                </Navbar>
            </div>
            : <></>
    );
};

export default Header;