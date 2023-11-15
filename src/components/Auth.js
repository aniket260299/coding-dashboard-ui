import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import AuthService from "../service/AuthService";
import Utils from "./Utils";

const Auth = () => {
    const [authMode, setAuthMode] = useState("signin");
    const [loading, setLoading] = useState(false);

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

    const validateForm = () => {
        if (isSignIn || formData.password === formData.rePassword) {
            return true;
        }
        else {
            alert('Passwords not matched. Please re-enter!');
            setFormData({
                username: formData.username,
                password: '',
                rePassword: ''
            });
            return false;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const authData = {
                username: formData.username,
                password: formData.password
            };

            setLoading(true);
            const isAlive = await Utils.isAlive();
            let response;
            if (isAlive) {
                try {
                    response = isSignIn ? await AuthService.signIn(authData) : await AuthService.signUp(authData);
                } catch {
                    console.log("error while sign/sign-up");
                    setLoading(false);
                }
            }

            if (response?.data?.length > 0) {
                if (isSignIn) {
                    localStorage.setItem("jwt-token", response.data);
                    localStorage.setItem("username", formData.username);

                    const now = new Date();
                    localStorage.setItem("jwt-token-expiry", now.setHours(now.getHours() + 23));

                    await Utils.fetchDashboardList();
                    setLoading(false);
                    navigate(from);
                } else {
                    setLoading(false);
                    changeAuthMode();
                }
            }
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="loading-spinner"></div>
        );
    }

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
                        <button style={{ color: "black" }} type="submit">{isSignIn ? "[ Sign In ]" : "[ Sign Up ]"}</button>
                    </FormGroup>
                </div>
            </Form>
        </div>
    )
}

export default Auth;