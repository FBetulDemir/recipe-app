import { useState } from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [cookies, setCookies] = useCookies(["access_token"]);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/auth/login", {
                username,
                password,
            });
            setCookies("access_token", response.data.token)
            window.localStorage.setItem("userID", response.data.userID);
            navigate("/")
            console.log("Login success:", response.data);
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="login-wrapper">
            <h1>Login</h1>
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
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
export default Login;