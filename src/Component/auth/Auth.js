import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { signIn, signUp } from "./AuthService";

const Auth = () => {
    const [authMode, setAuthMode] = useState("signin");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rePassword: ''
    });

    const from = location.state?.from?.pathname || "/";

    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin");
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        if (authMode === 'signin' || formData.password === formData.rePassword) {
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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            const authData = {
                username: formData.username,
                password: formData.password
            };

            setLoading(true);
            if (authMode === 'signin') {
                signIn(authData).then(response => {
                    localStorage.setItem("jwt-token", response.data);
                    localStorage.setItem("username", formData.username);
                    const now = new Date();
                    localStorage.setItem("jwt-token-expiry", now.setHours(now.getHours() + 23));
                    setLoading(false);
                    navigate(from);
                }).catch(err => {
                    console.log("error while sigin: " + err);
                    setLoading(false);
                });
            } else {
                signUp(authData).then(() => {
                    setLoading(false);
                    changeAuthMode();
                }).catch(err => {
                    console.log("error while sigin-up: " + err);
                    setLoading(false);
                });
            }
        }
    }

    return (loading ? <div className="loading-spinner"></div> :
        <div className="Auth-form-container">
            <Form className="Auth-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">{authMode === 'signin' ? "Sign In" : "Sign Up"}</h3>
                    <div className="text-center">
                        {authMode === 'signin' ? "Not registered yet?" : "Already registered?"}{" "}
                        <span className="link-primary" onClick={changeAuthMode}>
                            {authMode === 'signin' ? "Sign Up" : "Sign In"}
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

                    {authMode === 'signup' &&
                        <FormGroup>
                            <Label for="rePassword">Confirm Password</Label>
                            <Input className="form-control mt-1" type="password" name="rePassword" id="rePassword" value={formData.rePassword}
                                onChange={handleChange} autoComplete="rePassword" />
                        </FormGroup>
                    }

                    <FormGroup className="d-grid gap-2 mt-3">
                        <Button type="submit">{authMode === 'signin' ? "Sign In" : "Sign Up"}</Button>
                    </FormGroup>
                </div>
            </Form>
        </div>
    )
}

export default Auth;