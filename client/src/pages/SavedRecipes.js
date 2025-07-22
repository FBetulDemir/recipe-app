import { useEffect, useState } from "react";
import axios from "axios";
import {useGetUserID} from "../hooks/useGetUserID.js";
import '../styles/SavedRecipes.css';

const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const userID = useGetUserID();


    useEffect(() => {

        const fetchSavedRecipe = async () => {
            try {
                const response = await axios.get (`http://localhost:3001/recipes/savedRecipes/${userID}`);
                setSavedRecipes(response.data.savedRecipes)
                // console.log (savedRecipes)
                // console.log(userID)
            } catch (error) {
                console.error("Error fetching recipes:", error)
            }
        }

        fetchSavedRecipe();
    }, [userID]);

    if (!userID) {
        return (
            <div className="saved-recipes">
                <h1>Saved Recipes</h1>
                <p>Please log in to view your saved recipes.</p>
            </div>
        );
    }

    if (userID && savedRecipes.length === 0) {
        return (
            <div className="saved-recipes">
                <h1>Saved Recipes</h1>
                <p>You did not save any recipes!</p>
            </div>
        );
    }

    const removeFromSaved = async (recipeID) => {
        try {
            const userID = window.localStorage.getItem("userID");
            await axios.put("http://localhost:3001/recipes/unsave", {
            recipeID,
            userID,
        });

        setSavedRecipes(prev =>
        prev.filter(recipe => recipe._id !== recipeID)
        );
        } catch (err) {
            console.error("Failed to remove recipe:", err);
        }
    };


    return (
        <div className="saved-recipes">
            <h1>Saved Recipes</h1>
            <ul className="recipe-list">
                {savedRecipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div className="recipe-item">
                            <button className="remove-btn" onClick={() => removeFromSaved(recipe._id)}>
                                Remove from Saved
                            </button>
                            <h2>{recipe.name}</h2>
                            <p>{recipe.instructions}</p>
                            <img src={recipe.imageUrl} alt={recipe.name}/>
                            <p>Cooking Time: {recipe.cookingTime} minutes</p>
                            <h3>Ingredients:</h3>
                                <ul>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                                </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SavedRecipes;