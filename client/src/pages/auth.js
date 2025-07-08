import Login from "../components/Login.js";
import Register from "../components/Register.js";

const Auth = () => {
    return (
        <div className="home">
            <h1>Auth</h1>
            <div className="auth-wrapper">
                <Register/>
                <Login/>
            </div>
 
        </div>
        
    )
}

export default Auth;