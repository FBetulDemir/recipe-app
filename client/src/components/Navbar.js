import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import '../styles/Navbar.css';

const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo link">
        <span className="logo-herb">Herb</span>
        <span className="logo-and">&</span>
        <span className="logo-heat">Heat</span>
      </Link>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/create-recipe" className="link" onClick={() => setMenuOpen(false)}>Create recipe</Link>
        <Link to="/saved-recipes" className="link" onClick={() => setMenuOpen(false)}>Saved recipes</Link>
        <Link to="/register" className="link" onClick={() => setMenuOpen(false)}><button className="register-btn default-btn">Register</button></Link>
        {!cookies.access_token ? (
          <Link to="/login" className="link default-btn" onClick={() => setMenuOpen(false)}>Login</Link>
        ) : (
          <button className="default-btn" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
        )}
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </nav>
  );
};

export default Navbar;
