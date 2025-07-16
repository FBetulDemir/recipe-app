import axios from "axios";
import { useEffect, useState } from "react";
import MainBanner from "../components/MainBanner.js";
import {useGetUserID} from "../hooks/useGetUserID.js";
import '../styles/Home.css';
import '../styles/SavedRecipes.css';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const userID = useGetUserID();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get ("http://localhost:3001/recipes");
                setRecipes(response.data)
                console.log (response.data)
            } catch (error) {
                console.error("Error fetching recipes:", error)
            }
        }

        const fetchSavedRecipe = async () => {
            try {
                const response = await axios.get (`http://localhost:3001/recipes/savedRecipes/ids/${userID}`);
                setSavedRecipes(response.data.savedRecipes)
                // console.log (savedRecipes)
                // console.log(userID)
            } catch (error) {
                console.error("Error fetching recipes:", error)
            }
        }

        fetchRecipe();
        fetchSavedRecipe();
    }, [userID]);


    const SaveRecipe = async(recipeID) => {
        try {
            const response = await axios.put("http://localhost:3001/recipes" ,{recipeID, userID});
            setSavedRecipes(response.data.savedRecipes);
            console.log("Recipe saved successfully:", response.data.savedRecipes);

        } catch (error) {
            console.error("Error saving recipe:" , error);
        }
    }

    const isRecipeSaved = (id) => Array.isArray(savedRecipes) && savedRecipes.includes(id);



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