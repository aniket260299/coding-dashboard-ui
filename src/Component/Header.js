import React, { useEffect } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import { authenticated } from './common/Utils';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    let token = localStorage.getItem("jwt-token");
    const navigate = useNavigate();

    useEffect(() => {
        !authenticated() && navigate("/auth");
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/auth");
    };

    return (
        token &&
        <div style={{ padding: '5px 15px' }}>
            <Navbar color="light" expand="md">
                <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
                <NavbarBrand className="justify-content-end"
                    tag={Link} to="/auth" onClick={handleLogout}>Logout
                </NavbarBrand>
            </Navbar>
        </div>
    );
};

export default Header;