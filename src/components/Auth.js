import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import AuthService from "../service/AuthService";

const Auth = () => {
    const [authMode, setAuthMode] = useState("signin");

    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin");
    };

    const isSignIn = authMode === "signin";

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rePassword: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboards";
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const authData = {
            username: formData.username,
            password: formData.password
        };

        const response = await (isSignIn ? AuthService.signIn(authData) : AuthService.signUp(authData));

        if (isSignIn) {
            localStorage.setItem("jwt-token", response.data);
            navigate(from);
        } else {
            changeAuthMode();
        }
    };

    return (
        <div className="Auth-form-container">
            <Form className="Auth-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">{isSignIn ? "Sign In" : "Sign Up"}</h3>
                    <div className="text-center">
                        {isSignIn ? "Not registered yet?" : "Already registered?"}{" "}
                        <span className="link-primary" onClick={changeAuthMode}>
                            {isSignIn ? "Sign Up" : "Sign In"}
                        </span>
                    </div>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input className="form-control mt-1" type="Textbox" name="username" id="username" value={formData.username}
                            onChange={handleChange} autoComplete="username" />
                    </FormGroup>

                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input className="form-control mt-1" type="password" name="password" id="password" value={formData.password}
                            onChange={handleChange} autoComplete="password" />
                    </FormGroup>

                    {!isSignIn &&
                        <FormGroup>
                            <Label for="rePassword">Confirm Password</Label>
                            <Input className="form-control mt-1" type="password" name="rePassword" id="rePassword" value={formData.rePassword}
                                onChange={handleChange} autoComplete="rePassword" />
                        </FormGroup>
                    }

                    <FormGroup className="d-grid gap-2 mt-3">
                        <Button color="primary" type="submit">{isSignIn ? "Sign In" : "Sign Up"}</Button>
                    </FormGroup>
                </div>
            </Form>
        </div>
    )
}

export default Auth;