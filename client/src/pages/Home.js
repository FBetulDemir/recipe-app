import axios from "axios";
import { useEffect, useState } from "react";
import MainBanner from "../components/MainBanner.js";
import useGetuserID from "../hooks/useGetUserID.js";
import '../styles/Home.css';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const userID = useGetuserID();

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
                const response = await axios.get ("http://localhost:3001/recipes/savedRecipes/ids", {userID});
                setSavedRecipes(response.data)
                console.log (response.data)
            } catch (error) {
                console.error("Error fetching recipes:", error)
            }
        }

        fetchRecipe();
        fetchSavedRecipe();
    }, []);


    const SaveRecipe = async(recipeID) => {
        try {
            const response = await axios.put("http://localhost:3001/recipes" ,{recipeID, userID});
            setRecipes(response.data);

        } catch (error) {
            console.error("Error saving recipe:" , error);
        }
    }


    return (
        <div className="home">
            <div className="banner">
                <MainBanner/>
            </div>
            <h1>Welcome</h1>
            <ul className="recipe-list">
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div className="recipe-item">
                            <h2>{recipe.name}</h2>
                            <button onClick={() => SaveRecipe(recipe._id)}>Save</button>
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