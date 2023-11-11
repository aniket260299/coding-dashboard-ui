import React, { useEffect } from 'react';
import Utils from './Utils';
import { Navbar, NavbarBrand } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    let token = localStorage.getItem("jwt-token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!Utils.authenticated()) {
            navigate("/auth");
        }
    }, []);

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