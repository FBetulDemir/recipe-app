import { useState } from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import '../styles/Login.css';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [, setCookies] = useCookies(["access_token"]);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const response = await axios.post("https://recipe-app-8t4e.onrender.com/auth/login", {
                username,
                password,
            });

            const { token, userID } = response.data;

            if (token && userID) {
                setCookies("access_token", token);
                window.localStorage.setItem("userID", userID);
                navigate("/");
                console.log("Login success:", response.data);
            } else {
                setError("Invalid username or password.");
            }

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Login failed. Please check your credentials.");
            }
        }
    };

    return (
        <div className="login-wrapper">
            <h1>Login</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="submit-btn">Login</button>
            </form>
        </div>
    )
}
export default Login;