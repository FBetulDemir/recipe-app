import axios from "axios";
import { useEffect, useState } from "react";
import MainBanner from "../components/MainBanner.js";
import {useGetUserID} from "../hooks/useGetUserID.js";
import '../styles/Home.css';
import '../styles/SavedRecipes.css';

const API_BASE = "https://recipe-app-8t4e.onrender.com";

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const userID = useGetUserID();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`${API_BASE}/recipes`);
                setRecipes(response.data)
                console.log (response.data)
            } catch (error) {
                console.error("Error fetching recipes:", error)
            }
        }

        const fetchSavedRecipe = async () => {
            try {
                const response = await axios.get(`${API_BASE}/recipes/savedRecipes/ids/${userID}`);
                setSavedRecipes(Array.isArray(response.data.savedRecipes) ? response.data.savedRecipes : []);
                // console.log (savedRecipes)
                // console.log(userID)
            } catch (error) {
                console.error("Error fetching recipes:", error)
            }
        }

        fetchRecipe();
        fetchSavedRecipe();
    }, [userID]);


    const SaveRecipe = async (recipeID) => {
        try {
            const response = await axios.put(`${API_BASE}/recipes`, { recipeID, userID });

            if (response.data.savedRecipes) {
                // Update only savedRecipes state, not the main recipes list
                setSavedRecipes(Array.isArray(response.data.savedRecipes) ? response.data.savedRecipes.map(String) : []);
            }

            // Re-fetch recipes
            const recipeRes = await axios.get(`${API_BASE}/recipes`);
            setRecipes(recipeRes.data);

        } catch (error) {
            console.error("Error saving recipe:", error);
        }
    };


    const isRecipeSaved = (id) => savedRecipes.includes(String(id));


    return (
        <div className="home">
            <div className="banner">
                <MainBanner/>
            </div>
            <h1>Welcome to Herb & Heat</h1>
            <ul className="recipe-list">
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div className="recipe-item">
                            <h2>{recipe.name}</h2>
                            {userID && (
                                <button 
                                    onClick={() => SaveRecipe(recipe._id)}
                                    disabled={isRecipeSaved(recipe._id)}
                                >
                                    {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                                </button>
                            )}
                            {!userID && (
                                <button disabled>Login to Save</button>
                            )}

                            <p>{recipe.instructions}</p>
                            <img src={recipe.imageUrl} alt={recipe.name}/>
                            <p>Cooking Time: {recipe.cookingTime} minutes</p>
                            <p>Ingredients: {recipe.ingredients.join(", ")}</p>
                        </div>
                    </li>
                )
                )}
            </ul>
        </div>
        
    )
}

export default Home;