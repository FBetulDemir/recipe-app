import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Auth from './pages/auth.js';
import CreateRecipe from './pages/CreateRecipes.js';
import SavedRecipes from './pages/SavedRecipes.js';
import Navbar from './components/Navbar.js';
import Register from './components/Register.js';
import Login from './components/Login.js';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
