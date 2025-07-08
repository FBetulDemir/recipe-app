import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar">
            <Link to="/">Home</Link>
            <Link to="/create-recipe">Create recipe</Link>
            <Link to="/saved-recipes">Saved recipes</Link>
            <Link to="/auth">Login</Link>
        </div>
    )
}

export default Navbar;