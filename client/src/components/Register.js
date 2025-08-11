import axios from "axios";
import { useState } from "react";
import '../styles/Register.css';


const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // await axios.post("http://localhost:3001/auth/register")
            const response = await axios.post("https://recipe-app-8t4e.onrender.com/auth/register", {
                username,
                password,
            });
            console.log("Login success:", response.data);
            alert("Registration successful! You can now log in.");
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
        }
    };

    return (
        <div className="register-wrapper">
            <h1>Register</h1>
            <p>Create a new user to save recipes!</p>
            <form>
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
                <button type="submit" className="register-btn" onClick={handleSubmit }>Register</button>
            </form>
        </div>
    )
}
export default Register;