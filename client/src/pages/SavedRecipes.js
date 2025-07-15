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
    return (
        <div className="saved-recipes">
            <h1>Saved Recipes</h1>
            <ul className="recipe-list">
                {savedRecipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div className="recipe-item">
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